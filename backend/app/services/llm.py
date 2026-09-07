import logging
from ..core.config import settings
from langchain_core.prompts import PromptTemplate

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.llm = self._initialize_llm()

    def _initialize_llm(self):
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_api_key_here":
            try:
                from langchain_openai import ChatOpenAI
                return ChatOpenAI(
                    model="gpt-4o-mini",
                    api_key=settings.OPENAI_API_KEY,
                    temperature=0.0
                )
            except ImportError:
                logger.warning("langchain_openai not installed. Cannot use OpenAI.")
                
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
            try:
                from langchain_google_genai import ChatGoogleGenerativeAI
                return ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash",
                    google_api_key=settings.GEMINI_API_KEY,
                    temperature=0.0
                )
            except ImportError:
                logger.warning("langchain_google_genai not installed. Cannot use Gemini.")
                
        raise ValueError("No valid LLM configuration found (OpenAI or Gemini API Key missing or invalid).")

    def generate_answer(self, query: str, context: str) -> str:
        prompt_template = """
        You are IntelliRAG, an AI Enterprise Knowledge Assistant.
        Answer the user's question using ONLY the provided retrieved context.
        If the context does not contain the answer, say "I couldn't find sufficient information in the uploaded knowledge base to answer this reliably."
        Always cite the source document and page number for facts you retrieve.

        <retrieved_context>
        {context}
        </retrieved_context>

        User Question: {query}
        
        Answer:
        """
        prompt = PromptTemplate.from_template(prompt_template)
        chain = prompt | self.llm
        response = chain.invoke({"context": context, "query": query})
        return response.content

llm_service = LLMService()
