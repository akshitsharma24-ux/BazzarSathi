"""GET /forecast -- raw single-point ML prediction for tomorrow, given
weather/event conditions. This is the plain forecast, without Monte Carlo
simulation (see /simulate for the full Survival Stock engine)."""

from fastapi import APIRouter, Query

from app.models.forecast_model import load_model, load_training_frame, predict_units_sold
from app.schemas import ForecastResponse

router = APIRouter()


@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    rain_probability: float = Query(ge=0.0, le=1.0),
    temperature: float = Query(default=30.0),
    local_event: bool = Query(default=False),
) -> ForecastResponse:
    model, features = load_model()
    df = load_training_frame()

    last_row = df.iloc[-1]
    tomorrow_day_of_week = (int(last_row["day_of_week"]) + 1) % 7
    tomorrow_weekend = tomorrow_day_of_week >= 5
    tomorrow_day_index = len(df)

    predicted = predict_units_sold(
        model,
        features,
        day_of_week=tomorrow_day_of_week,
        weekend=tomorrow_weekend,
        temperature=temperature,
        rainfall=max(0.0, rain_probability * 8.0),
        rain_probability=rain_probability,
        local_event=local_event,
        day_index=tomorrow_day_index,
    )

    return ForecastResponse(
        predicted_units_sold=round(predicted, 1),
        day_of_week=tomorrow_day_of_week,
        weekend=tomorrow_weekend,
        temperature=temperature,
        rain_probability=rain_probability,
        local_event=local_event,
    )
