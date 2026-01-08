from fastapi import APIRouter, Body
import sqlite3
import os

router = APIRouter(prefix="/api/farm/lands", tags=["Farm - Lands"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_NAME = os.path.join(BASE_DIR, "database.db")

TOTAL_LANDS = 12

def get_db():
    return sqlite3.connect(DB_NAME)

@router.post("/")
def get_lands(user: dict = Body(...)):
    user_id = user.get("id")

    db = get_db()
    cursor = db.cursor()

    # جدول VIP (لو مش موجود)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vip (
        user_id INTEGER PRIMARY KEY,
        is_vip INTEGER DEFAULT 0
    )
    """)

    cursor.execute("SELECT is_vip FROM vip WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()

    is_vip = row[0] if row else 0
    db.close()

    lands = []

    for i in range(1, TOTAL_LANDS + 1):
        if i == 1:
            status = "open"
        elif is_vip:
            status = "open"
        else:
            status = "locked"

        lands.append({
            "land_id": i,
            "status": status
        })

    return {
        "total": TOTAL_LANDS,
        "is_vip": bool(is_vip),
        "lands": lands
  }
