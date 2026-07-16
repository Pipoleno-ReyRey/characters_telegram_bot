from peewee import AutoField, CharField, Model, ForeignKeyField, IntegerField
from database import db


class BaseModel(Model):
    class Meta:
        database = db
        schema = "telegram_bot_characters"

class PhoneUsers(BaseModel):
    id = AutoField()
    name = CharField()
    phone = CharField(unique=True)

class Characters(BaseModel):
    id = AutoField()
    character = CharField()
    presentation = CharField()
    description = CharField()
    user_id = ForeignKeyField(PhoneUsers, field="id")

class CharacterSaved(BaseModel):
    character = CharField()
    presentation = CharField()
    description = CharField()
