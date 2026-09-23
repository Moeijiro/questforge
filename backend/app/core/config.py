from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "QuestForge"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENV: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # Discord Credentials
    DISCORD_BOT_TOKEN: Optional[str] = None
    DISCORD_CLIENT_ID: Optional[str] = None

    # Progression Rules
    BASE_XP_PER_MESSAGE: int = 15
    MESSAGE_COOLDOWN_SECONDS: int = 45
    MIN_MESSAGE_LENGTH: int = 15
    REP_COOLDOWN_HOURS: int = 12

    DATABASE_URL: str = "sqlite+aiosqlite:///./questforge.db"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
