import http
import os

import dotenv
from sqlmodel import Session, select

from core.ai_consult import *
from db.db_configuration import engine
from models.Characters import *
from models.Users import *

dotenv.load_dotenv()

url = os.getenv("TELEGRAM_BOT")

"""LOGIN / REGISTRER FUNCTIONS"""


def registrer(u: User):
    up = PhoneUsers(name=u.name, phone=u.phone)
    try:
        with Session(engine) as session:
            session.add(up)
            session.commit()
            session.refresh(up)
            return up
    except Exception as e:
        return f"fallo por {e}"


def login(u: User):
    with Session(engine) as session:
        return session.exec(select(PhoneUsers)
                            .where(PhoneUsers.name == u.name)
                            .where(PhoneUsers.phone == u.phone)).one()


"""CRUD TELEGRAM BOT CHARACTERS FUNCTIONS"""


def save_character(character: TelegramBotCharacters):
    character.character = character.character.replace(" ", "_")
    presentation = generate_desc(character)[0]
    character.description = generate_desc(character)[1]
    bot = Characters(character=character.character, presentation=presentation, description=character.description,
                     user_id=character.user.id)
    try:
        with Session(engine) as session:
            session.add(bot)
            session.commit()
            session.refresh(bot)
            return {"bot": bot, "url": url}
    except Exception as e:
        return {"status": http.HTTPStatus.BAD_REQUEST.value, "message": str(e)}
