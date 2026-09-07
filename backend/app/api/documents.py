import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import uuid

from ..core.database import get_db
from ..models.user import User
from ..models.document import Document, DocumentStatus
from ..schemas.document import DocumentResponse
from .deps import get_current_user
from ..services.document_service import DocumentService

router = APIRouter()
UPLOAD_DIR = "uploads"

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    allowed_extensions = [".pdf", ".docx", ".txt", ".csv", ".pptx"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Please upload {', '.join(allowed_extensions)}.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    file_id = uuid.uuid4()
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
    
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    new_doc = Document(
        id=file_id,
        filename=file.filename,
        file_type=ext.lstrip("."),
        file_size=file_size,
        status=DocumentStatus.UPLOADING,
        owner_id=current_user.id
    )
    db.add(new_doc)
    await db.commit()
    await db.refresh(new_doc)
    
    # Process in background
    background_tasks.add_task(
        DocumentService.process_document_background, 
        document_id=str(new_doc.id), 
        file_path=file_path, 
        file_name=file.filename, 
        file_type=ext.lstrip("."),
        owner_id=str(current_user.id)
    )
    
    return new_doc

@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        result = await db.execute(select(Document))
    else:
        result = await db.execute(select(Document).where(Document.owner_id == current_user.id))
    return result.scalars().all()
