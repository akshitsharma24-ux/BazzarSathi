"""
Generates a handful of *other* synthetic vendors near Ramesh's stall and
computes pooled "hyperlocal pattern" stats across them -- this is the data
behind Bazaar Intelligence (GET /neighborhood-insights): the idea that a
brand-new vendor with no sales history of their own can still get a
reasonable starting signal ("rain historically cuts demand ~X% for street
food in this area") by borrowing anonymized, aggregated patterns from
established nearby vendors, until they build up enough history of their own.

Each neighbor reuses the exact same generative process as
generate_data.py (generate_dataset), just with a different seed and
slightly different demand baseline/sensitivities -- plausible variation
between similar-but-not-identical stalls, not a copy-paste of Ramesh.

Run directly to regenerate neighborhood_insights.json:
    python -m app.data.generate_neighborhood_data
"""

import json
import os

import numpy as np
import pandas as pd

from app.data.generate_data import generate_dataset

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_PATH = os.path.join(CURRENT_DIR, "neighborhood_insights.json")

# Distinct nearby vendors -- different item, seed, and demand
# sensitivities, so the pooled stats reflect genuine (synthetic) variation
# across a small neighborhood rather than five copies of the same stall.
# Reuses the same vendor names as the Bazaar Mesh hardcoded list
# (app/routers/mesh.py) so both features draw from one consistent
# fictional neighborhood instead of two disconnected casts of vendors.
NEARBY_VENDORS = [
    {"name": "Iqbal's Vada Pav Cart", "item": "Vada Pav", "seed": 101,
     "base_demand": 70, "rain_coef": 2.1, "rain_prob_coef": 12, "weekend_boost": 15, "event_boost": 30},
    {"name": "Sunita's Chaat Stall", "item": "Chaat", "seed": 102,
     "base_demand": 55, "rain_coef": 1.4, "rain_prob_coef": 8, "weekend_boost": 20, "event_boost": 25},
    {"name": "Meena's Dosa Point", "item": "Dosa", "seed": 103,
     "base_demand": 65, "rain_coef": 2.6, "rain_prob_coef": 14, "weekend_boost": 22, "event_boost": 40},
    {"name": "Raju's Vada Pav Stand", "item": "Vada Pav", "seed": 104,
     "base_demand": 48, "rain_coef": 1.0, "rain_prob_coef": 6, "weekend_boost": 10, "event_boost": 20},
    {"name": "Sai Snacks", "item": "Bhel Puri", "seed": 105,
     "base_demand": 60, "rain_coef": 2.9, "rain_prob_coef": 16, "weekend_boost": 17, "event_boost": 22},
]


def _pct_impact(df: pd.DataFrame, mask: pd.Series) -> float:
    """% difference in mean true_demand between rows matching `mask` and
    rows not matching it, relative to the vendor's overall mean -- keeps
    vendors with very different demand baselines comparable before pooling."""
    overall_mean = df["true_demand"].mean()
    if overall_mean == 0 or mask.sum() == 0 or (~mask).sum() == 0:
        return 0.0
    with_mean = df.loc[mask, "true_demand"].mean()
    without_mean = df.loc[~mask, "true_demand"].mean()
    return float((with_mean - without_mean) / overall_mean * 100)


def compute_neighborhood_insights(vendors: list[dict] = NEARBY_VENDORS) -> dict:
    rain_impacts, weekend_impacts, event_impacts = [], [], []
    vendor_summaries = []

    for v in vendors:
        df = generate_dataset(
            seed=v["seed"],
            base_demand=v["base_demand"],
            rain_coef=v["rain_coef"],
            rain_prob_coef=v["rain_prob_coef"],
            weekend_boost=v["weekend_boost"],
            event_boost=v["event_boost"],
        )
        rain_impacts.append(_pct_impact(df, df["rain_probability"] > 0.5))
        weekend_impacts.append(_pct_impact(df, df["weekend"]))
        event_impacts.append(_pct_impact(df, df["local_event"]))
        vendor_summaries.append({
            "name": v["name"],
            "item": v["item"],
            "avg_daily_demand": round(float(df["true_demand"].mean()), 1),
        })

    return {
        "vendor_count": len(vendors),
        "days_per_vendor": int(len(generate_dataset(seed=vendors[0]["seed"]))) if vendors else 0,
        "rain_impact_pct": round(float(np.mean(rain_impacts)), 1),
        "weekend_impact_pct": round(float(np.mean(weekend_impacts)), 1),
        "event_impact_pct": round(float(np.mean(event_impacts)), 1),
        "vendors": vendor_summaries,
    }


if __name__ == "__main__":
    insights = compute_neighborhood_insights()
    with open(OUT_PATH, "w") as f:
        json.dump(insights, f, indent=2)

    print(f"Pooled hyperlocal patterns across {insights['vendor_count']} nearby vendors "
          f"({insights['days_per_vendor']} days each):")
    print(f"  Rain:    {insights['rain_impact_pct']:+.1f}%")
    print(f"  Weekend: {insights['weekend_impact_pct']:+.1f}%")
    print(f"  Event:   {insights['event_impact_pct']:+.1f}%")
    print(f"Saved -> {OUT_PATH}")
