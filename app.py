import os
import base64
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from google.generativeai import types
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
# ---- Gemini Setup ----

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel("gemini-3.5-flash-lite")

def describe_image(image_base64: str):
    try:
        image_bytes = base64.b64decode(image_base64)
        image = types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
        response = gemini_model.generate_content(
            ["Describe this image.", image]
        )
        return response.text
    except Exception as e:
        return f"[Image context could not be extracted: {e}]"

# ---- Load Embeddings/Chunks ----
data = np.load("chunks_embeddings.npz", allow_pickle=True)
texts = data["texts"]
sources = data["sources"]
chunk_ids = data["chunk_ids"]
types_arr = data["types"]

# ---- FastAPI Setup ----
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    image: Optional[str] = None  

class LinkOut(BaseModel):
    url: str
    text: str

class QueryResponse(BaseModel):
    answer: str
    links: List[LinkOut]

def search(query: str, k=5):
    # Pure keyword-based search fallback (since OpenAI embeddings are removed)
    query_words = set(query.lower().split())
    sims = []
    for text in texts:
        text_words = set(text.lower().split())
        overlap = len(query_words & text_words)
        sims.append(overlap)
    sims = np.array(sims)
    topk_idx = sims.argsort()[-k:][::-1]
    return topk_idx, sims

def make_rag_prompt(question, selected_chunks):
    context = "\n\n".join(selected_chunks)
    prompt = (
        "You are a helpful virtual teaching assistant. "
        "A student has asked the following question. Use the information from the provided context below to answer. "
        "If the context does not contain the answer, use your own knowledge to answer the question.\n\n"
        f"CONTEXT:\n{context}\n\n"
        f"QUESTION: {question}\n\n"
        "ANSWER:"
    )
    return prompt

@app.post("/api/", response_model=QueryResponse)
async def query_api(req: QueryRequest):
    question = req.question
    if req.image:
        image_context = describe_image(req.image)
        question = f"{req.question}\n\n[Image context: {image_context}]"
    
    # Retrieve top chunks
    topk_idx, sims = search(question, k=5)
    selected_chunks = []
    links = []
    used_sources = set()
    
    for idx in topk_idx:
        content = texts[idx]
        src = sources[idx]
        if src not in used_sources:
            links.append({"url": src, "text": content[:120] + ("..." if len(content) > 120 else "")})
            used_sources.add(src)
        selected_chunks.append(content)
        
    # RAG LLM synthesis using Gemini
    prompt = make_rag_prompt(req.question, selected_chunks)
    try:
        response = gemini_model.generate_content(prompt)
        answer = response.text.strip()
    except Exception as e:
        answer = f"Sorry, I encountered an error generating the response: {e}"
        
    return {"answer": answer, "links": links}

if __name__ == "__main__":
    uvicorn.run("app:app", reload=True)