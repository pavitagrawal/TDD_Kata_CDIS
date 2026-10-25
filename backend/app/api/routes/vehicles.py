from decimal import Decimal
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Response, status

from app.api.deps import AdminUser, CurrentUser, DatabaseSession
from app.models.vehicle import Vehicle
from app.schemas.vehicle import (
    InventoryResponse,
    RestockRequest,
    VehicleCreate,
    VehicleResponse,
    VehicleUpdate,
)
from app.services.vehicles import (
    InventoryUnavailableError,
    VehicleNotFoundError,
    create_vehicle,
    delete_vehicle,
    get_vehicle,
    list_vehicles,
    purchase_vehicle,
    restock_vehicle,
    update_vehicle,
)

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])
PaginationOffset = Annotated[int, Query(ge=0, le=10_000)]
PaginationLimit = Annotated[int, Query(ge=1, le=100)]
PriceFilter = Annotated[Decimal | None, Query(ge=0)]


def not_found() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="vehicle not found")


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create(request: VehicleCreate, session: DatabaseSession, _: AdminUser) -> Vehicle:
    return create_vehicle(session, request)


@router.get("", response_model=list[VehicleResponse])
def list_all(
    session: DatabaseSession,
    offset: PaginationOffset = 0,
    limit: PaginationLimit = 20,
) -> list[Vehicle]:
    return list_vehicles(session, offset=offset, limit=limit)


@router.get("/search", response_model=list[VehicleResponse])
def search(
    session: DatabaseSession,
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: PriceFilter = None,
    max_price: PriceFilter = None,
    offset: PaginationOffset = 0,
    limit: PaginationLimit = 20,
) -> list[Vehicle]:
    try:
        return list_vehicles(
            session,
            make=make,
            model=model,
            category=category,
            min_price=min_price,
            max_price=max_price,
            offset=offset,
            limit=limit,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        ) from error


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_one(vehicle_id: UUID, session: DatabaseSession) -> Vehicle:
    try:
        return get_vehicle(session, vehicle_id)
    except VehicleNotFoundError:
        raise not_found() from None


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update(
    vehicle_id: UUID,
    request: VehicleUpdate,
    session: DatabaseSession,
    _: AdminUser,
) -> Vehicle:
    try:
        return update_vehicle(session, vehicle_id, request)
    except VehicleNotFoundError:
        raise not_found() from None


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(vehicle_id: UUID, session: DatabaseSession, _: AdminUser) -> Response:
    try:
        delete_vehicle(session, vehicle_id)
    except VehicleNotFoundError:
        raise not_found() from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{vehicle_id}/purchase", response_model=InventoryResponse)
def purchase(vehicle_id: UUID, session: DatabaseSession, _: CurrentUser) -> InventoryResponse:
    try:
        vehicle = purchase_vehicle(session, vehicle_id)
    except VehicleNotFoundError:
        raise not_found() from None
    except InventoryUnavailableError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="vehicle is out of stock",
        ) from None
    return InventoryResponse(message="purchase completed", vehicle=vehicle)


@router.post("/{vehicle_id}/restock", response_model=InventoryResponse)
def restock(
    vehicle_id: UUID,
    request: RestockRequest,
    session: DatabaseSession,
    _: AdminUser,
) -> InventoryResponse:
    try:
        vehicle = restock_vehicle(session, vehicle_id, request.quantity)
    except VehicleNotFoundError:
        raise not_found() from None
    return InventoryResponse(message="inventory restocked", vehicle=vehicle)
