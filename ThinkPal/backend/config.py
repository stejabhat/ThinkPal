from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "mistral"
    embedding_model: str = "all-MiniLM-L6-v2"
    chroma_persist_directory: str = "./chroma_db"

    class Config:
        env_file = ".env"


settings = Settings()
