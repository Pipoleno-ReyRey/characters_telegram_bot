import os
import dotenv
from peewee import PostgresqlDatabase

dotenv.load_dotenv()

db = PostgresqlDatabase(
    database=os.getenv("POSTGRES_DB", "postgres"),
    user=os.getenv("POSTGRES_USER", "postgres"),
    password=os.getenv("POSTGRES_PASSWORD", ""),
    host=os.getenv("POSTGRES_HOST", "localhost"),
    port=int(os.getenv("POSTGRES_PORT", 5432)),
)
