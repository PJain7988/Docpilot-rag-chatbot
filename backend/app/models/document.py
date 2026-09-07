import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import enum
from sqlalchemy import Enum
from datetime import datetime, timezone
from ..core.database import Base

class DocumentStatus(str, enum.Enum):
    UPLOADING = "UPLOADING"
    PROCESSING = "PROCESSING"
    INDEXING = "INDEXING"
    READY = "READY"
    FAILED = "FAILED"

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)
    file_size = Column(Integer)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADING)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    owner = relationship("User", backref="documents")
    
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"))
    chunk_index = Column(Integer)
    text = Column(String)
    page_number = Column(Integer, nullable=True)
    
    document = relationship("Document", back_populates="chunks")
