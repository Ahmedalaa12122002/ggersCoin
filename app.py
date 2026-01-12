from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from jose import jwt
import hashlib, hmac, time, urllib.parse

BOT_TOKEN = "8088771179:AAHE_OhI7Hgq1sXZfHCdYtHd2prBvHzg_rQ"
JWT_SECRET = "CHANGE_THIS_SECRET_123"
JWT_ALG = "HS256"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # نضيّقها لاحقًا
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running"}

def verify_init_data(init_data: str):
    parsed = dict(urllib.parse.parse_qsl(init_data))
    hash_telegram = parsed.pop("hash", None)

    if not hash_telegram:
        raise HTTPException(status_code=401, detail="No hash")

    data_check = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
    secret_key = hashlib.sha256(BOT_TOKEN.encode()).digest()

    calculated_hash = hmac.new(
        secret_key,
        data_check.encode(),
        hashlib.sha256
    ).hexdigest()

    if calculated_hash != hash_telegram:
        raise HTTPException(status_code=401, detail="Invalid Telegram auth")

    auth_date = int(parsed.get("auth_date", 0))
    if time.time() - auth_date > 86400:
        raise HTTPException(status_code=401, detail="Auth expired")

    return eval(parsed["user"])

@app.post("/auth/telegram")
def auth(data: dict):
    init_data = data.get("initData")
    if not init_data:
        raise HTTPException(status_code=400, detail="Missing initData")

    user = verify_init_data(init_data)

    payload = {
        "user_id": user["id"],
        "exp": int(time.time()) + 86400
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

    return {
        "token": token,
        "user": {
            "id": user["id"],
            "username": user.get("username")
        }
  }
