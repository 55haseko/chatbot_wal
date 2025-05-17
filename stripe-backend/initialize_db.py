from sqlalchemy import create_engine
from models.order import Base
from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
