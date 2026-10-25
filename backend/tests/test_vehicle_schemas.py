import pytest
from pydantic import ValidationError

from app.schemas.vehicle import VehicleCreate


def test_vehicle_rejects_whitespace_only_make() -> None:
    with pytest.raises(ValidationError):
        VehicleCreate(
            make="   ", model="Roadster", category="Coupe", price="100.00", stock_quantity=1
        )
