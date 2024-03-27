from typing import List, Any, Union
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from app_account.model import Account, Asset
from app_stock.model import Stock
from app_order.schema import OrderCreate, OrderInfo
from app_order.model import Order


router = APIRouter()


"""
接口：Order 表增删改查

POST   /api/orders            ->  create_order  ->  创建 order
GET    /api/orders            ->  get_orders    ->  获取所有 order
GET    /api/orders/{order_id}   ->  get_order     ->  获取单个 order
PUT    /api/orders/{order_id}   ->  update_order  ->  更新单个 order
DELETE /api/orders/{order_id}   ->  delete_order  ->  删除单个 order
"""

# 新建 order
@router.post("", name="新建 order")
async def create_order(orders: List[OrderCreate], db: Session = Depends(get_db)):
    # TODO 重复订单校验
    db.add_all([Order(**order.dict()) for order in orders])
    db.commit()
    return {"code": 0, "msg": "success"}


# 获取所有 order，可以接收参数 ?account_id=1
@router.get("", response_model=List[OrderInfo], name="获取所有 order")
async def get_orders(account_id: int = None, db: Session = Depends(get_db)):
    if account_id:
        orders = Order.filter_by(db, account_id=account_id)
    else:
        orders = Order.all(db)

    results = []
    assets = Asset.all(db)
    for order in orders:
        account = Account.get_or_404(db, id=order.account_id)
        stock = Stock.get_or_404(db, id=order.stock_id)
        account_assets = [asset for asset in assets if asset.account_id == account.id]
        account_aum = sum([float(asset.aum) for asset in account_assets])
        results.append(OrderInfo(
            id=order.id,
            account=account.name,
            stock=stock.code,
            current_price=stock.current,
            money_to_buy=order.money_to_buy,
            aum=account_aum,
            volume=order.volume,
        ))
    return results


# 通过id查询 order
@router.get("/{order_id}", response_model=Union[OrderInfo, Any], name="查询 order by order_id")
async def get_order(order_id: int, db: Session = Depends(get_db)):
    db_order = Order.get_or_404(db, id=order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


# 通过id更改 order
@router.put("/{order_id}", name="更改 order by order_id")
async def update_order(order_id: int, order: OrderCreate, db: Session = Depends(get_db)):
    return Order.update_by(db, order_id, {})


# 通过id删除 order
@router.delete("", name="删除 order by order_id")
async def delete_order(ids: str = "", db: Session = Depends(get_db)):
    ids_list = ids.split(",")
    db.query(Order).filter(Order.id.in_(ids_list)).delete()
    db.commit()
    return {"code": 0, "msg": "success"}
