import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_database_url_is_required(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATABASE_URL", raising=False)

    with pytest.raises(ValidationError):
        Settings(_env_file=None)


def test_non_postgresql_database_is_rejected() -> None:
    with pytest.raises(ValidationError, match="must use PostgreSQL"):
        Settings(database_url="sqlite:///:memory:", _env_file=None)


def test_non_positive_token_expiry_is_rejected() -> None:
    with pytest.raises(ValidationError, match="ACCESS_TOKEN_EXPIRE_MINUTES"):
        Settings(
            database_url="postgresql+psycopg://user:password@localhost:5432/dealership_test",
            jwt_secret="a-secret-with-at-least-thirty-two-characters",
            access_token_expire_minutes=0,
            _env_file=None,
        )
