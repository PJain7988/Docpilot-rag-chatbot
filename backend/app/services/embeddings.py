from sentence_transformers import SentenceTransformer
from typing import List
from ..core.config import settings

class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)

    def embed_text(self, text: str) -> List[float]:
        # returns a single embedding
        return self.model.encode(text).tolist()
        
    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        # returns list of embeddings
        return self.model.encode(texts).tolist()
        
    def embed_query(self, query: str) -> List[float]:
        # returns embedding for query (some models prepend 'query: ')
        return self.model.encode(query).tolist()

# Singleton instance
embedder = EmbeddingService()
