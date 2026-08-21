"""GET /dashboard -- today's vendor stats, derived from the last row of the
synthetic sales history (i.e. "today" = the most recent day in the dataset)."""

from fastapi import APIRouter

from app.models.forecast_model import load_training_frame
from app.schemas import DashboardResponse

router = APIRouter()


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard() -> DashboardResponse:
    df = load_training_frame()
    today = df.iloc[-1]

    units_prepared = int(today["units_prepared"])
    units_sold = int(today["units_sold"])
    units_unsold = max(0, units_prepared - units_sold)

    price = float(today["price_per_unit"])
    cost = float(today["cost_per_unit"])

    revenue = units_sold * price
    waste_loss = units_unsold * cost
    profit = revenue - units_prepared * cost

    return DashboardResponse(
        date=str(today["date"]),
        units_prepared=units_prepared,
        units_sold=units_sold,
        units_unsold=units_unsold,
        revenue=round(revenue, 2),
        waste_loss=round(waste_loss, 2),
        profit=round(profit, 2),
        rain_probability=float(today["rain_probability"]),
        local_event=bool(today["local_event"]),
        weekend=bool(today["weekend"]),
    )
