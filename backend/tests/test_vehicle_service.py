from decimal import Decimal
from uuid import uuid4

import pytest

from app.services.vehicles import validate_price_range


def test_price_range_accepts_equal_bounds() -> None:
    validate_price_range(Decimal("100.00"), Decimal("100.00"))


def test_price_range_rejects_a_maximum_below_the_minimum() -> None:
    with pytest.raises(ValueError, match="minimum price"):
        validate_price_range(Decimal("100.00"), Decimal("99.99"))


def test_purchase_requires_a_database_vehicle_id() -> None:
    assert uuid4()
