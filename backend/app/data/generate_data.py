"""
Generates synthetic vendor sales history for BazaarSaathi.

Simulates 120 days of daily sales for a single street food vendor (e.g. a
vada-pav / chaat stall), baking in realistic demand drivers:
  - Rain suppresses footfall/demand.
  - Weekends and local events boost demand.
  - A mild upward trend over time (growing reputation / footfall).
  - Random day-to-day noise.

The vendor's "units_prepared" reflects a semi-informed (but imperfect) human
guess, so unsold/stockout patterns emerge naturally as training signal for the
forecast model downstream.

Output: backend/app/data/vendor_sales.csv
"""

import numpy as np
import pandas as pd
from datetime import date, timedelta

RANDOM_SEED = 42
NUM_DAYS = 150
START_DATE = date(2026, 3, 25)  # 150 days ending 2026-08-21 (day before "today")

PRICE_PER_UNIT = 25.0   # rupees
COST_PER_UNIT = 12.0    # rupees

BASE_DEMAND = 80.0


def generate_dataset(
    num_days: int = NUM_DAYS,
    seed: int = RANDOM_SEED,
    base_demand: float = BASE_DEMAND,
    rain_coef: float = 1.8,
    rain_prob_coef: float = 10.0,
    weekend_boost: float = 18.0,
    event_boost: float = 35.0,
    price_per_unit: float = PRICE_PER_UNIT,
    cost_per_unit: float = COST_PER_UNIT,
) -> pd.DataFrame:
    """Generates one vendor's synthetic sales history.

    The keyword params all default to this file's original hardcoded
    constants/behavior (a no-arg call reproduces the committed
    vendor_sales.csv exactly). They exist so
    generate_neighborhood_data.py can reuse this same generative process
    for a handful of *different* nearby vendors (Bazaar Intelligence) --
    each with its own demand baseline and rain/weekend/event
    sensitivity -- without duplicating the demand model.
    """
    rng = np.random.default_rng(seed)

    rows = []
    for i in range(num_days):
        current_date = START_DATE + timedelta(days=i)
        day_of_week = current_date.weekday()  # 0=Mon ... 6=Sun
        is_weekend = day_of_week >= 5

        # Weather: rain probability varies seasonally-ish with random noise,
        # temperature drifts a bit with mild seasonal wave.
        rain_probability = float(np.clip(rng.beta(2, 5), 0, 1))
        rainfall = float(max(0.0, rng.gamma(2, 4) * rain_probability))
        temperature = float(28 + 6 * np.sin(i / 15) + rng.normal(0, 2))

        local_event = bool(rng.random() < 0.15)  # ~15% of days have a local event

        # --- demand model (ground truth generative process) ---
        trend = 0.05 * i  # mild upward trend (growing footfall over 120 days)

        demand = base_demand + trend

        # Rain suppresses demand, proportional to how heavy the rain is.
        demand -= rainfall * rain_coef
        demand -= rain_probability * rain_prob_coef

        # Weekend boost.
        if is_weekend:
            demand += weekend_boost

        # Local event boost (big spike - fairs, festivals, cricket matches nearby).
        if local_event:
            demand += event_boost

        # Temperature: mild effect, very hot or very cool days reduce street food demand a bit.
        demand -= 0.3 * abs(temperature - 30)

        # Random daily noise.
        demand += rng.normal(0, 8)

        units_sold_true_demand = max(0.0, demand)

        # Vendor's preparation decision: an imperfect human heuristic
        # (roughly yesterday's demand expectation plus a little of their own
        # noise) -- this is what creates realistic over/under-prep patterns.
        prep_guess = base_demand + trend
        if is_weekend:
            prep_guess += weekend_boost * (12.0 / 18.0)
        if local_event:
            prep_guess += event_boost * (10.0 / 35.0)  # vendors often underestimate event impact
        prep_guess += rng.normal(0, 6)
        units_prepared = int(round(max(20, prep_guess)))

        # Actual units sold cannot exceed what was prepared (stockout caps sales).
        units_sold = int(round(min(units_prepared, units_sold_true_demand)))
        units_sold = max(0, units_sold)

        rows.append({
            "date": current_date.isoformat(),
            "day_of_week": day_of_week,
            "weekend": is_weekend,
            "temperature": round(temperature, 1),
            "rainfall": round(rainfall, 2),
            "rain_probability": round(rain_probability, 2),
            "local_event": local_event,
            "units_prepared": units_prepared,
            "units_sold": units_sold,
            # Ground-truth demand, uncapped by units_prepared. units_sold is
            # censored on days the vendor under-prepared (sold out) -- see
            # forecast_model.py, which trains on true_demand rather than
            # units_sold for exactly this reason.
            "true_demand": round(units_sold_true_demand, 1),
            "price_per_unit": price_per_unit,
            "cost_per_unit": cost_per_unit,
        })

    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate_dataset()
    out_path = __file__.replace("generate_data.py", "vendor_sales.csv")
    df.to_csv(out_path, index=False)

    print(f"Generated {len(df)} days of synthetic vendor sales -> {out_path}\n")
    print("Sample (first 5 rows):")
    print(df.head().to_string(index=False))
    print("\nSample (last 5 rows):")
    print(df.tail().to_string(index=False))
    print("\nSummary stats:")
    print(df[["units_prepared", "units_sold", "true_demand", "rain_probability", "temperature"]].describe())

    censored_days = (df["units_prepared"] < df["true_demand"]).sum()
    print(f"\n{censored_days}/{len(df)} days had units_sold censored by units_prepared "
          f"(stockout) -- forecast model trains on true_demand to avoid learning this cap.")
