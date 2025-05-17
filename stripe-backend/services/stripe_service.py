import stripe
from config import STRIPE_SECRET_KEY

stripe.api_key = STRIPE_SECRET_KEY

def create_payment_intent(amount: int, currency: str = "jpy", order_id: int = None, name: str = None):
    """
    PaymentIntentを作成し、client_secretを返す。
    - amount: 日本円の場合は1=1円
    - metadataにorder_idやnameを含めるとStripeダッシュボードで参照しやすい
    """
    metadata = {}
    if order_id:
        metadata["order_id"] = order_id
    if name:
        metadata["name"] = name  # ← ここに追加

    intent = stripe.PaymentIntent.create(
        amount=amount,
        currency=currency,
        payment_method_types=["card"],
        metadata=metadata
    )
    return intent
