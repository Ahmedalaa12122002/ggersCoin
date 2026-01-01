from flask import Flask, send_file, request, abort
import os

app = Flask(__name__)

@app.route("/")
def index():
    # التأكد إن الفتح من Telegram
    if not request.headers.get("User-Agent"):
        abort(403)
    return send_file("index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
