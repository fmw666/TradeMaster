"""create migration

Revision ID: d8d29b6019b1
Revises: d068a1c88e37
Create Date: 2024-03-27 21:18:22.948981

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd8d29b6019b1'
down_revision = 'd068a1c88e37'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('order', sa.Column('account_id', sa.Integer(), nullable=False))
    op.drop_column('order', 'accound_id')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('order', sa.Column('accound_id', sa.VARCHAR(), nullable=False))
    op.drop_column('order', 'account_id')
    # ### end Alembic commands ###
