from decimal import Decimal
from uuid import UUID

from sqlalchemy import Select, select, update
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleNotFoundError(Exception):
    pass


class InventoryUnavailableError(Exception):
    pass


def validate_price_range(min_price: Decimal | None, max_price: Decimal | None) -> None:
    if min_price is not None and max_price is not None and max_price < min_price:
        raise ValueError("maximum price cannot be lower than minimum price")


def create_vehicle(session: Session, request: VehicleCreate) -> Vehicle:
    vehicle = Vehicle(**request.model_dump())
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)
    return vehicle


def get_vehicle(session: Session, vehicle_id: UUID) -> Vehicle:
    vehicle = session.get(Vehicle, vehicle_id)
    if vehicle is None:
        raise VehicleNotFoundError
    return vehicle


def list_vehicles(
    session: Session,
    *,
    make: str | None = None,
    model: str | None = None,
    category: str | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    offset: int = 0,
    limit: int = 20,
) -> list[Vehicle]:
    validate_price_range(min_price, max_price)
    statement: Select[tuple[Vehicle]] = select(Vehicle)
    if make:
        statement = statement.where(Vehicle.make.ilike(f"%{make.strip()}%"))
    if model:
        statement = statement.where(Vehicle.model.ilike(f"%{model.strip()}%"))
    if category:
        statement = statement.where(Vehicle.category.ilike(f"%{category.strip()}%"))
    if min_price is not None:
        statement = statement.where(Vehicle.price >= min_price)
    if max_price is not None:
        statement = statement.where(Vehicle.price <= max_price)
    statement = statement.order_by(Vehicle.created_at.asc(), Vehicle.id.asc())
    return list(session.scalars(statement.offset(offset).limit(limit)))


def update_vehicle(session: Session, vehicle_id: UUID, request: VehicleUpdate) -> Vehicle:
    vehicle = get_vehicle(session, vehicle_id)
    for field, value in request.model_dump(exclude_unset=True).items():
        setattr(vehicle, field, value)
    session.commit()
    session.refresh(vehicle)
    return vehicle


def delete_vehicle(session: Session, vehicle_id: UUID) -> None:
    session.delete(get_vehicle(session, vehicle_id))
    session.commit()


def purchase_vehicle(session: Session, vehicle_id: UUID) -> Vehicle:
    statement = (
        update(Vehicle)
        .where(Vehicle.id == vehicle_id, Vehicle.stock_quantity > 0)
        .values(stock_quantity=Vehicle.stock_quantity - 1)
        .returning(Vehicle)
    )
    vehicle = session.execute(statement).scalar_one_or_none()
    if vehicle is None:
        if session.get(Vehicle, vehicle_id) is None:
            raise VehicleNotFoundError
        raise InventoryUnavailableError
    session.commit()
    return vehicle


def restock_vehicle(session: Session, vehicle_id: UUID, quantity: int) -> Vehicle:
    statement = (
        update(Vehicle)
        .where(Vehicle.id == vehicle_id)
        .values(stock_quantity=Vehicle.stock_quantity + quantity)
        .returning(Vehicle)
    )
    vehicle = session.execute(statement).scalar_one_or_none()
    if vehicle is None:
        raise VehicleNotFoundError
    session.commit()
    return vehicle
