import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import CommandHandler, MessageHandler, filters, ApplicationBuilder, CallbackContext, \
    CallbackQueryHandler
import dotenv
import time

import ai_consult
from ai_consult import gemini_agent
from consults import get_characters
from models import Characters

dotenv.load_dotenv()
token = os.getenv("TELEGRAM_TOKEN")
phone_button = InlineKeyboardButton(text="Numero de teléfono 📱", callback_data="""phone button""")
inline = InlineKeyboardMarkup(inline_keyboard=[[phone_button]]).from_button(phone_button)
characters_finded: list[Characters] = []
phone_number = ''
character_selected = None

async def start(update, context):
    await update.message.reply_text("""
    ¡Hola! 👋 Bienvenido. Primero, vamos a registrar tu número de teléfono 📱. 
    Luego, te mostraré las opciones de personajes para elegir. ¡Vamos allá!""", reply_markup=inline)

async def scripts(update: Update, context:CallbackContext):
    global characters_finded
    global phone_number
    u_message = str(update.message.text)

    if "help" in u_message or "/help" in u_message:
        await update.message.reply_text(f"Claro, tu numero es: {phone_number}, aqui tienes algunas opciones de ayuda",
                                        reply_markup=inline)

    elif len(characters_finded) > 0:
        await select_character(update, context)

    elif "phone: " or "/phone: " in u_message:
        print(f"user write {u_message}")
        for i in str(u_message):
            if i.isdigit():
                phone_number += i

        await update.message.reply_text("📱✅ ¡Listo! Tu número de teléfono quedó guardado correctamente.")

        characters = get_characters(phone_number)
        characters_options = ''
        for c in characters:
            characters_finded.append(c)
            characters_options += f"/{c.character}: {c.presentation}\n\n"

        await update.message.reply_text(characters_options)

async def select_character(update, context):
    global character_selected
    global characters_finded

    if character_selected is None:
        user_selected = update.message.text
        for c in characters_finded:
            if c.character in user_selected:
                character_selected = c
                await update.message.reply_text(f"""✨ ¡Todo listo! A partir de este momento estarás hablando 
                    con {c.character}. Ponte cómodo y empieza la conversación. ¡Disfruta la experiencia! 🎭""")
    else:
        response = ai_consult.agent_controller(update.message.text, character_selected)
        await update.message.reply_text(response)

async def push_button(update: Update, context: CallbackContext):
    option = update.callback_query
    await option.answer()
    if option.data == "phone button":
        await option.message.reply_text("""
        📱 Ingresa tu número de teléfono así:
        👉 Escribe "phone:" o "/phone:" 
        ➡️ Luego tu número sin espacios ni símbolos.
        
        Ejemplo -> phone:8095551234
        """)

app = ApplicationBuilder().token(str(token)).read_timeout(60).connect_timeout(30).build()
app.add_handler(CallbackQueryHandler(push_button))
app.add_handler(CommandHandler("start", start))
app.add_handler(MessageHandler(filters.TEXT, scripts))

while True:
    try:
        app.run_polling(poll_interval=1, timeout=180)
    except:
        print("EL BOT SE DETUVO, TUVO UN ERROR")
        time.sleep(10)

