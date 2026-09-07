from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime
from .user import UserResponse
from ..models.document import DocumentStatus

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    file_size: int

class DocumentResponse(DocumentBase):
    id: uuid.UUID
    status: DocumentStatus
    uploaded_at: datetime
    owner_id: uuid.UUID

    class Config:
        from_attributes = True

class DocumentDetailResponse(DocumentResponse):
    chunk_count: int

    class Config:
        from_attributes = True
