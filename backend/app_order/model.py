from sqlalchemy import Column, String, Integer

from models.base import Base
from models.mixins import DateTimeModelMixin, SoftDeleteModelMixin


class Order(Base, DateTimeModelMixin, SoftDeleteModelMixin):
    __tablename__ = "order"
    account_id = Column(Integer, nullable=False)
    stock_id = Column(Integer, nullable=False)
    money_to_buy = Column(Integer, nullable=False)
    algorithm = Column(String, nullable=False)
    algorithm_start_time = Column(String, nullable=False)
    algorithm_end_time = Column(String, nullable=False)
    volume = Column(Integer, nullable=False)
