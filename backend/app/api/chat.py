from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Union
from ..models.user import User
from .deps import get_current_user
from ..rag.retriever import retriever
from ..rag.reranker import reranker
from ..rag.generator import generator
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    workspace_id: Optional[str] = None

class Citation(BaseModel):
    id: int
    document: str
    page: Union[str, int]
    text_snippet: str

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    request_obj: Request,
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Retrieve
        filter_dict = {}
        # Simple RBAC isolation: users only see their own docs unless admin
        if current_user.role != "admin":
            filter_dict["owner_id"] = str(current_user.id)
            
        retrieved_chunks = retriever.retrieve(request.query, filter_dict=filter_dict)
        
        # 2. Rerank
        reranked_chunks = reranker.rerank(request.query, retrieved_chunks)
        
        # Extract dynamic LLM settings
        provider = request_obj.headers.get("x-llm-provider", "openai")
        api_key = request_obj.headers.get("x-gemini-api-key", None)
        
        # 3. Generate Answer
        answer, citations = await generator.generate_answer(
            request.query, 
            reranked_chunks,
            api_key=api_key,
            provider=provider
        )
        
        return ChatResponse(
            answer=answer,
            citations=citations
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        logger.error(f"Chat error: {error_details}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {error_details}")
