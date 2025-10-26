"""add techo to courts

Revision ID: d5e9f8a1b2c3
Revises: b488db11cc66
Create Date: 2024-01-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd5e9f8a1b2c3'
down_revision = 'b488db11cc66'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('courts', sa.Column('techo', sa.Boolean(), nullable=True, server_default='false'))


def downgrade():
    op.drop_column('courts', 'techo')
