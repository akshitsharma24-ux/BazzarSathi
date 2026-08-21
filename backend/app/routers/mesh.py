"""Bazaar Mesh -- a minimal surplus/shortage matcher against a hardcoded set
of nearby vendors. No login, no messaging, no map: given our vendor's
surplus or shortage for today (derived from the simulation on the frontend),
this looks for one nearby vendor (within ~1km) selling the same item with
the opposite situation, and surfaces a single match.

Everything here is intentionally hardcoded / in-memory, matching the locked
scope for this stretch feature.
"""

from fastapi import APIRouter

from app.schemas import MeshMatchRequest, MeshMatchResponse

router = APIRouter()

ITEM = "Vada Pav"
PRICE_PER_UNIT = 25.0
MAX_DISTANCE_M = 1000

# Hardcoded nearby vendors. `status` is "surplus" or "shortage" for today;
# `quantity` is units of surplus/shortage. Only vendors selling the same
# item can match each other.
NEARBY_VENDORS = [
    {"name": "Ramesh's Vada Pav Corner", "distance_m": 350, "item": "Vada Pav", "status": "shortage", "quantity": 15},
    {"name": "Sunita's Chaat Stall", "distance_m": 620, "item": "Chaat", "status": "shortage", "quantity": 12},
    {"name": "Iqbal's Vada Pav Cart", "distance_m": 900, "item": "Vada Pav", "status": "surplus", "quantity": 20},
    {"name": "Meena's Dosa Point", "distance_m": 1400, "item": "Dosa", "status": "surplus", "quantity": 8},
    {"name": "Raju's Vada Pav Stand", "distance_m": 480, "item": "Vada Pav", "status": "shortage", "quantity": 6},
]


def find_match(direction: str, quantity: int) -> dict | None:
    """direction is our vendor's situation ("surplus" or "shortage"); looks
    for a nearby same-item vendor with the opposite situation."""
    if quantity <= 0 or direction not in ("surplus", "shortage"):
        return None

    opposite = "shortage" if direction == "surplus" else "surplus"
    candidates = [
        v for v in NEARBY_VENDORS
        if v["item"] == ITEM and v["status"] == opposite and v["distance_m"] <= MAX_DISTANCE_M
    ]
    if not candidates:
        return None

    match = min(candidates, key=lambda v: v["distance_m"])
    matched_quantity = min(quantity, match["quantity"])

    return {
        "vendor_name": match["name"],
        "distance_m": match["distance_m"],
        "item": ITEM,
        "their_status": match["status"],
        "matched_quantity": matched_quantity,
        "estimated_value_recovered": round(matched_quantity * PRICE_PER_UNIT, 2),
    }


@router.post("/mesh/match", response_model=MeshMatchResponse)
def post_mesh_match(payload: MeshMatchRequest) -> MeshMatchResponse:
    match = find_match(payload.direction, payload.quantity)
    return MeshMatchResponse(
        item=ITEM,
        our_direction=payload.direction,
        our_quantity=payload.quantity,
        match_found=match is not None,
        match=match,
    )
