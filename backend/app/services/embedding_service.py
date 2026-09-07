from sentence_transformers import SentenceTransformer
from typing import List
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.EMBEDDING_MODEL
        logger.info(f"Loading embedding model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name)

    def embed_text(self, text: str) -> List[float]:
        return self.model.encode(text).tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self.model.encode(texts).tolist()

    def embed_query(self, query: str) -> List[float]:
        return self.embed_text(query)

# Singleton instance
embedding_service = EmbeddingService()
