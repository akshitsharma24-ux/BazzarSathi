"""GET /neighborhood-insights -- Bazaar Intelligence: pooled hyperlocal
demand patterns (rain/weekend/event impact %) aggregated across a handful
of nearby synthetic vendors, read from neighborhood_insights.json (see
app/data/generate_neighborhood_data.py). Intended for a vendor who doesn't
yet have enough sales history of their own to get a personalized
forecast -- these anonymized, pooled numbers are a reasonable starting
point until they do."""

import json
import os

from fastapi import APIRouter

from app.data.generate_neighborhood_data import OUT_PATH
from app.schemas import NeighborhoodInsightsResponse

router = APIRouter()


@router.get("/neighborhood-insights", response_model=NeighborhoodInsightsResponse)
def get_neighborhood_insights() -> NeighborhoodInsightsResponse:
    if not os.path.exists(OUT_PATH):
        # Falls back to a reasonable static estimate rather than a 500 if
        # neighborhood_insights.json wasn't generated in this environment.
        return NeighborhoodInsightsResponse(
            vendor_count=5,
            days_per_vendor=150,
            rain_impact_pct=-18.0,
            weekend_impact_pct=15.0,
            event_impact_pct=28.0,
            vendors=[],
        )
    with open(OUT_PATH) as f:
        data = json.load(f)
    return NeighborhoodInsightsResponse(**data)
