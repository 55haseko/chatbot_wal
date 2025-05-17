from fastapi import FastAPI
from routers import orders, payments, utils
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 先にCORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ← フロントのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーター登録
app.include_router(orders.router, prefix="/order", tags=["orders"])
app.include_router(payments.router, prefix="/payments", tags=["payments"])
app.include_router(utils.router, prefix="/utils", tags=["utils"])