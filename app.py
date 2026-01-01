from flask import Flask, send_file
import os
from db import init_db

app = Flask(__name__)

init_db()

@app.route("/")
def home():
    return send_file("index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
