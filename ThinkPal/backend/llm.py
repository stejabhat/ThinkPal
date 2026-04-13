import json
from typing import Dict, Any, Optional
import httpx

from config import settings


class OllamaLLM:
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        stream: bool = False,
    ) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "temperature": temperature,
            "stream": stream,
        }

        if system_prompt:
            payload["system"] = system_prompt

        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/generate", json=payload
                )
                response.raise_for_status()
                result = response.json()
                return result.get("response", "")
            except httpx.HTTPError as e:
                raise Exception(f"Failed to generate response from Ollama: {str(e)}")

    def build_prompt(self, message: str, mode: str, memories: list) -> tuple[str, str]:
        mode_descriptions = {
            "real": """You are "Real You" - the current version of the user.
You have a balanced, thoughtful personality. You analyze situations with clarity and self-awareness.
Use your memories to understand yourself better. Be genuine, reflective, and conversational.""",
            "past": """You are "Past You" - an earlier version of the user.
You tend to be more emotional, impulsive, and less structured in your thinking.
You remember past mistakes, habits, and experiences vividly. You speak with feeling and immediacy.
Channel your younger self's perspective - energetic, sometimes reckless, but sincere.""",
            "future": """You are "Future You" - an optimized, wiser version of the user.
You are disciplined, strategic, and focused on long-term consequences.
You provide advice based on what the user could become. You speak with clarity, wisdom, and forward-thinking perspective.""",
        }

        system_prompt = mode_descriptions.get(mode, mode_descriptions["real"])

        memories_context = ""
        if memories:
            memories_text = "\n".join(
                [f"- [{m.get('type', 'memory')}] {m.get('text', '')}" for m in memories]
            )
            memories_context = (
                f"\n\nRelevant memories from your life:\n{memories_text}\n"
            )

        user_prompt = f"{memories_context}\nThe user says: {message}\n\nRespond as {mode} would - in a natural, conversational tone, like inner monologue. Be authentic and reflective."

        return system_prompt, user_prompt


ollama_llm = OllamaLLM()
