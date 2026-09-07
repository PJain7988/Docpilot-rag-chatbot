<div align="center">
  <img src="frontend/public/icons.svg" alt="Logo" width="80" height="80">
  <h1 align="center">DocPilot AI</h1>
  <p align="center">
    <strong>Enterprise-Grade Document Intelligence & RAG Platform</strong>
    <br />
    <br />
    <a href="https://github.com/PJain7988/Docpilot-rag-chatbot/issues">Report Bug</a>
    ·
    <a href="https://github.com/PJain7988/Docpilot-rag-chatbot/issues">Request Feature</a>
  </p>
</div>

<details open>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#environment-variables">Environment Variables</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

## About The Project

DocPilot AI (internally known as IntelliRAG) is a modern, full-stack Retrieval-Augmented Generation (RAG) platform. It allows organizations to easily index their proprietary documents, PDFs, and files, and provides a beautiful, unified interface to perform semantic searches and chat directly with an AI assistant grounded in that specific corporate knowledge.

With a highly modular FastAPI backend and a state-of-the-art React frontend, the platform is designed to be easily deployed either locally (with in-memory fallbacks) or scaled across enterprise clusters using Docker, Qdrant, and Redis.

## Features

- 🔍 **Semantic Vector Search**: Instantly find exact document snippets using natural language queries instead of just keywords.
- 💬 **Conversational AI (RAG)**: Chat directly with your documents. The LLM understands the context of your uploaded knowledge base.
- 📄 **Multi-Format Ingestion**: Seamlessly upload and chunk PDFs, DOCX, TXT, CSV, and PPTX files.
- 🎨 **Premium UI/UX**: A responsive, dark-mode focused dashboard featuring dynamic sidebars, smooth micro-animations, and glassmorphism components.
- 🛡️ **Role-Based Access**: Built-in authentication (JWT) and user management workflows for Admins, Editors, and Viewers.
- 🛠️ **Frictionless Local Dev**: The backend automatically falls back to SQLite and an in-memory Vector Database if Docker/Qdrant aren't available on your machine.

## Tech Stack

**Frontend:**
- [React 18](https://reactjs.org/) & [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python Async API)
- [SQLAlchemy](https://www.sqlalchemy.org/) & [SQLite](https://sqlite.org/)/PostgreSQL
- [Qdrant](https://qdrant.tech/) (Vector Database)
- [LangChain](https://python.langchain.com/) & [SentenceTransformers](https://www.sbert.net/) (RAG Pipeline)
- [PyMuPDF](https://pymupdf.readthedocs.io/) & [python-docx](https://python-docx.readthedocs.io/) (Document parsing)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (for the frontend) and [Python 3.10+](https://www.python.org/) (for the backend) installed.

### 1. Backend Setup (API)

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install the required Python dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn main:app --reload
```
*Note: The backend runs on `http://localhost:8000` by default. It will automatically use local SQLite and Memory storage if Qdrant/Redis are not detected.*

### 2. Frontend Setup (UI)

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install NPM packages:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*Your application will now be running and accessible in your browser (usually at `http://localhost:5173`).*

---

## Environment Variables

For production deployments or to hook up actual AI capabilities, you'll want to configure your backend environment variables. Create a `.env` file in the `backend/` directory:

```env
# API Configuration
PROJECT_NAME="DocPilot AI API"
API_V1_STR="/api"

# Security
JWT_SECRET_KEY="your-super-secret-key"

# AI / LLM Providers
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="AIza..."

# Databases (Optional: If running via Docker instead of local fallback)
DATABASE_URL="postgresql+asyncpg://user:pass@localhost/db"
QDRANT_URL="http://localhost:6333"
REDIS_URL="redis://localhost:6379"
```

## Architecture Notes

- **Modularity:** The AI workflows (Chunking, Embedding, Generation) are cleanly separated in `backend/app/rag/` and `backend/app/ingestion/`.
- **UI Mockups:** The frontend is currently designed with premium UI mockups for Search, Settings, and Teams tabs to showcase the intended application flow. These can be wired to backend routes as the platform scales.

---
<div align="center">
  <i>Built with modern tooling for modern AI teams.</i>
</div>
