import datetime
from typing import Optional

from schemas.base import BaseSchema


class AccountBase(BaseSchema):
    """account 基础"""
    ...


class AccountCreate(AccountBase):
    """account 创建"""
    name: str
    

class AccountInfo(AccountBase):
    """account 信息"""
    id: int
    name: str
    updated_at: Optional[datetime.datetime] = None
    
    class Config(object):
        orm_mode = True


class AccountWithAssetInfo(AccountBase):
    """account 信息"""
    id: int
    name: str
    aum: int
    # updated_at: Optional[datetime.datetime] = None
