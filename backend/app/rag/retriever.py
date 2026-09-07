import logging
from typing import List, Dict, Any
from ..core.vector_store import vector_store
from ..services.embedding_service import embedding_service
from ..core.config import settings

logger = logging.getLogger(__name__)

class Retriever:
    @staticmethod
    def retrieve(query: str, top_k: int = None, filter_dict: dict = None) -> List[Dict[str, Any]]:
        top_k = top_k or settings.TOP_K
        logger.info(f"Retrieving top {top_k} chunks for query: '{query}'")
        
        # 1. Embed Query
        query_vector = embedding_service.embed_query(query)
        
        # 2. Search Qdrant
        search_results = vector_store.search(
            query_vector=query_vector,
            limit=top_k,
            filter_dict=filter_dict
        )
        
        # 3. Format results
        results = []
        for scored_point in search_results:
            results.append({
                "id": scored_point.id,
                "score": scored_point.score,
                "payload": scored_point.payload
            })
            
        logger.info(f"Retrieved {len(results)} chunks.")
        return results

retriever = Retriever()
