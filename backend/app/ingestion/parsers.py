import fitz  # PyMuPDF
import docx
import pandas as pd
from io import BytesIO
import csv
import io
from typing import List, Dict, Any
import pptx

class DocumentParser:
    @staticmethod
    def parse_pdf(file_bytes: bytes) -> List[Dict[str, Any]]:
        extracted_data = []
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text("text").strip()
                if text:
                    extracted_data.append({
                        "text": text,
                        "page_number": page_num + 1,
                        "section": None
                    })
        except Exception as e:
            raise ValueError(f"Error parsing PDF: {str(e)}")
        return extracted_data

    @staticmethod
    def parse_docx(file_bytes: bytes) -> List[Dict[str, Any]]:
        extracted_data = []
        try:
            doc = docx.Document(BytesIO(file_bytes))
            current_heading = None
            current_text = []

            for paragraph in doc.paragraphs:
                if paragraph.style.name.startswith('Heading'):
                    if current_text:
                        extracted_data.append({
                            "text": "\n".join(current_text).strip(),
                            "page_number": None,
                            "section": current_heading
                        })
                        current_text = []
                    current_heading = paragraph.text.strip()
                elif paragraph.text.strip():
                    current_text.append(paragraph.text.strip())

            if current_text:
                extracted_data.append({
                    "text": "\n".join(current_text).strip(),
                    "page_number": None,
                    "section": current_heading
                })
        except Exception as e:
            raise ValueError(f"Error parsing DOCX: {str(e)}")
        
        # Fallback if no headings were found or parsing was flat
        if not extracted_data:
            full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
            if full_text:
                extracted_data.append({"text": full_text, "page_number": None, "section": None})
                
        return extracted_data

    @staticmethod
    def parse_txt(file_bytes: bytes) -> List[Dict[str, Any]]:
        try:
            text = file_bytes.decode('utf-8').strip()
            if text:
                return [{"text": text, "page_number": None, "section": None}]
            return []
        except UnicodeDecodeError:
            raise ValueError("TXT file must be valid UTF-8")

    @staticmethod
    def parse_csv(file_bytes: bytes) -> List[Dict[str, Any]]:
        extracted_data = []
        try:
            df = pd.read_csv(BytesIO(file_bytes))
            for index, row in df.iterrows():
                # Convert row to textual representation
                row_text = ", ".join([f"{col}: {val}" for col, val in row.items() if pd.notna(val)])
                if row_text:
                    extracted_data.append({
                        "text": row_text,
                        "page_number": index + 1, # Using row index as page_number for tracking
                        "section": "CSV Data Row"
                    })
        except Exception as e:
            raise ValueError(f"Error parsing CSV: {str(e)}")
        return extracted_data

    @staticmethod
    def parse_pptx(file_bytes: bytes) -> List[Dict[str, Any]]:
        extracted_data = []
        try:
            prs = pptx.Presentation(BytesIO(file_bytes))
            for i, slide in enumerate(prs.slides):
                slide_text = []
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        slide_text.append(shape.text.strip())
                text = "\n".join([t for t in slide_text if t])
                if text:
                    extracted_data.append({
                        "text": text,
                        "page_number": i + 1,
                        "section": None
                    })
        except Exception as e:
            raise ValueError(f"Error parsing PPTX: {str(e)}")
        return extracted_data

    @classmethod
    def parse(cls, file_bytes: bytes, file_type: str) -> List[Dict[str, Any]]:
        file_type = file_type.lower()
        if file_type == 'pdf' or file_type == 'application/pdf':
            return cls.parse_pdf(file_bytes)
        elif file_type in ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            return cls.parse_docx(file_bytes)
        elif file_type in ['txt', 'text/plain']:
            return cls.parse_txt(file_bytes)
        elif file_type in ['csv', 'text/csv']:
            return cls.parse_csv(file_bytes)
        elif file_type in ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']:
            return cls.parse_pptx(file_bytes)
        else:
            raise ValueError(f"Unsupported file type: {file_type}")
