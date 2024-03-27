from typing import List, Any, Union
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from app_stock.schema import StockCreate, StockInfo
from app_stock.model import Stock


router = APIRouter()


"""
接口：Stock 表增删改查

POST   /api/stocks            ->  create_stock  ->  创建 stock
GET    /api/stocks            ->  get_stocks    ->  获取所有 stock
GET    /api/stocks/{stock_id}   ->  get_stock     ->  获取单个 stock
PUT    /api/stocks/{stock_id}   ->  update_stock  ->  更新单个 stock
DELETE /api/stocks/{stock_id}   ->  delete_stock  ->  删除单个 stock
"""

# 新建 stock
@router.post("", response_model=StockInfo, name="新建 stock")
async def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    return Stock.create(db, **stock.dict())


# 获取所有 stock
@router.get("", response_model=List[StockInfo], name="获取所有 stock")
async def get_stocks(db: Session = Depends(get_db)):
    return Stock.all(db)


# 通过id查询 stock
@router.get("/{stock_id}", response_model=Union[StockInfo, Any], name="查询 stock by stock_id")
async def get_stock(stock_id: int, db: Session = Depends(get_db)):
    db_stock = Stock.get_or_404(db, id=stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock


# 通过id更改 stock
@router.put("/{stock_id}", name="更改 stock by stock_id")
async def update_stock(stock_id: int, stock: StockCreate, db: Session = Depends(get_db)):
    return Stock.update_by(db, stock_id, {})


# 通过id删除 stock
@router.delete("/{stock_id}", name="删除 stock by stock_id")
async def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    Stock.remove_by(db, id=stock_id)
    return 0
