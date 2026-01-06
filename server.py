from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return FileResponse("webapp/index.html")
