from fastapi import APIRouter

from app.schemas.health import HealthResponse
from app.services.health import health_status

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    return health_status()
