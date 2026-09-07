import logging
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import AsyncSessionLocal
from ..models.document import Document, DocumentChunk, DocumentStatus
from ..ingestion.parsers import DocumentParser
from ..ingestion.chunker import DocumentChunker
from .embedding_service import embedding_service
from ..core.vector_store import vector_store

logger = logging.getLogger(__name__)

class DocumentService:
    @staticmethod
    async def process_document_background(document_id: str, file_path: str, file_name: str, file_type: str, owner_id: str):
        try:
            with open(file_path, "rb") as f:
                file_bytes = f.read()
            
            async with AsyncSessionLocal() as db:
                await DocumentService.process_document(db, document_id, file_bytes, file_name, file_type, owner_id)
        except Exception as e:
            logger.error(f"Failed to read file {file_path} for background processing: {e}")
            # If we could, we would mark the doc as failed, but we need a db session
            async with AsyncSessionLocal() as db:
                doc = await db.get(Document, document_id)
                if doc:
                    doc.status = DocumentStatus.FAILED
                    await db.commit()

    @staticmethod
    async def process_document(db: AsyncSession, document_id: str, file_bytes: bytes, file_name: str, file_type: str, owner_id: str):
        doc = await db.get(Document, document_id)
        if not doc:
            logger.error(f"Document {document_id} not found in database.")
            return

        try:
            # 1. Parse Document
            doc.status = DocumentStatus.PROCESSING
            await db.commit()
            
            logger.info(f"Parsing document {document_id}")
            parsed_data = DocumentParser.parse(file_bytes, file_type)
            
            # 2. Chunk Document
            logger.info(f"Chunking document {document_id}")
            chunker = DocumentChunker()
            chunks = chunker.chunk_documents(parsed_data)
            
            if not chunks:
                logger.warning(f"No text extracted from document {document_id}")
                doc.status = DocumentStatus.FAILED
                await db.commit()
                return

            # 3. Save chunks to DB
            doc.status = DocumentStatus.INDEXING
            await db.commit()
            
            db_chunks = []
            for chunk in chunks:
                db_chunk = DocumentChunk(
                    document_id=document_id,
                    chunk_index=chunk["chunk_index"],
                    text=chunk["text"],
                    page_number=chunk.get("page_number")
                )
                db.add(db_chunk)
                db_chunks.append(db_chunk)
            
            await db.flush() # flush to get chunk IDs
            
            # 4. Embed chunks
            logger.info(f"Embedding {len(chunks)} chunks for document {document_id}")
            texts_to_embed = [chunk["text"] for chunk in chunks]
            vectors = embedding_service.embed_documents(texts_to_embed)
            
            # 5. Save to Qdrant
            payloads = []
            for chunk, db_chunk in zip(chunks, db_chunks):
                payloads.append({
                    "chunk_id": str(db_chunk.id),
                    "document_id": str(document_id),
                    "owner_id": str(owner_id),
                    "filename": file_name,
                    "text": chunk["text"],
                    "page_number": chunk.get("page_number"),
                    "section": chunk.get("section")
                })
                
            vector_store.insert_chunks(vectors, payloads)
            
            # 6. Complete
            doc.status = DocumentStatus.READY
            await db.commit()
            logger.info(f"Document {document_id} processed successfully.")

        except Exception as e:
            logger.error(f"Error processing document {document_id}: {str(e)}")
            doc.status = DocumentStatus.FAILED
            await db.commit()
            raise
