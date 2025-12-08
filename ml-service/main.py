import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

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
app.mount("/static", StaticFiles(directory="public"), name="static")
app.include_router(router)


@app.on_event("startup")
async def startup_event():
    # Ensure manager initialized
    _ = manager


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

