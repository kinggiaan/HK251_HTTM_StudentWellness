import json
import os
import shutil
from pathlib import Path
from typing import Optional
import requests

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from fastapi import status

from model_manager import ModelManager


# Strapi configuration
STRAPI_URL = os.getenv("STRAPI_URL", "http://localhost:1337")
STRAPI_API_TOKEN = os.getenv("STRAPI_API_TOKEN", "")


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


@router.get("/presets/{preset_name}/metadata", tags=["presets"], summary="Get metadata for a preset")
async def get_preset_metadata(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    metadata = manager.get_metadata(preset_name)
    if metadata is None:
        raise HTTPException(status_code=404, detail="Metadata not found")
    return metadata


@router.post("/presets/{preset_name}/deploy", tags=["presets"], summary="Deploy a preset (mark as active for predictions)")
async def deploy_preset(preset_name: str, manager: ModelManager = Depends(get_manager)):
    validate_preset_name(preset_name)
    if not (manager.base_dir / preset_name).exists():
        raise HTTPException(status_code=404, detail="Preset not found")
    
    # Check if preset is trained (has model)
    model_path = Path(manager.base_dir) / preset_name / "model.pkl"
    if not model_path.exists():
        raise HTTPException(status_code=400, detail="Cannot deploy untrained preset")
    
    ok = manager.deploy_preset(preset_name)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to deploy preset")
    
    # Automatically re-predict all students with the newly deployed model
    try:
        await repreddict_all_students(preset_name, manager)
    except Exception:
        # Don't fail deployment if re-prediction fails
        pass
    
    return {"success": True, "message": f"Preset '{preset_name}' deployed successfully and predictions updated"}


async def repreddict_all_students(preset_name: str, manager: ModelManager):
    """Re-predict all students in Strapi using the newly deployed preset."""
    try:
        # Fetch all students from Strapi
        headers = {
            "Authorization": f"Bearer {STRAPI_API_TOKEN}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"{STRAPI_URL}/api/students?pagination[limit]=10000",
            headers=headers
        )
        
        if response.status_code != 200:
            return
        
        data = response.json()
        students = data.get("data", [])
        
        if not students:
            return
        
        success_count = 0
        failed_count = 0
        
        # Re-predict each student
        for student in students:
            try:
                document_id = student.get("documentId")  # Use documentId for Strapi v4
                
                # Prepare features for prediction
                # Map database field names to model expected names (with spaces and capital letters)
                features = {
                    "Gender": student.get("gender"),
                    "Age": student.get("age"),
                    "City": student.get("city"),
                    "CGPA": student.get("cgpa"),
                    "Degree": student.get("degree"),
                    "Academic Pressure": student.get("academic_pressure"),
                    "Study Satisfaction": student.get("study_satisfaction"),
                    "Sleep Duration": student.get("sleep_duration"),
                    "Dietary Habits": student.get("dietary_habits"),
                    "Work/Study Hours": student.get("work_study_hours"),
                    "Financial Stress": student.get("financial_stress"),
                    "Family History of Mental Illness": student.get("family_his_of_mental_illness")
                }
                
                # Skip if missing required fields
                if not features.get("Age") or not features.get("Gender"):
                    failed_count += 1
                    continue
                
                # Run prediction
                prediction_result = manager.predict(preset_name, features)
                
                # Extract prediction value (model returns {"prediction": [0]} or {"prediction": [1]})
                prediction_list = prediction_result.get("prediction", [0])
                depression_predicting = prediction_list[0] if prediction_list else 0
                
                # Update student in Strapi with new prediction AND reset validated status
                # Use documentId instead of numeric id for Strapi v4
                update_response = requests.put(
                    f"{STRAPI_URL}/api/students/{document_id}",
                    headers=headers,
                    json={
                        "data": {
                            "depression_predicting": depression_predicting,
                            "validated": False  # Reset validation status when deploying new model
                        }
                    }
                )
                
                if update_response.status_code == 200:
                    success_count += 1
                else:
                    failed_count += 1
                    
            except Exception as e:
                failed_count += 1
        
    except Exception as e:
        raise


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

