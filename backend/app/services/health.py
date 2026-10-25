from app.schemas.health import HealthResponse


def health_status() -> HealthResponse:
    return HealthResponse(status="ok")

