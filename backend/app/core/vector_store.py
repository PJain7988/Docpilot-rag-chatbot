from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from .config import settings

class VectorStore:
    def __init__(self):
        # Fallback to local memory/disk if QDRANT_URL is not provided or fails to connect
        try:
            self.client = QdrantClient(url=settings.QDRANT_URL)
            # test connection
            self.client.get_collections()
        except Exception:
            self.client = QdrantClient(path=":memory:") # Use memory for local dev if qdrant is down
            
        self.collection_name = "intellirag_docs"
        self._ensure_collection()

    def _ensure_collection(self):
        collections = self.client.get_collections().collections
        if not any(c.name == self.collection_name for c in collections):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=384, distance=Distance.COSINE), # 384 for all-MiniLM-L6-v2
            )
            
    def insert_chunks(self, vectors: list[list[float]], payloads: list[dict]):
        from qdrant_client.http.models import PointStruct
        import uuid
        
        points = [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload=payload
            )
            for vector, payload in zip(vectors, payloads)
        ]
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
    def search(self, query_vector: list[float], limit: int = 10, filter_dict: dict = None):
        from qdrant_client.http.models import Filter, FieldCondition, MatchValue
        
        query_filter = None
        if filter_dict:
            must_conditions = []
            for key, value in filter_dict.items():
                must_conditions.append(
                    FieldCondition(key=key, match=MatchValue(value=value))
                )
            query_filter = Filter(must=must_conditions)
            
        return self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            query_filter=query_filter,
            limit=limit
        ).points

vector_store = VectorStore()
