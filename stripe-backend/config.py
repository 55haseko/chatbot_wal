import os
from dotenv import load_dotenv

load_dotenv()

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")