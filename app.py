from flask import Flask, jsonify, request, send_from_directory
import time
from db import get_db, init_db

app = Flask(__name__)
init_db()

BASE_TIME = 300   # 5 دقائق
REWARD = 10       # 10 نقاط

def vip_time(vip):
    if vip == 1:
        return 270
    if vip == 2:
        return 240
    if vip == 3:
        return 210
    if vip == 4:
        return 180
    return BASE_TIME

@app.route("/")
def index():
    return send_from_directory("web", "index.html")

@app.route("/status", methods=["POST"])
def status():
    user_id = int(request.json["user_id"])
    db = get_db()
    c = db.cursor()

    c.execute("SELECT points, vip_level FROM users WHERE user_id=%s", (user_id,))
    row = c.fetchone()

    if not row:
        c.execute("INSERT INTO users (user_id) VALUES (%s)", (user_id,))
        db.commit()
        return jsonify({"points": 0, "vip": 0})

    return jsonify({"points": row[0], "vip": row[1]})

@app.route("/play", methods=["POST"])
def play():
    user_id = int(request.json["user_id"])
    now = int(time.time())
    db = get_db()
    c = db.cursor()

    c.execute("SELECT points, last_play, vip_level FROM users WHERE user_id=%s", (user_id,))
    row = c.fetchone()

    if not row:
        c.execute("INSERT INTO users (user_id) VALUES (%s)", (user_id,))
        db.commit()
        return jsonify({"wait": vip_time(0)})

    points, last_play, vip = row
    wait_time = vip_time(vip)

    if now - last_play < wait_time:
        return jsonify({"wait": wait_time - (now - last_play)})

    points += REWARD
    c.execute(
        "UPDATE users SET points=%s, last_play=%s WHERE user_id=%s",
        (points, now, user_id)
    )
    db.commit()

    return jsonify({"points": points, "wait": wait_time})
