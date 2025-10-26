"""add cancelada status to reservation_statuses

Revision ID: 393e03115740
Revises: b488db11cc66
Create Date: 2025-06-27 00:31:06.226471

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
#from backend.app.models import Base


# revision identifiers, used by Alembic.
revision: str = '393e03115740'
down_revision: Union[str, None] = 'b488db11cc66'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("INSERT INTO reservation_statuses (id, nombre) VALUES (3, 'cancelada')")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE FROM reservation_statuses WHERE id = 3")
