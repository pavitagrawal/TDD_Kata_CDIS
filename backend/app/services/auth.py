from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User, UserRole
from app.schemas.auth import RegisterRequest


class DuplicateEmailError(Exception):
    pass


def register_user(session: Session, request: RegisterRequest) -> User:
    user = User(email=str(request.email).lower(), password_hash=hash_password(request.password), role=UserRole.USER)
    session.add(user)
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        raise DuplicateEmailError from error
    session.refresh(user)
    return user


def authenticate_user(session: Session, email: str, password: str) -> User | None:
    user = session.scalar(select(User).where(User.email == email.strip().lower()))
    if user is None or not verify_password(password, user.password_hash):
        return None
    return user
