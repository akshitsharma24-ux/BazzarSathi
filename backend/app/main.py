"""BazaarSaathi FastAPI entrypoint.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

import os

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.routers import dashboard, forecast, mesh, simulate

app = FastAPI(
    title="BazaarSaathi API",
    description="AI decision-support for street food vendors: demand forecasting, "
                "Monte Carlo simulation, and Survival Stock recommendations. "
                "All data is synthetic.",
    version="1.0.0",
)

# ALLOWED_ORIGINS: comma-separated list of allowed frontend origins for the
# deployed environment (e.g. "https://bazaarsaathi.vercel.app"). Defaults to
# "*" (any origin) for local development. No cookies/auth are used by this
# API, so allow_credentials stays False -- that keeps a literal "*" valid
# under the CORS spec instead of requiring per-request origin reflection.
_allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS = (
    ["*"] if _allowed_origins_env.strip() == "*"
    else [o.strip() for o in _allowed_origins_env.split(",") if o.strip()]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, tags=["dashboard"])
app.include_router(forecast.router, tags=["forecast"])
app.include_router(simulate.router, tags=["simulate"])
app.include_router(mesh.router, tags=["mesh"])


@app.get("/")
def root():
    return {"status": "ok", "service": "BazaarSaathi API"}
