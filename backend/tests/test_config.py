import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_database_url_is_required(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATABASE_URL", raising=False)

    with pytest.raises(ValidationError):
        Settings(_env_file=None)  # type: ignore[call-arg]


def test_non_postgresql_database_is_rejected() -> None:
    with pytest.raises(ValidationError, match="must use PostgreSQL"):
        Settings(database_url="sqlite:///:memory:", _env_file=None)  # type: ignore[arg-type]

