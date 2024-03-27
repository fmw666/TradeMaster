from sqlalchemy import Column, String, Integer

from models.base import Base
from models.mixins import DateTimeModelMixin, SoftDeleteModelMixin


class Account(Base, DateTimeModelMixin, SoftDeleteModelMixin):
    __tablename__ = "account"
    name = Column(String, nullable=False)


class Asset(Base, DateTimeModelMixin, SoftDeleteModelMixin):
    __tablename__ = "asset"
    account_id = Column(Integer, nullable=False, default=0)
    aum = Column(String, nullable=False)
