from langchain_text_splitters import RecursiveCharacterTextSplitter
from typing import List, Dict, Any
from ..core.config import settings

class DocumentChunker:
    def __init__(self, chunk_size: int = None, chunk_overlap: int = None):
        self.chunk_size = chunk_size or settings.CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or settings.CHUNK_OVERLAP
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def chunk_documents(self, parsed_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        chunks = []
        chunk_index = 0
        for item in parsed_data:
            text = item.get("text", "")
            if not text:
                continue
            
            # Split text
            splits = self.text_splitter.split_text(text)
            for split in splits:
                chunks.append({
                    "chunk_index": chunk_index,
                    "text": split,
                    "page_number": item.get("page_number"),
                    "section": item.get("section")
                })
                chunk_index += 1
        return chunks
