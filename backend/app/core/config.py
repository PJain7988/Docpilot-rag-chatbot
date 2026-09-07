from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "IntelliRAG API"
    API_V1_STR: str = "/api"
    
    # Auth
    JWT_SECRET_KEY: str = "default_unsafe_secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # DB (using SQLite for local testing without Docker)
    DATABASE_URL: str = "sqlite+aiosqlite:///./intellirag.db"
    
    # Redis
    REDIS_URL: Optional[str] = None
    
    # Qdrant
    QDRANT_URL: Optional[str] = "http://localhost:6333"
    
    # LLM & Embedding Models
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # RAG Config
    TOP_K: int = 10
    RERANK_TOP_K: int = 5
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
