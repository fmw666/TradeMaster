import datetime
from typing import Optional

from schemas.base import BaseSchema


class StockBase(BaseSchema):
    """stock 基础"""
    ...


class StockCreate(StockBase):
    """stock 创建"""
    code: str
    current: str
    time: str
    

class StockInfo(StockBase):
    """stock 信息"""
    id: int
    code: str
    current: str
    time: str
    updated_at: Optional[datetime.datetime] = None

    class Config(object):
        orm_mode = True
