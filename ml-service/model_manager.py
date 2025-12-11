import json
import shutil
import threading
from pathlib import Path
from typing import Dict, List, Optional

import joblib
import pandas as pd

from model_pipeline import run_pipeline


class ModelManager:
    def __init__(self, base_dir: str = "./public/dataset_model", states_dir: str = "./public/states"):
        self.base_dir = Path(base_dir)
        self.states_dir = Path(states_dir)
        self.models: Dict[str, object] = {}
        self.analysis: Dict[str, dict] = {}
        self.performance: Dict[str, dict] = {}
        self.configs: Dict[str, dict] = {}
        self.states: Dict[str, dict] = {}
        self.metadata: Dict[str, dict] = {}  # Store preset metadata
        self.lock = threading.Lock()
        self._load_all_presets()

    def _load_json(self, path: Path) -> Optional[dict]:
        try:
            return json.load(open(path))
        except Exception:
            return None

    def _mark_not_trained(self, preset_name: str) -> None:
        """Ensure state file reflects a missing/absent trained model."""
        state_dir = self.states_dir / preset_name
        state_dir.mkdir(parents=True, exist_ok=True)
        state_path = state_dir / "state.json"
        state_data = self._load_json(state_path) or {}
        state_data["state"] = "not-trained"
        with open(state_path, "w") as f:
            json.dump(state_data, f, indent=2)
        self.states[preset_name] = state_data

    def _load_all_presets(self):
        if not self.base_dir.exists():
            return
        for preset_dir in self.base_dir.iterdir():
            if preset_dir.is_dir():
                preset = preset_dir.name
                self.reload_preset(preset)

    def get_preset_names(self) -> List[str]:
        return list(self.base_dir.glob("*"))

    def get_model(self, preset_name: str):
        return self.models.get(preset_name)

    def get_config(self, preset_name: str) -> Optional[dict]:
        return self.configs.get(preset_name)

    def update_config(self, preset_name: str, config: dict) -> bool:
        preset_dir = self.base_dir / preset_name
        try:
            preset_dir.mkdir(parents=True, exist_ok=True)
            config_path = preset_dir / "config.json"
            with open(config_path, "w") as f:
                json.dump(config, f, indent=2)
            self.configs[preset_name] = config
            return True
        except Exception:
            return False

    def get_dataset_analysis(self, preset_name: str) -> Optional[dict]:
        return self.analysis.get(preset_name)

    def get_model_performance(self, preset_name: str) -> Optional[dict]:
        return self.performance.get(preset_name)

    def get_state(self, preset_name: str) -> Optional[dict]:
        return self.states.get(preset_name)
    
    def get_metadata(self, preset_name: str) -> Optional[dict]:
        return self.metadata.get(preset_name)
    
    def deploy_preset(self, preset_name: str) -> bool:
        """Mark a preset as deployed and unmark others."""
        preset_dir = self.base_dir / preset_name
        state_dir = self.states_dir / preset_name
        
        if not preset_dir.exists():
            return False
        
        try:
            # Update state.json to mark as deployed
            state_dir.mkdir(parents=True, exist_ok=True)
            state_path = state_dir / "state.json"
            
            # Load existing state or create new one
            if state_path.exists():
                state_data = json.load(open(state_path))
            else:
                state_data = {"state": "idle"}
            
            # Mark this preset as deployed
            state_data["deployed"] = True
            
            # Save state
            with open(state_path, "w") as f:
                json.dump(state_data, f, indent=2)
            
            self.states[preset_name] = state_data
            
            # Unmark all other presets
            for other_preset in self.base_dir.iterdir():
                if other_preset.is_dir() and other_preset.name != preset_name:
                    other_state_dir = self.states_dir / other_preset.name
                    other_state_path = other_state_dir / "state.json"
                    
                    if other_state_path.exists():
                        other_state_data = json.load(open(other_state_path))
                        if other_state_data.get("deployed"):
                            other_state_data["deployed"] = False
                            with open(other_state_path, "w") as f:
                                json.dump(other_state_data, f, indent=2)
                            self.states[other_preset.name] = other_state_data
            
            return True
        except Exception as e:
            print(f"Error deploying preset {preset_name}: {e}")
            return False

    def _expected_features(self, preset_name: str, fallback_features: list) -> list:
        """Get expected feature columns for prediction."""
        # Default feature columns matching the training pipeline
        default_feat_cols = [
            "Gender",
            "Age",
            "Academic Pressure",
            "CGPA",
            "Study Satisfaction",
            "Sleep Duration",
            "Dietary Habits",
            "Work/Study Hours",
            "Financial Stress",
            "Family History of Mental Illness",
        ]
        
        cfg_feats = self.configs.get(preset_name, {}).get("features", [])
        if isinstance(cfg_feats, list) and len(cfg_feats) > 0:
            return cfg_feats
        analysis = self.analysis.get(preset_name, {})
        cols = []
        for entry in analysis.get("column_analysis", []):
            orig = entry.get("original_name")
            if orig and orig != "Depression":
                cols.append(orig)
        if cols:
            return cols
        # fallback: use default feature columns or keys of features passed in
        if fallback_features:
            return list(fallback_features)
        return default_feat_cols

    def predict(self, preset_name: str, features: dict) -> dict:
        """
        Predict depression using the trained model.
        
        The pipeline includes a FunctionTransformer that handles all categorical
        mappings, so we just need to pass the raw feature data.
        """
        model = self.models.get(preset_name)
        if model is None:
            raise ValueError("Model not found")

        # models are saved as a dict of target -> estimator; pick the target if present
        estimator = model
        if isinstance(model, dict):
            if "Depression" in model:
                estimator = model["Depression"]
            else:
                estimator = next(iter(model.values()), None)
        if estimator is None:
            raise ValueError("Model not found")

        expected_cols = self._expected_features(preset_name, features.keys())
        
        # Filter input features to only include expected columns
        filtered_features = {col: features.get(col) for col in expected_cols}
        df = pd.DataFrame([filtered_features])
        # print("df types", df.dtypes)
        # print("model expected dtypes", estimator.feature_names_in_)

        # The pipeline handles all preprocessing (mappings, encoding, etc.)
        # Just pass the raw data as it would appear in the original dataset
        preds = estimator.predict(df)
        response = {"prediction": preds.tolist()}
        if hasattr(estimator, "predict_proba"):
            try:
                proba = estimator.predict_proba(df)
                response["probabilities"] = proba.tolist()
            except Exception:
                pass
        return response

    def retrain(self, preset_name: str) -> bool:
        def _job():
            try:
                run_pipeline(preset_name)
                self.reload_preset(preset_name)
            except Exception:
                # swallow to avoid killing the thread; state will reflect failure via pipeline
                pass

        threading.Thread(target=_job, daemon=True).start()
        return True

    def create_preset(self, preset_name: str, dataset_file: Path, config: dict) -> bool:
        preset_dir = self.base_dir / preset_name
        try:
            print("creating preset directory", preset_dir)
            preset_dir.mkdir(parents=True, exist_ok=False)
        except FileExistsError:
            pass# Exists is ok
        try:
            print("copying dataset file to preset directory", dataset_file, preset_dir / "dataset.csv")
            shutil.copy(dataset_file, preset_dir / "dataset.csv")
            print("updating config", preset_name, config)
            self.update_config(preset_name, config or {})
            
            # Save metadata with original filename and creation time
            metadata = {
                "preset_name": preset_name,
                "original_filename": dataset_file.name,
                "created_at": pd.Timestamp.now().isoformat(),
            }
            metadata_path = preset_dir / "metadata.json"
            with open(metadata_path, "w") as f:
                json.dump(metadata, f, indent=2)
            
            print("config updated", preset_name, config)
            return True
        except Exception:
            print("error copying dataset file to preset directory", dataset_file, preset_dir / "dataset.csv")
            shutil.rmtree(preset_dir, ignore_errors=True)
            return False

    def delete_preset(self, preset_name: str) -> bool:
        preset_dir = self.base_dir / preset_name
        try:
            shutil.rmtree(preset_dir, ignore_errors=True)
            if preset_name in self.models:
                self.models.pop(preset_name, None)
            self.analysis.pop(preset_name, None)
            self.performance.pop(preset_name, None)
            self.configs.pop(preset_name, None)
            self.states.pop(preset_name, None)
            self.metadata.pop(preset_name, None)
            return True
        except Exception:
            return False

    def reload_preset(self, preset_name: str) -> bool:
        preset_dir = self.base_dir / preset_name
        if not preset_dir.exists():
            return False
        try:
            model_path = preset_dir / "model.pkl"
            if model_path.exists():
                self.models[preset_name] = joblib.load(model_path)
            else:
                # Model file missing: clear any cached model and mark preset as not trained
                self.models.pop(preset_name, None)
                self._mark_not_trained(preset_name)
            self.analysis[preset_name] = self._load_json(preset_dir / "dataset_analysis.json") or {}
            self.performance[preset_name] = self._load_json(preset_dir / "model_performance.json") or {}
            self.configs[preset_name] = self._load_json(preset_dir / "config.json") or {}
            self.states[preset_name] = self._load_json(self.states_dir / preset_name / "state.json") or {}
            self.metadata[preset_name] = self._load_json(preset_dir / "metadata.json") or {}
            return True
        except Exception:
            return False

