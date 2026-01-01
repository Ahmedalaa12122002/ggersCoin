import psycopg2
import os

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def init_db():
    db = get_db()
    c = db.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id BIGINT PRIMARY KEY,
        points BIGINT DEFAULT 0,
        last_play BIGINT DEFAULT 0,
        vip_level INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    db.commit()
    c.close()
    db.close()
