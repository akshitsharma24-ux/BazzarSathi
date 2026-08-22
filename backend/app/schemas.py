"""Pydantic request/response models for the BazaarSaathi API."""

from pydantic import BaseModel, Field


class DashboardResponse(BaseModel):
    date: str
    units_prepared: int
    units_sold: int
    units_unsold: int
    revenue: float
    waste_loss: float
    profit: float
    rain_probability: float
    local_event: bool
    weekend: bool


class ForecastResponse(BaseModel):
    predicted_units_sold: float
    day_of_week: int
    weekend: bool
    temperature: float
    rain_probability: float
    local_event: bool


class SimulateRequest(BaseModel):
    rain_probability: float = Field(ge=0.0, le=1.0)
    temperature: float = 30.0
    local_event: bool = False
    risk_mode: str = Field(default="balanced", pattern="^(protect_cash|balanced|maximize_sales)$")


class StockLevelStatsResponse(BaseModel):
    stock_level: int
    expected_profit: float
    expected_waste_units: float
    expected_waste_cost: float
    stockout_probability: float


class SimulateResponse(BaseModel):
    recommended_stock: int
    expected_profit: float
    expected_waste_cost: float
    stockout_probability: float
    demand_distribution: list[float]
    stock_level_stats: list[StockLevelStatsResponse]
    why_breakdown: dict
    savings: dict
    risk_mode: str


class SalesHistoryPoint(BaseModel):
    date: str
    units_sold: int
    units_prepared: int
    profit: float


class SalesHistoryResponse(BaseModel):
    days: int
    points: list[SalesHistoryPoint]


class FeatureImportance(BaseModel):
    feature: str
    importance: float


class ModelInfoResponse(BaseModel):
    mae: float
    rmse: float
    r2: float
    trained_rows: int
    top_features: list[FeatureImportance]


class NeighborhoodVendorSummary(BaseModel):
    name: str
    item: str
    avg_daily_demand: float


class NeighborhoodInsightsResponse(BaseModel):
    vendor_count: int
    days_per_vendor: int
    rain_impact_pct: float
    weekend_impact_pct: float
    event_impact_pct: float
    vendors: list[NeighborhoodVendorSummary]


class MeshMatchRequest(BaseModel):
    direction: str = Field(pattern="^(surplus|shortage|balanced)$")
    quantity: int = Field(ge=0)


class MeshMatchResponse(BaseModel):
    item: str
    our_direction: str
    our_quantity: int
    match_found: bool
    match: dict | None = None
