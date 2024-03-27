from sqlalchemy import Column, String

from models.base import Base
from models.mixins import DateTimeModelMixin, SoftDeleteModelMixin


class Stock(Base, DateTimeModelMixin, SoftDeleteModelMixin):
    __tablename__ = "stock"
    # 编号
    code = Column(String(20), nullable=False)
    # 当前价格
    current = Column(String(20), nullable=False)
    time = Column(String(20), nullable=False)
