from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "QuestForge"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENV: str = "development"

    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Progression Rules
    REP_COOLDOWN_HOURS: int = 12

    DATABASE_URL: str = "sqlite+aiosqlite:///./questforge.db"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = (".env", "../.env")
        extra = "ignore"

settings = Settings()
