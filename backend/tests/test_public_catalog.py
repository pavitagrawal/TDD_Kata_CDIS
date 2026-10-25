from unittest.mock import patch

from fastapi.testclient import TestClient

from app.db.session import get_db_session
from app.main import app


def test_visitors_can_browse_and_search_without_signing_in() -> None:
    app.dependency_overrides[get_db_session] = lambda: object()
    try:
        with patch("app.api.routes.vehicles.list_vehicles", return_value=[]) as listing:
            client = TestClient(app)
            assert client.get("/api/vehicles").status_code == 200
            assert client.get("/api/vehicles/search?category=Electric").status_code == 200
            assert listing.call_count == 2
    finally:
        app.dependency_overrides.clear()
