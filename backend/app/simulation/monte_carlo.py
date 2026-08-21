"""
BazaarTwin: Monte Carlo demand simulator.

Given tomorrow's forecast conditions, this module doesn't just trust the
single-point ML forecast -- it generates 500 plausible "alternate tomorrows"
by (a) jittering the input conditions slightly (weather/event uncertainty is
real -- a 30% rain forecast doesn't mean *exactly* 30%) and (b) adding
gaussian noise to the model's point prediction (forecast/model uncertainty).

The output is a distribution of simulated demand, which survival_stock.py then
uses to evaluate candidate stock levels across many possible futures instead
of just one.
"""

from dataclasses import dataclass

import numpy as np

NUM_SIMULATIONS = 500

# Std-dev of forecast residual noise added per simulation draw, in units.
# Roughly matches the trained model's RMSE (~8.6 units) -- represents
# irreducible forecast uncertainty.
FORECAST_NOISE_STD = 8.6

# Jitter magnitudes for input condition perturbation.
RAIN_PROB_JITTER_STD = 0.08
TEMPERATURE_JITTER_STD = 1.5


@dataclass
class TomorrowConditions:
    day_of_week: int
    weekend: bool
    temperature: float
    rain_probability: float
    local_event: bool
    day_index: int


def _derive_rainfall(rain_probability: float, rng: np.random.Generator) -> float:
    """Mirrors the relationship used in generate_data.py: rainfall scales with
    rain_probability plus its own randomness."""
    return float(max(0.0, rng.gamma(2, 4) * rain_probability))


def simulate_demand_distribution(
    model,
    features: list[str],
    conditions: TomorrowConditions,
    num_simulations: int = NUM_SIMULATIONS,
    seed: int | None = None,
) -> np.ndarray:
    """Runs `num_simulations` draws of simulated demand for tomorrow.

    Each draw:
      1. Jitters rain_probability and temperature around the given inputs
         (small random variation -- weather forecasts are never exact).
      2. Derives rainfall from the jittered rain_probability.
      3. Gets the model's point prediction for that jittered scenario.
      4. Adds gaussian noise to the point prediction (forecast uncertainty).

    Returns an array of `num_simulations` non-negative demand values.
    """
    rng = np.random.default_rng(seed)

    jittered_rain_prob = np.clip(
        conditions.rain_probability + rng.normal(0, RAIN_PROB_JITTER_STD, num_simulations),
        0.0,
        1.0,
    )
    jittered_temperature = conditions.temperature + rng.normal(
        0, TEMPERATURE_JITTER_STD, num_simulations
    )

    import pandas as pd

    rows = []
    for i in range(num_simulations):
        rainfall = _derive_rainfall(jittered_rain_prob[i], rng)
        rows.append({
            "day_of_week": conditions.day_of_week,
            "weekend": int(conditions.weekend),
            "temperature": jittered_temperature[i],
            "rainfall": rainfall,
            "rain_probability": jittered_rain_prob[i],
            "local_event": int(conditions.local_event),
            "day_index": conditions.day_index,
        })

    batch = pd.DataFrame(rows)[features]
    point_predictions = model.predict(batch)

    forecast_noise = rng.normal(0, FORECAST_NOISE_STD, num_simulations)
    demand_draws = point_predictions + forecast_noise
    demand_draws = np.clip(demand_draws, 0, None)

    return demand_draws
