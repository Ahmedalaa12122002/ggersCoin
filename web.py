from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return HTMLResponse("""
    <html>
    <head>
        <title>Web App</title>
    </head>
    <body style="text-align:center;margin-top:50px">
        <h1>✅ الويب شغال</h1>
        <p>تم فتح التطبيق بنجاح</p>
    </body>
    </html>
    """)
