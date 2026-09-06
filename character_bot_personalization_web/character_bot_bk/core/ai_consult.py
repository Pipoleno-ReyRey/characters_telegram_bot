import os

import dotenv
import requests
from google import genai

from models.Characters import *

dotenv.load_dotenv()


def ollama_presentation(character: TelegramBotCharacters):

    model = "gemma4:e4b"
    prompt = f"""
    Mira este personaje: {character.character},
    su descripcion: {character.description};
    Generame una presentacion del personaje utilizando menos de 100 caracteres, una presentacion corta para describir al personaje
    de manera resumida y saber con quien vamos a hablar, solo dame el texto y emojis, ninguna informacion mas
    """
    options = {
        "temperature": 0.8
    }

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "options": options,
            "stream": False,
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["response"]


def ollama_description(character: TelegramBotCharacters):

    model = "gemma4:e4b"
    prompt = f"""Mira este personaje: {character.character},
    su descripcion: {character.description};
    generame una mejor descripcion para este personaje utilizando estos datos e indicaciones, quiero que no pase los 700
    caracteres haz una buena descripcion, se le pasara a una IA y esta fingira ser este personaje asi que en estos 700 
    caracteres debes ser detallado y conciso, solo dame la descripcion, nada de saludos ni despedidas ni ideas, 
    solo la descripcion, y lo escribiras como si hablaras de mi, osea utilizando 'TU' para decirle a la IA quien"""

    options = {
        "temperature": 0.8
    }

    # response = client.generate(model=model, prompt=prompt, options=options)

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "options": options,
            "stream": False,
        },
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["response"]


def gemini_prompt(character: TelegramBotCharacters):
    token = os.getenv("GEMINI_TOKEN")

    client = genai.Client(api_key=token)

    response = client.models.generate_content(model="gemini-2.5-flash", contents=f"""
    Mira este personaje: {character.character},
    su descripcion: {character.description};
    
    generame una mejor descripcion para este personaje utilizando estos datos e indicaciones, quiero que no pase los 700
    caracteres haz una buena descripcion, se le pasara a una IA y esta fingira ser este personaje asi que en estos 700 
    caracteres debes ser detallado y conciso, solo dame la descripcion, nada de saludos ni despedidas ni ideas, 
    solo la descripcion, y lo escribiras como si hablaras de mi, osea utilizando 'TU' para decirle a la IA quien es, sin saltos
    de linea 
    """)

    response = response.text

    return response


def generate_desc(character: TelegramBotCharacters):
    try:
        return [
            ollama_presentation(character),
            gemini_prompt(character),
        ]

    except Exception as e:
        print(e)
        return [
            ollama_presentation(character),
            ollama_description(character)
        ]
