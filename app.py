from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return HTMLResponse("""
    <h1>✅ الويب شغال</h1>
    <p>تم تشغيل Web App بنجاح</p>
    """)
