import datetime
from typing import Optional

from schemas.base import BaseSchema


class OrderBase(BaseSchema):
    """order 基础"""
    ...


class OrderCreate(OrderBase):
    """order 创建"""
    account_id: int
    stock_id: int
    algorithm: str
    algorithm_start_time: str
    algorithm_end_time: str
    money_to_buy: float
    volume: float
    

class OrderInfo(OrderBase):
    """order 信息"""
    id: int
    account: str
    stock: str
    current_price: float
    money_to_buy: int
    aum: float
    volume: int

