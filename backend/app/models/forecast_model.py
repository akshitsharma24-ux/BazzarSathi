"""
Random Forest demand forecaster for BazaarSaathi.

Trains a RandomForestRegressor to predict units_sold from weather/event/
calendar features. Deliberately simple: no hyperparameter tuning, no deep
learning -- a Random Forest is easy to explain to judges and fast to train.

Also adds a `day_index` (position in the historical series, 0..N-1) as a
feature so the model can pick up on the mild upward trend baked into the
synthetic data, and exposes a small helper (`predict_units_sold`) that the
FastAPI routers / simulation engine call at inference time.

Run directly to train + evaluate + save model.pkl:
    python -m app.models.forecast_model
"""

import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(CURRENT_DIR, "..", "data", "vendor_sales.csv")
MODEL_PATH = os.path.join(CURRENT_DIR, "model.pkl")

FEATURE_COLUMNS = [
    "day_of_week",
    "weekend",
    "temperature",
    "rainfall",
    "rain_probability",
    "local_event",
    "day_index",
]
# Trains on true_demand, not units_sold. On days the vendor under-prepared,
# units_sold is capped by units_prepared (a stockout) rather than reflecting
# what customers actually wanted -- training on that would teach the model
# to repeat the vendor's own past under-preparation instead of forecasting
# real demand, which would defeat the point of this tool.
TARGET_COLUMN = "true_demand"


def load_training_frame(csv_path: str = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df["weekend"] = df["weekend"].astype(int)
    df["local_event"] = df["local_event"].astype(int)
    df["day_index"] = np.arange(len(df))
    return df


def train_model(df: pd.DataFrame):
    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=10,
        min_samples_leaf=2,
        random_state=42,
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)

    return model, {"mae": mae, "rmse": rmse, "r2": r2}


def save_model(model, path: str = MODEL_PATH) -> None:
    joblib.dump({"model": model, "features": FEATURE_COLUMNS}, path)


def load_model(path: str = MODEL_PATH):
    bundle = joblib.load(path)
    return bundle["model"], bundle["features"]


def predict_units_sold(
    model,
    features: list[str],
    day_of_week: int,
    weekend: bool,
    temperature: float,
    rainfall: float,
    rain_probability: float,
    local_event: bool,
    day_index: int,
) -> float:
    """Single-row prediction helper used by routers/simulation engine."""
    row = pd.DataFrame([{
        "day_of_week": day_of_week,
        "weekend": int(weekend),
        "temperature": temperature,
        "rainfall": rainfall,
        "rain_probability": rain_probability,
        "local_event": int(local_event),
        "day_index": day_index,
    }])[features]
    return float(model.predict(row)[0])


if __name__ == "__main__":
    df = load_training_frame()
    model, metrics = train_model(df)
    save_model(model)

    print(f"Trained RandomForestRegressor on {len(df)} rows")
    print(f"  MAE:  {metrics['mae']:.2f} units")
    print(f"  RMSE: {metrics['rmse']:.2f} units")
    print(f"  R2:   {metrics['r2']:.3f}")
    print(f"Model saved -> {MODEL_PATH}")

    print("\nFeature importances:")
    for feat, imp in sorted(
        zip(FEATURE_COLUMNS, model.feature_importances_), key=lambda x: -x[1]
    ):
        print(f"  {feat:<20s} {imp:.3f}")
