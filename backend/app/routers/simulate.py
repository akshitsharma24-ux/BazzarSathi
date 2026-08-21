"""POST /simulate -- full BazaarTwin engine: Monte Carlo demand simulation +
Survival Stock recommendation + why-breakdown + savings comparison."""

from fastapi import APIRouter

from app.models.forecast_model import load_model, load_training_frame
from app.schemas import SimulateRequest, SimulateResponse, StockLevelStatsResponse
from app.simulation.monte_carlo import TomorrowConditions
from app.simulation.survival_stock import run_full_simulation

router = APIRouter()


@router.post("/simulate", response_model=SimulateResponse)
def post_simulate(payload: SimulateRequest) -> SimulateResponse:
    model, features = load_model()
    df = load_training_frame()

    last_row = df.iloc[-1]
    tomorrow_day_of_week = (int(last_row["day_of_week"]) + 1) % 7
    tomorrow_weekend = tomorrow_day_of_week >= 5
    tomorrow_day_index = len(df)

    conditions = TomorrowConditions(
        day_of_week=tomorrow_day_of_week,
        weekend=tomorrow_weekend,
        temperature=payload.temperature,
        rain_probability=payload.rain_probability,
        local_event=payload.local_event,
        day_index=tomorrow_day_index,
    )

    price_per_unit = float(last_row["price_per_unit"])
    cost_per_unit = float(last_row["cost_per_unit"])

    result = run_full_simulation(
        model=model,
        features=features,
        conditions=conditions,
        risk_mode=payload.risk_mode,
        price_per_unit=price_per_unit,
        cost_per_unit=cost_per_unit,
        seed=42,
    )

    return SimulateResponse(
        recommended_stock=result.recommended_stock,
        expected_profit=round(result.recommended_stats.expected_profit, 2),
        expected_waste_cost=round(result.recommended_stats.expected_waste_cost, 2),
        stockout_probability=round(result.recommended_stats.stockout_probability, 3),
        demand_distribution=result.demand_distribution,
        stock_level_stats=[
            StockLevelStatsResponse(
                stock_level=s.stock_level,
                expected_profit=round(s.expected_profit, 2),
                expected_waste_units=round(s.expected_waste_units, 2),
                expected_waste_cost=round(s.expected_waste_cost, 2),
                stockout_probability=round(s.stockout_probability, 3),
            )
            for s in result.stock_level_stats
        ],
        why_breakdown=result.why_breakdown,
        savings=result.savings,
        risk_mode=payload.risk_mode,
    )
