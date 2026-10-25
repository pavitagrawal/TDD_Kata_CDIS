from datetime import timedelta

import pytest

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hash_is_not_the_original_password() -> None:
    password = "a-long-enough-secret"

    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash)


def test_access_token_round_trip_uses_subject_and_role() -> None:
    token = create_access_token(subject="user-id", role="admin")

    claims = decode_access_token(token)

    assert claims["sub"] == "user-id"
    assert claims["role"] == "admin"


def test_expired_access_token_is_rejected() -> None:
    token = create_access_token(subject="user-id", role="user", expires_delta=timedelta(seconds=-1))

    with pytest.raises(ValueError, match="expired"):
        decode_access_token(token)
