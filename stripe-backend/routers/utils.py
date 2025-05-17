from fastapi import APIRouter
from services.address_service import resolve_address

router = APIRouter()

@router.get("/resolve-address")
def address(postal_code: str):
    """
    郵便番号をクエリパラメータで受け取り、住所を返す。
    例: GET /utils/resolve-address?postal_code=1000001
    """
    address = resolve_address(postal_code)
    if address:
        return {"address": address}
    else:
        return {"error": "Address not found"}
