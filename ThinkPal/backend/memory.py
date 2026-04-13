import os
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

from config import settings


class MemoryStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.chroma_persist_directory)
        self.collection = self.client.get_or_create_collection(
            name="memories", metadata={"hnsw:space": "cosine"}
        )
        self.embedding_model = SentenceTransformer(settings.embedding_model)

    def add_memory(self, text: str, memory_type: str) -> Dict[str, Any]:
        memory_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        embedding = self.embedding_model.encode([text]).tolist()[0]

        self.collection.add(
            ids=[memory_id],
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"text": text, "type": memory_type, "timestamp": timestamp}],
        )

        return {
            "id": memory_id,
            "text": text,
            "type": memory_type,
            "timestamp": timestamp,
        }

    def search_memories(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        query_embedding = self.embedding_model.encode([query]).tolist()[0]

        results = self.collection.query(
            query_embeddings=[query_embedding], n_results=n_results
        )

        memories = []
        if results["documents"] and results["documents"][0]:
            for i, doc in enumerate(results["documents"][0]):
                memories.append(
                    {
                        "id": results["ids"][0][i],
                        "text": doc,
                        "type": results["metadatas"][0][i].get("type", "unknown"),
                        "timestamp": results["metadatas"][0][i].get("timestamp", ""),
                        "distance": results["distances"][0][i]
                        if "distances" in results
                        else 0.0,
                    }
                )

        return memories

    def get_all_memories(self, limit: int = 100) -> List[Dict[str, Any]]:
        results = self.collection.get(limit=limit)

        memories = []
        if results["documents"]:
            for i, doc in enumerate(results["documents"]):
                memories.append(
                    {
                        "id": results["ids"][i],
                        "text": doc,
                        "type": results["metadatas"][i].get("type", "unknown"),
                        "timestamp": results["metadatas"][i].get("timestamp", ""),
                    }
                )

        return memories

    def delete_memory(self, memory_id: str) -> bool:
        try:
            self.collection.delete(ids=[memory_id])
            return True
        except Exception:
            return False


memory_store = MemoryStore()
