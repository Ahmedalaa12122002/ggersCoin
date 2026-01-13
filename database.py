import sqlite3
import threading

DB_NAME = "data.db"
lock = threading.Lock()

def get_conn():
    return sqlite3.connect(DB_NAME, check_same_thread=False)

def init_db():
    with lock:
        conn = get_conn()
        c = conn.cursor()

        # جدول المستخدمين
        c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            username TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # ربط الأجهزة بالحسابات
        c.execute("""
        CREATE TABLE IF NOT EXISTS devices (
            device_id TEXT,
            user_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(device_id, user_id)
        )
        """)

        conn.commit()
        conn.close()

def get_users_for_device(device_id):
    conn = get_conn()
    c = conn.cursor()
    c.execute(
        "SELECT user_id FROM devices WHERE device_id=?",
        (device_id,)
    )
    rows = c.fetchall()
    conn.close()
    return {r[0] for r in rows}

def add_user(user_id, username):
    conn = get_conn()
    c = conn.cursor()
    c.execute(
        "INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)",
        (user_id, username)
    )
    conn.commit()
    conn.close()

def bind_device(device_id, user_id):
    conn = get_conn()
    c = conn.cursor()
    c.execute(
        "INSERT OR IGNORE INTO devices (device_id, user_id) VALUES (?, ?)",
        (device_id, user_id)
    )
    conn.commit()
    conn.close()
