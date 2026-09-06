from peewee import *
from models import *
import aiopg

def get_characters(phone: str):
    return Characters.select().join(PhoneUsers).where(PhoneUsers.phone == phone)