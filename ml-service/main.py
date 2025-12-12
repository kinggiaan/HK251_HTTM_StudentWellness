import uvicorn
import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

# Get the directory where main.py is located
BASE_DIR = Path(__file__).resolve().parent

# Change working directory to ml-service folder (for relative imports and paths)
os.chdir(BASE_DIR)

# Add BASE_DIR to sys.path for imports
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Load environment variables from .env file
load_dotenv()

from api import router, get_manager
from model_manager import ModelManager

app = FastAPI(
    title="ML Service API",
    description="Service to manage student wellness models: presets, training, evaluation, and prediction.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

manager = get_manager()

# Use absolute path for static files directory
public_dir = BASE_DIR / "public"
app.mount("/static", StaticFiles(directory=str(public_dir)), name="static")
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    # Ensure manager initialized
    _ = manager


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

