from fastapi import APIRouter

from . import authentication
import app_user.api
import app_order.api
import app_account.api
import app_stock.api


router = APIRouter()
router.include_router(authentication.router, tags=["用户认证"], prefix="/auth")
router.include_router(app_user.api.router, tags=["用户类"], prefix="/users")
router.include_router(app_order.api.router, tags=["订单类"], prefix="/orders")
router.include_router(app_account.api.router, tags=["账户类"], prefix="/accounts")
router.include_router(app_stock.api.router, tags=["股票类"], prefix="/stocks")
