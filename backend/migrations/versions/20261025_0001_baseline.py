"""Establish the initial schema baseline.

Revision ID: 20261025_0001
Revises:
Create Date: 2026-10-25
"""

revision: str = "20261025_0001"
down_revision: str | None = None
branch_labels: str | None = None
depends_on: str | None = None


def upgrade() -> None:
    """No domain tables are introduced during the foundation phase."""


def downgrade() -> None:
    """The schema baseline has no database objects to remove."""

