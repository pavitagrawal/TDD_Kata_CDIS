from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class VehicleCreate(BaseModel):
    make: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=100)
    price: Decimal = Field(ge=0, max_digits=12, decimal_places=2)
    stock_quantity: int = Field(ge=0)

    @field_validator("make", "model", "category")
    @classmethod
    def require_meaningful_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("vehicle text fields cannot be blank")
        return normalized


class VehicleUpdate(BaseModel):
    make: str | None = Field(default=None, min_length=1, max_length=100)
    model: str | None = Field(default=None, min_length=1, max_length=100)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    price: Decimal | None = Field(default=None, ge=0, max_digits=12, decimal_places=2)
    stock_quantity: int | None = Field(default=None, ge=0)

    @field_validator("make", "model", "category")
    @classmethod
    def require_meaningful_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip()
        if not normalized:
            raise ValueError("vehicle text fields cannot be blank")
        return normalized

    @model_validator(mode="after")
    def require_at_least_one_field(self) -> "VehicleUpdate":
        if not self.model_fields_set:
            raise ValueError("at least one vehicle field must be supplied")
        return self


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    make: str
    model: str
    category: str
    price: Decimal
    stock_quantity: int
    created_at: datetime
    updated_at: datetime


class InventoryResponse(BaseModel):
    message: str
    vehicle: VehicleResponse


class RestockRequest(BaseModel):
    quantity: int = Field(gt=0, le=10_000)
