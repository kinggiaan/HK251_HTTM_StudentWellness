import json
import math
import re
from pathlib import Path

import joblib
import matplotlib

# use non-GUI backend to allow plotting in background threads/environments
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from pandas.api.types import is_numeric_dtype
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_recall_fscore_support,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import FunctionTransformer, OneHotEncoder

DATA_MODEL_BASE_DIR = "./public/dataset_model"
STATES_BASE_DIR = "./public/states"
DATASET_FILENAME = "dataset.csv"
DATASET_CONFIG_FILENAME = "config.json"
STATE_FILENAME = "state.json"

SCHEMA_NAME_MAP = {
    "Gender": "gender",
    "Age": "age",
    "City": "city",
    "Profession": "profession",
    "Academic Pressure": "academic_pressure",
    "Work Pressure": "work_pressure",
    "CGPA": "cgpa",
    "Study Satisfaction": "study_satisfaction",
    "Validated": "validated",
    "Job Satisfaction": "job_satisfaction",
    "Sleep Duration": "sleep_duration",
    "Dietary Habits": "dietary_habits",
    "Degree": "degree",
    "Have you ever had suicidal thoughts ?": "ever_had_suicidal_thoughts",
    "Work/Study Hours": "work_study_hours",
    "Financial Stress": "financial_stress",
    "Family History of Mental Illness": "family_his_of_mental_illness",
    "Depression": "depression_truth",
}

# Mapping specifications for categorical columns
gender_map = {
    "Male": 0,
    "Female": 1,
}

fam_hist_map = {
    "No": 0,
    "Yes": 1,
}

sleep_duration_map = {
    "'Less than 5 hours'": 0,
    "'5-6 hours'": 1,
    "'7-8 hours'": 2,
    "'More than 8 hours'": 3,
    "Others": 4,
}

dietary_habits_map = {
    "Unhealthy": 0,
    "Moderate": 1,
    "Healthy": 2,
    "Others": 1,
}

map_specs = {
    "Gender": gender_map,
    "Family History of Mental Illness": fam_hist_map,
    "Sleep Duration": sleep_duration_map,
    "Dietary Habits": dietary_habits_map,
}


def sanitize_plot_name(*parts):
    raw_name = "_".join(str(part) for part in parts if part is not None and str(part).strip())
    sanitized = re.sub(r"[^A-Za-z0-9_-]+", "_", raw_name)
    return sanitized.strip("_") or "plot"


def schema_field_name(column_name):
    if column_name is None:
        return "unknown"
    key = column_name.strip()
    if key in SCHEMA_NAME_MAP:
        return SCHEMA_NAME_MAP[key]
    normalized = re.sub(r"[^a-z0-9]+", "_", key.lower())
    return normalized.strip("_") or "column"


def ensure_clean_plots_dir(plots_dir: Path) -> Path:
    plots_dir.mkdir(parents=True, exist_ok=True)
    for child in plots_dir.iterdir():
        if child.is_file():
            child.unlink()
    return plots_dir


def save_plot(fig, plots_dir: Path, *name_parts):
    filename = f"{sanitize_plot_name(*name_parts)}.png"
    fig_path = plots_dir / filename
    fig.savefig(fig_path, bbox_inches="tight")
    plt.close(fig)
    print(f"Saved plot: {fig_path}")


def serialize_value(value):
    if isinstance(value, (pd.Series, pd.Index)):
        return {str(k): serialize_value(v) for k, v in value.to_dict().items()}
    if isinstance(value, pd.DataFrame):
        return serialize_value(value.to_dict())
    if isinstance(value, dict):
        return {str(k): serialize_value(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [serialize_value(v) for v in value]
    if isinstance(value, np.ndarray):
        return serialize_value(value.tolist())
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, float) and math.isnan(value):
        return None
    return value


def set_dataset_result(results, key, value):
    results[key] = serialize_value(value)


def append_dataset_result(results, key, value):
    results.setdefault(key, []).append(serialize_value(value))


def set_model_result(results, key, value):
    results[key] = serialize_value(value)


def append_model_result(results, key, value):
    results.setdefault(key, []).append(serialize_value(value))


def load_dataset_and_config(preset_name: str, base_dir: str):
    preset_dir = Path(base_dir) / preset_name
    csv_path = preset_dir / DATASET_FILENAME
    df = pd.read_csv(csv_path)
    print(f"Loaded dataset from {csv_path}")

    config_path = preset_dir / DATASET_CONFIG_FILENAME
    config = {}
    try:
        config = json.load(open(config_path))
        print(f"Loaded config from {config_path}")
    except Exception as e:
        error_str = str(e)
        print(f"Error loading config: {error_str}")
        config = {}
    return df, config, preset_dir


def analyze_null_values(df, dataset_results):
    null_counts = df.isnull().sum()
    null_percent = df.isnull().mean() * 100
    print("NULL counts per column:")
    print(null_counts)
    print("\nNULL percentage (%):")
    print(null_percent)
    set_dataset_result(dataset_results, "null_counts", null_counts)
    set_dataset_result(dataset_results, "null_percent", null_percent)
    
    df = df.dropna(subset=[])
    df = df[df['CGPA'] != 0]
    df = df[df['Sleep Duration'] != 'Others']
    df = df[df['Dietary Habits'] != 'Others']
    df.isnull().sum()
    #
    df = df[pd.to_numeric(df["Financial Stress"], errors="coerce").notna()]
    df["Financial Stress"] = df["Financial Stress"].astype("float64")

    return df


def split_train_val_test(X, y, test_size=0.2, random_state=42):
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=None
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=test_size, random_state=random_state, stratify=None
    )
    return X_train, X_val, X_test, y_train, y_val, y_test


def analyze_columns(train_df, target_cols, plots_dir, dataset_results):
    for col in train_df.columns:
        col_data = train_df[col]
        print(f"--- {col} ---")
        print(f"dtype: {col_data.dtype}; nulls: {col_data.isnull().sum()}; unique: {col_data.nunique()}")
        if col in target_cols:
            print(col_data.value_counts(normalize=True))
        fig, ax = plt.subplots(figsize=(6, 3))
        col_info = {
            "column": schema_field_name(col),
            "original_name": col,
            "dtype": str(col_data.dtype),
            "nulls": int(col_data.isnull().sum()),
            "unique": int(col_data.nunique()),
        }
        if is_numeric_dtype(col_data):
            col_data.hist(ax=ax, bins=20, edgecolor="black")
            ax.set_title(f"Histogram of {col}")
            ax.set_xlabel(col)
            ax.set_ylabel("Count")
            print(col_data.describe())
            col_info["type"] = "numeric"
            col_info["describe"] = serialize_value(col_data.describe().to_dict())
        else:
            top = col_data.value_counts().head(10)
            top.plot(kind="bar", ax=ax, color="#4C72B0", edgecolor="black")
            ax.set_title(f"Top categories of {col}")
            ax.set_xlabel(col)
            ax.set_ylabel("Count")
            ax.tick_params(axis="x", rotation=45, labelsize=8)
            print(top)
            col_info["type"] = "categorical"
            col_info["top_categories"] = serialize_value(top.to_dict())
        plt.tight_layout()
        save_plot(fig, plots_dir, "column_analysis", schema_field_name(col))
        append_dataset_result(dataset_results, "column_analysis", col_info)
        print()


def apply_preprocessing_maps(df_in):
    """Apply categorical mappings and cast all numeric columns to float64."""
    df_out = df_in.copy()
    for col, mapping in map_specs.items():
        if col in df_out.columns:
            df_out[col] = df_out[col].map(mapping)
    # Cast all numeric columns to float64
    df_out = df_out.astype(
        {col: "float64" for col in df_out.select_dtypes(include=["int", "float"]).columns}
    )
    return df_out


def analyze_features(X_train, y_train, target_cols, plots_dir, dataset_results):
    # Use a copy to mirror the reference visualization script
    X_train_visual = X_train.copy()

    for feature_to_inspect in X_train_visual.columns.tolist():
        for target in target_cols:
            # Use boxplots for selected numeric features, grouped bars for categoricals
            if feature_to_inspect in ["Age", "CGPA", "Work/Study Hours"]:
                labels = sorted(y_train[target].unique())
                data = [
                    X_train_visual.loc[y_train[target] == lbl, feature_to_inspect]
                    for lbl in labels
                ]
                fig, ax = plt.subplots(figsize=(6, 4))
                ax.boxplot(data, labels=labels)
                ax.set_title(f"{feature_to_inspect} by {target}")
                ax.set_xlabel(target)
                ax.set_ylabel(feature_to_inspect)

                box_entry = {
                    "feature": schema_field_name(feature_to_inspect),
                    "target": schema_field_name(target),
                    "type": "boxplot",
                    "labels": [str(lbl) for lbl in labels],
                    "group_counts": [
                        {"label": str(lbl), "count": int(len(group))}
                        for lbl, group in zip(labels, data)
                    ],
                }
                append_dataset_result(dataset_results, "feature_boxplots", box_entry)
                plt.tight_layout()
                save_plot(
                    fig,
                    plots_dir,
                    "feature_box",
                    schema_field_name(feature_to_inspect),
                    schema_field_name(target),
                )
            else:
                ct_counts = pd.crosstab(
                    X_train_visual[feature_to_inspect],
                    y_train[target],
                )
                class_labels = sorted(y_train[target].unique())
                ct_counts = ct_counts.reindex(columns=class_labels).fillna(0)

                x = np.arange(len(ct_counts.index))
                width = 0.35

                fig, ax = plt.subplots(figsize=(8, 4))

                bars = []
                for i, cls in enumerate(class_labels):
                    offset = (i - (len(class_labels) - 1) / 2) * width
                    b = ax.bar(
                        x + offset,
                        ct_counts[cls].values,
                        width,
                        label=str(cls),
                    )
                    bars.append(b)

                ax.set_title(f"{feature_to_inspect} vs {target} (counts)")
                ax.set_xlabel(feature_to_inspect)
                ax.set_ylabel("Count")
                ax.set_xticks(x)
                ax.set_xticklabels(ct_counts.index, rotation=45, ha="right")
                ax.legend(title=target)

                for b in bars:
                    for rect in b:
                        height = rect.get_height()
                        ax.text(
                            rect.get_x() + rect.get_width() / 2,
                            height,
                            f"{int(height)}",
                            ha="center",
                            va="bottom",
                            fontsize=8,
                        )

                counts_entry = {
                    "feature": schema_field_name(feature_to_inspect),
                    "target": schema_field_name(target),
                    "type": "count_bar",
                    "counts": serialize_value(ct_counts.to_dict()),
                }
                append_dataset_result(dataset_results, "feature_proportions", counts_entry)
                plt.tight_layout()
                save_plot(
                    fig,
                    plots_dir,
                    "feature_counts",
                    schema_field_name(feature_to_inspect),
                    schema_field_name(target),
                )


def create_preprocessor(X_train):
    categorical_cols = X_train.select_dtypes(include=["object"]).columns
    numeric_cols = X_train.select_dtypes(exclude=["object"]).columns
    return ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_cols),
            ("num", "passthrough", numeric_cols),
        ]
    )


def train_models(X_train, y_train, X_val, y_val, target_cols, preprocessor, config: dict):
    """Train RandomForest models with preprocessing pipeline.
    
    Config parameters:
    - n_estimators: Number of trees (default: 500)
    - max_depth: Maximum depth of trees (default: None)
    - class_weight: Class weight strategy (default: "balanced")
    """
    # Get model parameters from config with defaults
    n_estimators = config.get("n_estimators", 500)
    max_depth = config.get("max_depth", None)  # None/null means no limit
    class_weight = config.get("class_weight", "balanced")
    
    params = {
        "n_estimators": n_estimators,
        "max_depth": max_depth,
        "class_weight": class_weight,
    }
    print(f"Training with params: {params}")
    
    # Create a FunctionTransformer for applying maps
    pre_map = FunctionTransformer(apply_preprocessing_maps, feature_names_out="one-to-one")
    
    models = {}
    for target in target_cols:
        clf = RandomForestClassifier(**params, random_state=42, n_jobs=-1)
        model = Pipeline(
            steps=[
                ("map", pre_map),
                ("preprocess", preprocessor),
                ("rf", clf),
            ]
        )
        model.fit(X_train, y_train[target])
        pred_val = model.predict(X_val)
        _ = precision_recall_fscore_support(
            y_val[target], pred_val, average="macro", zero_division=0
        )
        models[target] = model
    return models


def evaluate_models(models, X_test, y_test, target_cols, plots_dir, model_results, preset_name: str):
    for target, model in models.items():
        pred_test = model.predict(X_test)
        acc = accuracy_score(y_test[target], pred_test)
        prec, rec, f1, _ = precision_recall_fscore_support(
            y_test[target], pred_test, average="macro", zero_division=0
        )
        metric_key = schema_field_name(target)
        model_results["test_metrics"][metric_key] = serialize_value(
            {"acc": acc, "precision": prec, "recall": rec, "f1": f1}
        )
        if metric_key == "depression_truth":
            update_state(preset_name, "performance_evaluating", {"accuracy": acc})

        cm = confusion_matrix(y_test[target], pred_test)
        model_results["confusion_matrices"][metric_key] = serialize_value(cm.tolist())
        print(f"TEST {target}: Acc={acc:.4f}, Prec={prec:.4f}, Rec={rec:.4f}, F1={f1:.4f}")
        print("Confusion matrix:")
        print(cm)
        fig, ax = plt.subplots(figsize=(4, 3))
        im = ax.imshow(cm, cmap="Blues")
        ax.set_title(f"Confusion Matrix - {target}")
        ax.set_xlabel("Predicted")
        ax.set_ylabel("True")
        ax.set_xticks(range(cm.shape[1]))
        ax.set_yticks(range(cm.shape[0]))
        for (i, j), val in np.ndenumerate(cm):
            ax.text(j, i, int(val), ha="center", va="center", color="black")
        fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
        plt.tight_layout()
        save_plot(fig, plots_dir, "confusion_matrix", schema_field_name(target))
        print()


def calculate_baseline(y_train, y_test, target_cols, model_results):
    print("Baseline (mode) Acc/F1:")
    for target in target_cols:
        mode_val = y_train[target].mode().iloc[0]
        baseline_pred = np.full(len(y_test), mode_val)
        acc = accuracy_score(y_test[target], baseline_pred)
        f1 = f1_score(y_test[target], baseline_pred, average="macro", zero_division=0)
        baseline_key = schema_field_name(target)
        model_results["baseline"][baseline_key] = serialize_value({"acc": acc, "f1": f1})
        print(f"{target}: Acc={acc:.4f}, F1={f1:.4f}")


def calculate_permutation_importance(models, X_val, y_val, target_cols, model_results, top_k=15):
    feat_names = None
    for target, model in models.items():
        r = permutation_importance(
            model, X_val, y_val[target], n_repeats=20, random_state=42, n_jobs=-1
        )
        if feat_names is None:
            try:
                feat_names = model.named_steps["preprocess"].get_feature_names_out()
            except Exception:
                feat_names = [f"feat_{i}" for i in range(len(r.importances_mean))]
        pairs = sorted(zip(feat_names, r.importances_mean), key=lambda x: x[1], reverse=True)
        importance_entry = {
            "target": schema_field_name(target),
            "top_k": [
                {"name": name, "importance": float(val)}
                for name, val in pairs[:top_k]
            ],
        }
        append_model_result(model_results, "permutation_importance", importance_entry)
        print(f"== Permutation importance on val for {target} ==")
        for name, val in pairs[:top_k]:
            print(f"{name}: {val:.6f}")
        print()


def save_trained_model(models, model_path: Path, model_results):
    """Save trained models using joblib for better efficiency."""
    model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(models, model_path)
    set_model_result(model_results, "model_path", str(model_path))
    print(f"Model saved to {model_path}")


def save_json(data, path: Path, message: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(message)


def update_state(
    preset_name: str,
    state: str,
    extra: dict | None = None,
    base_dir: str = STATES_BASE_DIR,
    clear: bool = False,
):
    """Update the pipeline state file and close it immediately."""
    state_dir = Path(base_dir) / preset_name
    state_path = state_dir / STATE_FILENAME
    state_dir.mkdir(parents=True, exist_ok=True)

    state_data: dict = {}
    if not clear and state_path.exists():
        try:
            state_data = json.load(open(state_path))
        except Exception:
            state_data = {}

    state_data["state"] = state
    if extra:
        state_data.update(serialize_value(extra))

    with open(state_path, "w") as f:
        json.dump(state_data, f, indent=2)


def run_dataset_analysis(preset_name: str, base_dir: str = DATA_MODEL_BASE_DIR):
    update_state(preset_name, "dataset_analysing")
    dataset_results = {
        "dataset_path": None,
        "config": None,
        "null_counts": None,
        "null_percent": None,
        "splits": None,
        "column_analysis": [],
        "feature_boxplots": [],
        "feature_proportions": [],
    }
    df, config, preset_dir = load_dataset_and_config(preset_name, base_dir)
    set_dataset_result(dataset_results, "dataset_path", str(preset_dir / DATASET_FILENAME))
    set_dataset_result(
        dataset_results,
        "config",
        {
            "status": "loaded" if config else "default",
            "data": config,
        },
    )

    plots_dir = ensure_clean_plots_dir(preset_dir / "plots")

    df = analyze_null_values(df, dataset_results)

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
    config_features = config.get("features", [])
    if isinstance(config_features, list) and len(config_features) > 0:
        feat_cols = [c for c in config_features if c in df.columns]
        missing = [c for c in config_features if c not in df.columns]
        if missing:
            print(f"Warning: missing features ignored: {missing}")
        if len(feat_cols) == 0:
            feat_cols = default_feat_cols
            print("Warning: no valid features from config; using defaults.")
    else:
        feat_cols = default_feat_cols

    target_cols = ["Depression"]
    X = df[feat_cols]
    y = df[target_cols]

    test_size = config.get("test_size", 0.2)
    try:
        test_size_val = float(test_size)
    except Exception:
        test_size_val = 0.2
        print("Warning: invalid test_size in config; using default 0.2")

    X_train, X_val, X_test, y_train, y_val, y_test = split_train_val_test(
        X, y, test_size=test_size_val, random_state=42
    )
    print("Train/Val/Test sizes:", len(X_train), len(X_val), len(X_test))
    set_dataset_result(
        dataset_results,
        "splits",
        {"train": len(X_train), "validation": len(X_val), "test": len(X_test)},
    )

    train_df = pd.concat([X_train, y_train], axis=1)
    analyze_columns(train_df, target_cols, plots_dir, dataset_results)

    analyze_features(X_train, y_train, target_cols, plots_dir, dataset_results)

    dataset_analysis_path = preset_dir / "dataset_analysis.json"
    save_json(dataset_results, dataset_analysis_path, f"Dataset analysis saved to {dataset_analysis_path}")

    # Return raw (unmapped) data - the pipeline will handle preprocessing
    return (
        df,
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test,
        target_cols,
        preset_dir,
        plots_dir,
        config,
    )


def run_model_training(
    preset_name: str,
    X_train,
    X_val,
    X_test,
    y_train,
    y_val,
    y_test,
    target_cols,
    preset_dir: Path,
    plots_dir: Path,
    config: dict,
    base_dir: str = DATA_MODEL_BASE_DIR,
):
    update_state(preset_name, "training")
    model_results = {
        "test_metrics": {},
        "confusion_matrices": {},
        "baseline": {},
        "permutation_importance": [],
        "model_path": None,
    }

    preprocessor = create_preprocessor(X_train)
    models = train_models(X_train, y_train, X_val, y_val, target_cols, preprocessor, config)

    update_state(preset_name, "performance_evaluating")
    evaluate_models(models, X_test, y_test, target_cols, plots_dir, model_results, preset_name)
    calculate_baseline(y_train, y_test, target_cols, model_results)
    calculate_permutation_importance(models, X_val, y_val, target_cols, model_results, top_k=15)
    update_state(preset_name, "done")

    model_path = preset_dir / "model.pkl"
    save_trained_model(models, model_path, model_results)

    # debug the X_test dtypes
    print("X_test dtypes", X_test.dtypes)

    performance_path = preset_dir / "model_performance.json"
    save_json(
        model_results,
        performance_path,
        f"Model performance saved to {performance_path}",
    )
    return models


def run_pipeline(preset_name: str, base_dir: str = DATA_MODEL_BASE_DIR):
    update_state(preset_name, "starting", clear=True)
    (
        _df,
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test,
        target_cols,
        preset_dir,
        plots_dir,
        config,
    ) = run_dataset_analysis(preset_name, base_dir)
    run_model_training(
        preset_name,
        X_train,
        X_val,
        X_test,
        y_train,
        y_val,
        y_test,
        target_cols,
        preset_dir,
        plots_dir,
        config,
        base_dir,
    )


__all__ = ["run_pipeline"]

