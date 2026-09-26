# Virtual Teaching Assistant

A powerful, AI-driven Virtual Teaching Assistant application built with a React/Vite frontend and a FastAPI backend. This Virtual TA can answer contextual queries, analyze images, and maintain conversation history.

## Features

- **Contextual Q&A:** Retrieves relevant context using document chunks and embeddings, synthesizing answers using the Gemini AI model.
- **Multimodal (Image Support):** Users can upload images alongside their questions, which are analyzed by the Virtual TA.
- **Chat History Management:** Automatically saves chat history across sessions. Users can also clear their chat history anytime.
- **Dark/Light Mode:** Includes an intuitive theme toggle to switch between Light and Dark modes.
- **Responsive UI:** A modern sidebar layout with a sleek chat interface built in React.

## Tech Stack

### Frontend
- **React (Vite):** Fast frontend tooling and React rendering.
- **Lucide React:** Beautiful, consistent icon set.

### Backend
- **FastAPI:** High-performance web framework for building APIs.
- **Google Generative AI (Gemini):** Used as the core LLM for answering questions and describing image contexts.
- **NumPy:** Used for loading pre-computed document chunk embeddings (`chunks_embeddings.npz`).

## Setup and Installation

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3.8+ (for the backend)
- A Google Gemini API Key

### Backend Setup

1. Create a Python virtual environment and activate it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure your environment variables:
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```env
     GOOGLE_API_KEY=your_gemini_api_key_here
     ```

4. Run the backend server:
   ```bash
   python app.py
   # OR
   uvicorn app:app --reload
   ```
   The backend will start on `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## Architecture
- **Search System:** Fallback keyword-based search over document chunks to retrieve relevant contextual text.
- **Prompting:** Carefully constructed RAG (Retrieval-Augmented Generation) prompts guiding the assistant to use context and its own internal knowledge when necessary.