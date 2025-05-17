from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address1 = Column(String, nullable=False)         # 都道府県・市区町村
    address2 = Column(String, nullable=True)          # 番地・建物名など
    amount = Column(Integer, nullable=False)          # 円単位
    payment_method = Column(String, nullable=True)    # "stripe" or "bank_transfer"
    status = Column(String, default="pending")        # pending, paid, failedの3つ
    gender = Column(String, nullable=True)            # "male", "female", "other" など
    birthdate = Column(DateTime, nullable=True)       # 誕生日（datetime型）
    created_at = Column(DateTime, default=datetime.utcnow)
