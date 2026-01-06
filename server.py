from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# static files
app.mount("/static", StaticFiles(directory="webapp"), name="static")

@app.get("/")
def home():
    return FileResponse("webapp/index.html")

# مهم لـ Railway
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
