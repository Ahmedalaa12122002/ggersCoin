import psycopg2
import os

DATABASE_URL = os.environ.get("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

def init_db():
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id BIGINT PRIMARY KEY,
        username TEXT,
        points BIGINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()

def add_user(user_id, username):
    cur.execute(
        "INSERT INTO users (user_id, username) VALUES (%s, %s) ON CONFLICT DO NOTHING",
        (user_id, username)
    )
    conn.commit()
