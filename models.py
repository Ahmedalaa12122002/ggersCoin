from database import get_db

def get_user(user_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    db.close()
    return user

def create_user(user):
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
    INSERT OR IGNORE INTO users
    (id, first_name, last_name, username, language)
    VALUES (?, ?, ?, ?, ?)
    """, (
        user["id"],
        user["first_name"],
        user["last_name"],
        user["username"],
        user["language"]
    ))

    db.commit()
    db.close()
