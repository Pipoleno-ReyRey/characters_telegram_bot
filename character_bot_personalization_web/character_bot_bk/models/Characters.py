from typing import Optional

import pydantic as py
import sqlmodel as sql

from .Users import PhoneUsers


class Characters(sql.SQLModel, table=True):
    __tablename__ = "characters"
    __table_args__ = {"schema": "telegram_bot_characters"}

    id: Optional[int] = sql.Field(primary_key=True)
    character: str = sql.Field(max_length=250)
    description: str = sql.Field(max_length=800)
    presentation: str = sql.Field(max_length=100)
    user_id: int = sql.Field()


class TelegramBotCharacters(py.BaseModel):
    character: str = py.Field(max_length=250, min_length=3)
    description: str = py.Field()
    user: Optional[PhoneUsers] = py.Field()


class CharacterDataAI(py.BaseModel):
    presentation: str = py.Field(max_length=100)
    description: str = py.Field()
