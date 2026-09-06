from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from db.consults import *
from db.db_configuration import *
from models.Characters import *
from models.Users import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://confining-spearmint-purify.ngrok-free.dev", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


@app.on_event("startup")
async def startup():
    SQLModel.metadata.create_all(engine)


"""LOGIN AND SIGNUP"""


@app.post("/api/login")
async def get_user(u: User):
    return login(u)


@app.post("/api/registrer")
async def elements(u: User):
    return registrer(u)


"""CHARACTERS CREATE"""

@app.post("/api/characters")
async def post_character(character: TelegramBotCharacters):
    bot = save_character(character)
    return bot
