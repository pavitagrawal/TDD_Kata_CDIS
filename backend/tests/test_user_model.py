from collections.abc import Callable
from typing import cast

from sqlalchemy.dialects import postgresql

from app.models.user import User, UserRole


def test_user_role_persists_lowercase_enum_values() -> None:
    dialect = postgresql.dialect()  # type: ignore[no-untyped-call]
    processor = User.__table__.c.role.type.bind_processor(dialect)

    assert processor is not None
    convert = cast(Callable[[UserRole], str], processor)
    assert convert(UserRole.USER) == "user"
    assert convert(UserRole.ADMIN) == "admin"
