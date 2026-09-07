import os
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyMuPDFLoader, Docx2txtLoader, TextLoader, CSVLoader
import logging

from ..models.document import Document, DocumentStatus, DocumentChunk
from ..core.config import settings

logger = logging.getLogger(__name__)

async def process_document(file_path: str, doc_id: uuid.UUID, db: AsyncSession):
    # Fetch doc
    result = await db.execute(select(Document).where(Document.id == doc_id))
    doc = result.scalars().first()
    if not doc:
        return
        
    doc.status = DocumentStatus.PROCESSING
    await db.commit()
    
    try:
        ext = doc.file_type.lower()
        if ext == "pdf":
            loader = PyMuPDFLoader(file_path)
        elif ext == "docx":
            loader = Docx2txtLoader(file_path)
        elif ext == "csv":
            loader = CSVLoader(file_path)
        else:
            loader = TextLoader(file_path)
            
        docs = loader.load()
        
        doc.status = DocumentStatus.INDEXING
        await db.commit()
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
        )
        chunks = splitter.split_documents(docs)
        
        # Save chunks to DB
        vectors = []
        payloads = []
        
        for i, chunk in enumerate(chunks):
            page_num = chunk.metadata.get("page")
            if page_num is not None:
                # PyMuPDF uses 0-indexed pages
                page_num += 1
                
            db_chunk = DocumentChunk(
                document_id=doc.id,
                chunk_index=i,
                text=chunk.page_content,
                page_number=page_num
            )
            db.add(db_chunk)
            
            # Prepare for Qdrant
            from .embedding_service import embedding_service
            vector = embedding_service.embed_query(chunk.page_content)
            vectors.append(vector)
            payloads.append({
                "document_id": str(doc.id),
                "filename": doc.filename,
                "text": chunk.page_content,
                "page": str(page_num) if page_num else "1"
            })
            
        # Push to Qdrant
        if vectors:
            from ..core.vector_store import vector_store
            vector_store.insert_chunks(vectors, payloads)
            
        doc.status = DocumentStatus.READY
        await db.commit()
        
    except Exception as e:
        logger.error(f"Error processing doc {doc_id}: {str(e)}")
        doc.status = DocumentStatus.FAILED
        await db.commit()
    finally:
        # Cleanup file if desired, but we might want to keep it for downloads
        pass
