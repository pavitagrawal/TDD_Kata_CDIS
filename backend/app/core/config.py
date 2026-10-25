from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Car Dealership Inventory API"
    app_env: Literal["development", "test", "production"] = "development"
    database_url: AnyUrl
    cors_origins: list[str] = ["http://localhost:5173"]
    jwt_secret: str
    access_token_expire_minutes: int = 30

    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("database_url")
    @classmethod
    def require_postgresql(cls, value: AnyUrl) -> AnyUrl:
        if value.scheme not in {"postgresql", "postgresql+psycopg"}:
            raise ValueError("DATABASE_URL must use PostgreSQL with the psycopg driver")
        return value

    @field_validator("jwt_secret")
    @classmethod
    def require_strong_jwt_secret(cls, value: str) -> str:
        if len(value) < 32:
            raise ValueError("JWT_SECRET must contain at least 32 characters")
        return value

    @field_validator("access_token_expire_minutes")
    @classmethod
    def require_sensible_token_expiry(cls, value: int) -> int:
        if not 1 <= value <= 1_440:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be between 1 and 1440")
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
