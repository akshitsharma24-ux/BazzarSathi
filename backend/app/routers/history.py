"""GET /sales-history -- last N days of actual sales/profit from the
synthetic dataset, for a Dashboard trend chart. Uses units_sold (not
true_demand) since this is "what actually happened," the same real-actuals
framing as /dashboard's "today" snapshot -- see forecast_model.py's
TARGET_COLUMN note for why the forecaster itself trains on true_demand
instead."""

from fastapi import APIRouter, Query

from app.models.forecast_model import load_training_frame
from app.schemas import SalesHistoryPoint, SalesHistoryResponse

router = APIRouter()


@router.get("/sales-history", response_model=SalesHistoryResponse)
def get_sales_history(days: int = Query(default=14, ge=1, le=90)) -> SalesHistoryResponse:
    df = load_training_frame()
    recent = df.tail(days)

    points = [
        SalesHistoryPoint(
            date=str(row["date"]),
            units_sold=int(row["units_sold"]),
            units_prepared=int(row["units_prepared"]),
            profit=round(
                row["units_sold"] * row["price_per_unit"] - row["units_prepared"] * row["cost_per_unit"], 2
            ),
        )
        for _, row in recent.iterrows()
    ]

    return SalesHistoryResponse(days=len(points), points=points)
