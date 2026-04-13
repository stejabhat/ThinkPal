from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from memory import memory_store
from llm import ollama_llm


app = FastAPI(
    title="Mini You AI Backend",
    description="A local AI system that simulates your mind using memory + LLM",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    mode: str = "real"


class ChatResponse(BaseModel):
    response: str
    memories_used: List[Dict[str, Any]]


class DebateRequest(BaseModel):
    message: str


class DebateResponse(BaseModel):
    past_you: str
    future_you: str
    final_answer: str
    memories_used: List[Dict[str, Any]]


class MemoryAddRequest(BaseModel):
    text: str
    type: str


class MemorySearchRequest(BaseModel):
    query: str


class MemorySearchResponse(BaseModel):
    results: List[Dict[str, Any]]


@app.get("/")
async def root():
    return {
        "name": "Mini You AI",
        "version": "1.0.0",
        "description": "A digital brain simulation engine",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if request.mode not in ["real", "past", "future"]:
        raise HTTPException(
            status_code=400, detail="Mode must be 'real', 'past', or 'future'"
        )

    try:
        memories = memory_store.search_memories(request.message, n_results=5)

        system_prompt, user_prompt = ollama_llm.build_prompt(
            message=request.message, mode=request.mode, memories=memories
        )

        response = await ollama_llm.generate(
            prompt=user_prompt, system_prompt=system_prompt, temperature=0.8
        )

        return ChatResponse(response=response, memories_used=memories)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/debate", response_model=DebateResponse)
async def debate(request: DebateRequest):
    try:
        memories = memory_store.search_memories(request.message, n_results=5)

        past_system, past_prompt = ollama_llm.build_prompt(
            message=request.message, mode="past", memories=memories
        )
        past_response = await ollama_llm.generate(
            prompt=past_prompt, system_prompt=past_system, temperature=0.9
        )

        future_system, future_prompt = ollama_llm.build_prompt(
            message=request.message, mode="future", memories=memories
        )
        future_response = await ollama_llm.generate(
            prompt=future_prompt, system_prompt=future_system, temperature=0.7
        )

        synthesis_system = """You are "Real You" - synthesizing the perspectives of Past You and Future You.
Your task is to integrate both viewpoints into a coherent, balanced conclusion.
Draw from the wisdom of Future You while acknowledging the feelings and experiences of Past You.
Provide a final answer that represents your authentic, integrated self."""

        synthesis_prompt = f"""The user asked: "{request.message}"

Past You said: "{past_response}"

Future You said: "{future_response}"

Integrate both perspectives into a final, balanced response. Speak as your authentic self - thoughtful, self-aware, and genuine."""

        final_response = await ollama_llm.generate(
            prompt=synthesis_prompt, system_prompt=synthesis_system, temperature=0.75
        )

        return DebateResponse(
            past_you=past_response,
            future_you=future_response,
            final_answer=final_response,
            memories_used=memories,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/memory/add")
async def add_memory(request: MemoryAddRequest):
    if request.type not in ["habit", "thought", "event"]:
        raise HTTPException(
            status_code=400, detail="Type must be 'habit', 'thought', or 'event'"
        )

    try:
        memory = memory_store.add_memory(request.text, request.type)
        return {"status": "success", "memory": memory}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/memory/search", response_model=MemorySearchResponse)
async def search_memories(request: MemorySearchRequest):
    try:
        results = memory_store.search_memories(request.query, n_results=10)
        return MemorySearchResponse(results=results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/memory/all")
async def get_all_memories():
    try:
        memories = memory_store.get_all_memories(limit=100)
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/memory/{memory_id}")
async def delete_memory(memory_id: str):
    try:
        success = memory_store.delete_memory(memory_id)
        if success:
            return {"status": "success", "message": "Memory deleted"}
        else:
            raise HTTPException(status_code=404, detail="Memory not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
