const API_URL = 'http://localhost:8000/api';

export interface Citation {
  id: number;
  document: string;
  page: string;
  text_snippet: string;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}

export interface Document {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  status: 'UPLOADING' | 'PROCESSING' | 'INDEXING' | 'READY' | 'FAILED';
  uploaded_at: string;
  owner_id: string;
}

export const api = {
  chat: async (query: string): Promise<ChatResponse> => {
    // We are mocking authentication for the UI showcase by passing a dummy token or no token.
    // In a real app, you would retrieve the JWT from localStorage and attach it to the headers.
    
    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer TEST_TOKEN`
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat response');
      }

      return await response.json();
    } catch (error) {
      console.error("API Chat Error:", error);
      // Return a fallback response for demonstration purposes if backend is down
      return {
        answer: "Connection to the AI service failed. Please ensure the backend is running.",
        citations: []
      };
    }
  },
  
  getDocuments: async (): Promise<Document[]> => {
    try {
      const response = await fetch(`${API_URL}/documents/`, {
        headers: {
          'Authorization': `Bearer TEST_TOKEN`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch documents');
      return await response.json();
    } catch (error) {
      console.error("API Get Documents Error:", error);
      return [];
    }
  },
  
  uploadDocument: async (file: File): Promise<Document | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer TEST_TOKEN`
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload document');
      return await response.json();
    } catch (error) {
      console.error("API Upload Error:", error);
      return null;
    }
  }
};
