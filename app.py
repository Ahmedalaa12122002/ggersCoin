from flask import Flask, send_from_directory, request, jsonify
from db import init_db, add_user, add_balance, get_balance

app = Flask(__name__)
init_db()

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/api/init", methods=["POST"])
def init_user():
    user_id = request.json.get("user_id")
    add_user(user_id)
    return jsonify({"balance": get_balance(user_id)})

@app.route("/api/play", methods=["POST"])
def play():
    user_id = request.json.get("user_id")
    add_balance(user_id, 1)
    return jsonify({"balance": get_balance(user_id)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
