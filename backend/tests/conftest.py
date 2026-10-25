import os
from collections.abc import Generator

import pytest
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg://test_user:test_password@localhost:5432/dealership_test",
)
os.environ.setdefault("APP_ENV", "test")
os.environ.setdefault("JWT_SECRET", "test-secret-that-is-at-least-thirty-two-characters")


def _require_safe_test_database(url: str) -> None:
    lowered = url.lower()
    if "test" not in lowered or any(marker in lowered for marker in ("prod", "production")):
        raise RuntimeError("TEST_DATABASE_URL must clearly identify a non-production test database")


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    test_url = os.getenv("TEST_DATABASE_URL")
    if not test_url:
        pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests")
    _require_safe_test_database(test_url)

    test_engine: Engine = create_engine(test_url, pool_pre_ping=True)
    connection = test_engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
        test_engine.dispose()

