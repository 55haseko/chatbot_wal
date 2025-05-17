from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class OrderCreate(BaseModel):
    name: str
    email: str
    phone: str
    address1: str           # 都道府県・市区町村
    address2: Optional[str] = None  # 番地・建物名など
    amount: int             # 円単位
    payment_method: str     # "stripe" / "bank_transfer" など
    gender: Optional[str] = None    # "male", "female", "other"
    birthdate: Optional[datetime] = None  # 誕生日
