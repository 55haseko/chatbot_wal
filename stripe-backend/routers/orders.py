#注文処理を行なっていきます。
from fastapi import APIRouter, Depends
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from config import DATABASE_URL
from models.order import Order
from models.schemas import OrderCreate

router = APIRouter()

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/initiate")
def initiate_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    注文レコードを新規作成。status=pendingでDBに保存。
    - payment_method: "stripe" or "bank_transfer" などが指定される。
    """
    print("🛬 バックエンドで受け取ったorder:", order.dict())  # ← ここ！
    new_order = Order(**order.dict())
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    return {
    "order_id": new_order.id,
    "status": new_order.status,
    "payment_method": new_order.payment_method,
    "address1": new_order.address1,
    "address2": new_order.address2,
    "gender": new_order.gender,
    "birthdate": new_order.birthdate
}


@router.post("/complete/{order_id}")
def complete_order(order_id: int, db: Session = Depends(get_db)):
    """
    入金 or 決済完了後、注文を完了（status = 'paid'）に更新。
    - 銀行振込の場合→手動入金確認後などにコールする
    - Stripeの場合→Webhook連携 or フロントから成功通知でコールする
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return {"error": "Order not found"}

    order.status = "paid"
    db.commit()
    return {"status": "completed", "order_id": order.id}


