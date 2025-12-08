import json
import os
import shutil
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi import status

from model_manager import ModelManager


def get_manager() -> ModelManager:
    # In a real app, this could be a singleton injected via dependency
    global _manager_instance
    if "_manager_instance" not in globals():
        _manager_instance = ModelManager()
    return _manager_instance


router = APIRouter()


def validate_preset_name(preset_name: str):
    if not preset_name or any(ch in preset_name for ch in "/\\.."):
        raise HTTPException(status_code=400, detail="Invalid preset name")


def _load_json_file(path: Path) -> Optional[dict]:
    try:
        return json.load(open(path))
    except Exception:
        return None


@router.post(
    "/presets",
    status_code=status.HTTP_201_CREATED,
    tags=["presets"],
    summary="Create a new preset with dataset upload and config",
)
async def create_preset(
    preset_name: str = Form(...),
    file: UploadFile = File(...),
    config: Optional[str] = Form(None),
    manager: ModelManager = Depends(get_manager),
):
    validate_preset_name(preset_name)
    preset_dir = Path(manager.base_dir) / preset_name
    if preset_dir.exists():
        raise HTTPException(status_code=400, detail="Preset already exists")

    tmp_path = preset_dir.parent / f"{preset_name}_upload.csv"
    try:
        preset_dir.mkdir(parents=True, exist_ok=False)
        with open(tmp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        cfg = json.loads(config) if config else {}
        if not manager.create_preset(preset_name, tmp_path, cfg):
            raise HTTPException(status_code=500, detail="Failed to create preset")
        return {"success": True, "preset_name": preset_name}
    finally:
        if tmp_path.exists():
            tmp_path.unlink()


@router.put("/presets/{preset_name}", tags=["presets"], summary="Update preset config")
async def update_preset(preset_name: str, config: dict, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    if not (manager.base_dir / preset_name).exists():
        raise HTTPException(status_code=404, detail="Preset not found")
    ok = manager.update_config(preset_name, config)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to update config")
    return {"success": True}


@router.post("/presets/{preset_name}/retrain", tags=["training"], summary="Retrain model for a preset")
async def retrain_preset(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    if not (manager.base_dir / preset_name).exists():
        raise HTTPException(status_code=404, detail="Preset not found")
    manager.retrain(preset_name)
    return {"success": True, "message": "Training started"}


@router.get("/presets/{preset_name}/analysis", tags=["analysis"], summary="Get dataset analysis for a preset")
async def get_analysis(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    target = Path(manager.base_dir) / preset_name / "dataset_analysis.json"
    data = _load_json_file(target)
    if data is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    manager.analysis[preset_name] = data
    return data


@router.get("/presets/{preset_name}/config", tags=["presets"], summary="Get config for a preset")
async def get_preset_config(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    target = Path(manager.base_dir) / preset_name / "config.json"
    data = _load_json_file(target)
    if data is None:
        raise HTTPException(status_code=404, detail="Config not found")
    manager.configs[preset_name] = data
    return data


@router.get("/presets/{preset_name}/performance", tags=["performance"], summary="Get model performance for a preset")
async def get_performance(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    target = Path(manager.base_dir) / preset_name / "model_performance.json"
    data = _load_json_file(target)
    if data is None:
        raise HTTPException(status_code=404, detail="Performance not found")
    manager.performance[preset_name] = data
    return data


@router.get("/presets/{preset_name}/plots", tags=["plots"], summary="List plot image URLs for a preset")
async def list_plots(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    plots_dir = Path(manager.base_dir) / preset_name / "plots"
    if not plots_dir.exists():
        raise HTTPException(status_code=404, detail="Plots not found")
    urls = {}
    for img in plots_dir.glob("*.png"):
        urls[img.name] = f"/static/dataset_model/{preset_name}/plots/{img.name}"
    return {"plots": urls}


@router.delete("/presets/{preset_name}", tags=["presets"], summary="Delete a preset and its artifacts")
async def delete_preset(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    if not (manager.base_dir / preset_name).exists():
        raise HTTPException(status_code=404, detail="Preset not found")
    ok = manager.delete_preset(preset_name)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to delete preset")
    return {"success": True}


@router.get("/presets/{preset_name}/state", tags=["state"], summary="Get current state for a preset")
async def get_state(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    target = Path(manager.states_dir) / preset_name / "state.json"
    data = _load_json_file(target)
    if data is None:
        raise HTTPException(status_code=404, detail="State not found")
    manager.states[preset_name] = data
    return data


@router.get("/presets", tags=["presets"], summary="List all presets")
async def list_presets(manager: ModelManager = Depends(get_manager)):
    names = [p.name for p in Path(manager.base_dir).glob("*") if p.is_dir()]
    return {"presets": names}


@router.post("/presets/{preset_name}/predict", tags=["prediction"], summary="Run prediction using a preset model")
async def predict(preset_name: str, features: dict, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    try:
        result = manager.predict(preset_name, features)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

