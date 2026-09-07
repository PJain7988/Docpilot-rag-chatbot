import logging
from typing import List, Dict, Any
from sentence_transformers import CrossEncoder
from ..core.config import settings

logger = logging.getLogger(__name__)

class Reranker:
    def __init__(self, model_name: str = 'cross-encoder/ms-marco-MiniLM-L-6-v2'):
        logger.info(f"Loading reranker model: {model_name}")
        try:
            self.model = CrossEncoder(model_name)
        except Exception as e:
            logger.error(f"Failed to load reranker model: {e}")
            self.model = None

    def rerank(self, query: str, retrieved_chunks: List[Dict[str, Any]], top_k: int = None) -> List[Dict[str, Any]]:
        top_k = top_k or settings.RERANK_TOP_K
        
        if not retrieved_chunks:
            return []
            
        if not self.model:
            logger.warning("Reranker model not loaded. Returning un-reranked results.")
            return retrieved_chunks[:top_k]

        # Prepare pairs of (query, document_text)
        pairs = [[query, chunk["payload"]["text"]] for chunk in retrieved_chunks]
        
        # Predict scores
        scores = self.model.predict(pairs)
        
        # Add scores to chunks and sort
        for idx, chunk in enumerate(retrieved_chunks):
            chunk["rerank_score"] = float(scores[idx])
            
        reranked = sorted(retrieved_chunks, key=lambda x: x["rerank_score"], reverse=True)
        
        logger.info(f"Reranked {len(retrieved_chunks)} chunks. Returning top {top_k}.")
        return reranked[:top_k]

reranker = Reranker()
