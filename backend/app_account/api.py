from typing import List, Any, Union
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db.database import get_db
from app_account.schema import AccountCreate, AccountInfo, AccountWithAssetInfo
from app_account.model import Account, Asset


router = APIRouter()


"""
接口：Account 表增删改查

POST   /api/accounts            ->  create_account  ->  创建 account
GET    /api/accounts            ->  get_accounts    ->  获取所有 account
GET    /api/accounts/{account_id}   ->  get_account     ->  获取单个 account
PUT    /api/accounts/{account_id}   ->  update_account  ->  更新单个 account
DELETE /api/accounts/{account_id}   ->  delete_account  ->  删除单个 account
"""

# 新建 account
@router.post("", response_model=AccountInfo, name="新建 account")
async def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    return Account.create(db, **account.dict())


# 获取所有 account
@router.get("", response_model=List[AccountWithAssetInfo], name="获取所有 account")
async def get_accounts(db: Session = Depends(get_db)):
    # 查询所有的 accounts
    accounts: List[Account] = Account.all(db)
    # 查询每个 account 下的资产
    assets: List[Asset] = Asset.all(db)
    # 将 accounts 与 assets 合并
    account_with_asset: List[AccountWithAssetInfo] = []
    for account in accounts:
        account_assets = [asset for asset in assets if asset.account_id == account.id]
        account_aum = sum([float(asset.aum) for asset in account_assets])
        account_with_asset.append(AccountWithAssetInfo(id=account.id, name=account.name, aum=account_aum))
    
    return account_with_asset


# 通过id查询 account
@router.get("/{account_id}", response_model=Union[AccountInfo, Any], name="查询 account by account_id")
async def get_account(account_id: int, db: Session = Depends(get_db)):
    db_account = Account.get_or_404(db, id=account_id)
    if not db_account:
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account


# 通过id更改 account
@router.put("/{account_id}", name="更改 account by account_id")
async def update_account(account_id: int, account: AccountCreate, db: Session = Depends(get_db)):
    return Account.update_by(db, account_id, {})


# 通过id删除 account
@router.delete("/{account_id}", name="删除 account by account_id")
async def delete_account(account_id: int, db: Session = Depends(get_db)):
    Account.remove_by(db, id=account_id)
    return 0
