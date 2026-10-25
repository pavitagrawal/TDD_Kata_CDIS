from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Car Dealership Inventory API"
    app_env: Literal["development", "test", "production"] = "development"
    database_url: AnyUrl
    cors_origins: list[str] = ["http://localhost:5173"]

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


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]

