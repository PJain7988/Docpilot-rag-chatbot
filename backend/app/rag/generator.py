import google.generativeai as genai
from typing import List, Dict, Any, Tuple
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class Generator:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
            logger.warning("GEMINI_API_KEY not set. Generation will be mocked.")

    async def generate_answer(self, query: str, context_chunks: List[Dict[str, Any]], api_key: str = None, provider: str = None) -> Tuple[str, List[Dict[str, Any]]]:
        if not context_chunks:
            return "[DEBUG: Qdrant returned 0 chunks!] I couldn't find sufficient information in the knowledge base.", []

        # Construct Context Block
        context_str = "<retrieved_context>\n"
        valid_citations = []
        for i, chunk in enumerate(context_chunks):
            payload = chunk.get("payload", {})
            doc_name = payload.get("filename", "Unknown Document")
            page_num = payload.get("page_number", "N/A")
            text = payload.get("text", "")
            
            context_str += f"[Source {i+1}: {doc_name}, Page {page_num}]\n{text}\n\n"
            valid_citations.append({
                "id": i+1,
                "document": doc_name,
                "page": page_num,
                "text_snippet": text[:150] + "..."
            })
            
        context_str += "</retrieved_context>"
        
        prompt = f"""You are a helpful and intelligent AI assistant.
You have been provided with some reference context below that was retrieved from the user's uploaded documents.
Use this context to answer the user's question if it is relevant. 
If the answer is found in the context, cite your sources using the format [Source X] where X is the source number.
If the context does not contain the answer, you may use your own general knowledge to answer the question, but politely mention that the information is from your general knowledge and not the uploaded documents.

{context_str}

User Question: {query}
Answer:"""

        # Initialize model dynamically based on provided key, or fallback to default
        model = self.model
        if provider == "gemini" and api_key:
            try:
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-pro')
            except Exception as e:
                logger.error(f"Error configuring dynamic Gemini API key: {e}")
        elif provider == "openai":
            # For this MVP, we haven't implemented OpenAI completely, so we'll just mock it or say it's coming soon.
            return f"OpenAI integration is configured, but not fully implemented in the backend yet! Your API key is safe.", valid_citations[:1]

        if not model:
            # Mock response for testing UI without API key
            return f"This is a mocked answer because GEMINI_API_KEY is not set. Based on the retrieved context, the answer is related to the query '{query}'. According to the documentation [Source 1], this is how the system behaves.", valid_citations[:1]

        try:
            response = await model.generate_content_async(prompt)
            return response.text, valid_citations
        except Exception as e:
            logger.error(f"Error during LLM generation: {e}")
            return f"The AI service failed: {e}", []

generator = Generator()
