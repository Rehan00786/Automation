from datetime import UTC, datetime, timedelta

from jose import jwt

from app.core.config import settings

ALGORITHM = "HS256"


def create_access_token(subject: str) -> str:
    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    return jwt.encode({"sub": subject, "exp": expires_at}, settings.secret_key, algorithm=ALGORITHM)
