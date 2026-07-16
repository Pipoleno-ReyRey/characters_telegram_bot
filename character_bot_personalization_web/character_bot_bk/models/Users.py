from typing import Optional

import sqlmodel as sql
from pydantic import BaseModel, Field


class PhoneUsers(sql.SQLModel, table=True):
    __tablename__ = "phoneusers"
    __table_args__ = {"schema": "telegram_bot_characters"}

    id: Optional[int] = sql.Field(primary_key=True)
    name: str = sql.Field(max_length=100)
    phone: str = sql.Field(max_length=100)


class User(BaseModel):
    id: Optional[int] = Field(default=None)
    name: str = Field(max_length=250)
    phone: str = Field(max_length=250)
