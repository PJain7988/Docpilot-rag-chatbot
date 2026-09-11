from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import contextlib

from app.core.config import settings
from app.core.database import engine, Base
from app.models.user import User
from app.models.document import Document
from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(documents_router, prefix=f"{settings.API_V1_STR}/documents", tags=["Documents"])
app.include_router(chat_router, prefix=f"{settings.API_V1_STR}/chat", tags=["Chat"])

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

@app.get("/api/debug/qdrant", tags=["Debug"])
def debug_qdrant():
    from app.core.vector_store import vector_store
    try:
        count = vector_store.client.get_collection("intellirag_docs").points_count
        return {"points_count": count}
    except Exception as e:
        return {"error": str(e)}
