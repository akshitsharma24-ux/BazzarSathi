"""BazaarSaathi FastAPI entrypoint.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

import os

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.routers import dashboard, forecast, mesh, model_info, simulate

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

# Registered at both the bare paths (local dev, direct backend access) and
# under an /api prefix (Vercel's multi-service deploy routes "/api/*" to this
# service -- whether that rewrite forwards the full path or strips the
# matched prefix before proxying isn't something we could verify without a
# live deploy, so both are wired up rather than gambling on one behavior).
for prefix in ("", "/api"):
    app.include_router(dashboard.router, prefix=prefix, tags=["dashboard"])
    app.include_router(forecast.router, prefix=prefix, tags=["forecast"])
    app.include_router(simulate.router, prefix=prefix, tags=["simulate"])
    app.include_router(mesh.router, prefix=prefix, tags=["mesh"])
    app.include_router(model_info.router, prefix=prefix, tags=["model-info"])


@app.get("/")
@app.get("/api")
def root():
    return {"status": "ok", "service": "BazaarSaathi API"}
