"""
Survival Stock optimizer.

Sweeps candidate stock levels against the simulated demand distribution from
monte_carlo.py, scores each level on expected profit / expected waste cost /
stockout probability, then recommends one level per risk personality:

  protect_cash   -> minimize expected waste cost (tolerates higher stockout risk)
  balanced       -> maximize expected profit
  maximize_sales -> minimize stockout probability (tolerates higher waste risk)

Also produces:
  - a "why" driver breakdown (rain / weekend / event / trend impact on the
    point forecast), and
  - a savings comparison between naive stocking (rounded raw ML forecast) and
    the recommended Survival Stock level.
"""

from dataclasses import dataclass, field

import numpy as np
import pandas as pd

from app.simulation.monte_carlo import TomorrowConditions, simulate_demand_distribution

STOCK_LEVELS = list(range(60, 131, 5))

RISK_MODES = ("protect_cash", "balanced", "maximize_sales")


@dataclass
class StockLevelStats:
    stock_level: int
    expected_profit: float
    expected_waste_units: float
    expected_waste_cost: float
    stockout_probability: float


@dataclass
class SimulationResult:
    demand_distribution: list[float]
    stock_level_stats: list[StockLevelStats]
    recommended_stock: int
    recommended_stats: StockLevelStats
    naive_stock: int
    why_breakdown: dict = field(default_factory=dict)
    savings: dict = field(default_factory=dict)


def _evaluate_stock_level(
    stock_level: int,
    demand_draws: np.ndarray,
    price_per_unit: float,
    cost_per_unit: float,
) -> StockLevelStats:
    units_sold = np.minimum(stock_level, demand_draws)
    revenue = units_sold * price_per_unit
    total_cost = stock_level * cost_per_unit
    profit = revenue - total_cost

    waste_units = np.maximum(0.0, stock_level - demand_draws)
    waste_cost = waste_units * cost_per_unit

    stockout = demand_draws > stock_level

    return StockLevelStats(
        stock_level=stock_level,
        expected_profit=float(np.mean(profit)),
        expected_waste_units=float(np.mean(waste_units)),
        expected_waste_cost=float(np.mean(waste_cost)),
        stockout_probability=float(np.mean(stockout)),
    )


# Risk modes are implemented as target percentiles of the simulated demand
# distribution (the "critical fractile" / newsvendor approach), rather than
# a raw min/max over expected waste cost or stockout probability. Expected
# waste cost is monotonically non-decreasing in stock level, so a naive
# "minimize waste cost" always collapses to the floor of the swept range
# regardless of conditions -- it would never visibly react to weather/event
# changes in a demo. Tying every mode to a percentile of the *same* 500
# simulated draws keeps all three modes responsive to conditions.
PROTECT_CASH_PERCENTILE = 25
MAXIMIZE_SALES_PERCENTILE = 88


def _nearest_stock_level(target: float, stats_list: list[StockLevelStats]) -> StockLevelStats:
    return min(stats_list, key=lambda s: abs(s.stock_level - target))


def _pick_recommendation(
    stats_list: list[StockLevelStats], demand_draws: np.ndarray, risk_mode: str
) -> StockLevelStats:
    if risk_mode == "protect_cash":
        target = np.percentile(demand_draws, PROTECT_CASH_PERCENTILE)
        return _nearest_stock_level(target, stats_list)
    if risk_mode == "maximize_sales":
        target = np.percentile(demand_draws, MAXIMIZE_SALES_PERCENTILE)
        return _nearest_stock_level(target, stats_list)
    # balanced (default): maximize expected profit -- for iid demand this
    # naturally lands near the critical-fractile percentile Cu/(Cu+Co).
    return max(stats_list, key=lambda s: s.expected_profit)


def _why_breakdown(
    model, features: list[str], conditions: TomorrowConditions
) -> dict:
    """Compares scenario-on vs scenario-off point predictions to attribute
    the forecast to its main drivers, expressed as % delta vs the off-state."""

    def predict(**overrides) -> float:
        row = {
            "day_of_week": conditions.day_of_week,
            "weekend": int(conditions.weekend),
            "temperature": conditions.temperature,
            "rainfall": max(0.0, conditions.rain_probability * 8.0),
            "rain_probability": conditions.rain_probability,
            "local_event": int(conditions.local_event),
            "day_index": conditions.day_index,
        }
        row.update(overrides)
        df = pd.DataFrame([row])[features]
        return float(model.predict(df)[0])

    def pct_delta(on: float, off: float) -> float:
        if off == 0:
            return 0.0
        return round((on - off) / off * 100, 1)

    rain_on = predict(rain_probability=max(conditions.rain_probability, 0.6), rainfall=6.0)
    rain_off = predict(rain_probability=0.0, rainfall=0.0)

    weekend_on = predict(weekend=1)
    weekend_off = predict(weekend=0)

    event_on = predict(local_event=1)
    event_off = predict(local_event=0)

    trend_recent = predict(day_index=conditions.day_index)
    trend_month_ago = predict(day_index=max(0, conditions.day_index - 30))

    return {
        "rain_impact_pct": pct_delta(rain_on, rain_off),
        "weekend_impact_pct": pct_delta(weekend_on, weekend_off),
        "event_impact_pct": pct_delta(event_on, event_off),
        "trend_impact_pct": pct_delta(trend_recent, trend_month_ago),
    }


def _savings_comparison(
    raw_forecast: float,
    stats_by_level: dict[int, StockLevelStats],
    recommended: StockLevelStats,
    price_per_unit: float,
    cost_per_unit: float,
) -> dict:
    naive_stock = int(round(raw_forecast))
    naive_stock = min(max(naive_stock, STOCK_LEVELS[0]), STOCK_LEVELS[-1])
    # Snap to nearest evaluated stock level for a fair apples-to-apples read.
    nearest_level = min(stats_by_level.keys(), key=lambda lv: abs(lv - naive_stock))
    naive_stats = stats_by_level[nearest_level]

    waste_cost_avoided = naive_stats.expected_waste_cost - recommended.expected_waste_cost
    profit_gain = recommended.expected_profit - naive_stats.expected_profit

    return {
        "naive_stock": naive_stock,
        "naive_expected_profit": round(naive_stats.expected_profit, 2),
        "naive_expected_waste_cost": round(naive_stats.expected_waste_cost, 2),
        "naive_stockout_probability": round(naive_stats.stockout_probability, 3),
        "recommended_stock": recommended.stock_level,
        "recommended_expected_profit": round(recommended.expected_profit, 2),
        "recommended_expected_waste_cost": round(recommended.expected_waste_cost, 2),
        "daily_waste_cost_avoided": round(waste_cost_avoided, 2),
        "daily_profit_gain": round(profit_gain, 2),
        "projected_monthly_savings": round(max(waste_cost_avoided, 0) * 30, 2)
            if waste_cost_avoided > 0 else round(profit_gain * 30, 2),
    }


def run_full_simulation(
    model,
    features: list[str],
    conditions: TomorrowConditions,
    risk_mode: str,
    price_per_unit: float,
    cost_per_unit: float,
    seed: int | None = None,
) -> SimulationResult:
    if risk_mode not in RISK_MODES:
        raise ValueError(f"risk_mode must be one of {RISK_MODES}, got {risk_mode!r}")

    demand_draws = simulate_demand_distribution(model, features, conditions, seed=seed)

    stats_list = [
        _evaluate_stock_level(level, demand_draws, price_per_unit, cost_per_unit)
        for level in STOCK_LEVELS
    ]
    stats_by_level = {s.stock_level: s for s in stats_list}

    recommended = _pick_recommendation(stats_list, demand_draws, risk_mode)

    row = pd.DataFrame([{
        "day_of_week": conditions.day_of_week,
        "weekend": int(conditions.weekend),
        "temperature": conditions.temperature,
        "rainfall": max(0.0, conditions.rain_probability * 8.0),
        "rain_probability": conditions.rain_probability,
        "local_event": int(conditions.local_event),
        "day_index": conditions.day_index,
    }])[features]
    raw_forecast = float(model.predict(row)[0])

    why = _why_breakdown(model, features, conditions)
    savings = _savings_comparison(
        raw_forecast, stats_by_level, recommended, price_per_unit, cost_per_unit
    )

    return SimulationResult(
        demand_distribution=[round(float(d), 1) for d in demand_draws],
        stock_level_stats=stats_list,
        recommended_stock=recommended.stock_level,
        recommended_stats=recommended,
        naive_stock=savings["naive_stock"],
        why_breakdown=why,
        savings=savings,
    )
