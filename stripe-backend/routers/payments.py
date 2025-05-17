
from fastapi import APIRouter
from pydantic import BaseModel
from services.stripe_service import create_payment_intent

router = APIRouter()

class PaymentIntentRequest(BaseModel):
    amount: int
    order_id: int | None = None
    name: str | None = None  # ← ここを追加

@router.post("/create-payment-intent")
def payment_intent(payload: PaymentIntentRequest):
    """
    指定した amount (円) と order_id を元にStripeのPaymentIntentを作成。
    戻り値の client_secret をフロントエンドが受け取り、
    Stripe Elementsを使って決済を確定する。
    """
    intent = create_payment_intent(
        amount=payload.amount,
        order_id=payload.order_id,
        name=payload.name
    )
    return {"client_secret": intent.client_secret}