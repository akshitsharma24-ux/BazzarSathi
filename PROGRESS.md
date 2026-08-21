# PROGRESS.md

Autonomous build log for BazaarSaathi. Steps match the spec's build order.
Judgment calls are called out explicitly with **Decision:** / **Why:**.

## Environment note

The machine had **Python 3.14**, which is new enough that pinned versions
(numpy 2.2.1 etc.) had no prebuilt Windows wheels and tried to compile from
source with a broken MinGW toolchain (x86 vs x86_64 mismatch). **Decision:**
switched `requirements.txt` to unpinned lower-bound versions (`>=`) so pip
resolves to the latest compatible releases, which do ship Python 3.14 wheels.
Installed clean afterward (pandas 3.0.5, numpy 2.5.2, scikit-learn 1.9.0,
fastapi 0.141.1).

## Step 1 — Synthetic data (`backend/app/data/generate_data.py`)

Generated vendor sales history with the requested columns. Baked in: rain
suppresses demand, weekends/events boost it, mild upward trend, gaussian
noise. Vendor's `units_prepared` is modeled as an imperfect human heuristic
(not the true demand) so realistic over/under-prep and stockout patterns
emerge in the training data.

**Decision:** used 150 days (spec allowed 90–180), started at 120 but
increased after Step 2's model-quality pass surfaced a data-sparsity issue
(see below). **Why:** more days = more examples of rare combinations
(weekend + local event together), which the forecast model needs to learn
those interactions reliably.

**Decision:** local event frequency set to 15% (not specified in spec) and
event demand boost set to +35 units. **Why:** originally 8%/+30, but that was
too sparse — see Step 2.

Verified output looks sane: rain days show lower `units_sold`, weekends/events
show spikes, later rows trend higher than early rows.

## Step 2 — Forecast model (`backend/app/models/forecast_model.py`)

Trained a `RandomForestRegressor` (200 trees → tuned to 300, `max_depth=8` →
10, added `min_samples_leaf=2`) predicting `units_sold` from day-of-week,
weekend, temperature, rainfall, rain_probability, local_event, and a
`day_index` feature (so the model can pick up the mild trend).

**Bug found & fixed:** with the original 120-day / 8%-event dataset and
default RF settings, the model showed **zero sensitivity to `local_event` on
the specific weekday tomorrow happens to fall on (Saturday)** — there weren't
enough weekend+event training rows for any tree to split on that
interaction, so toggling the "local event" switch in the UI would have
silently done nothing on demo day. **Fix:** increased event frequency to 15%,
event boost to +35, dataset to 150 days, and lowered `min_samples_leaf` to 2
so the RF could resolve rarer feature combinations. Re-verified after the fix
that toggling `local_event` shifts the forecast in both weekday and weekend
scenarios.

Final metrics (test split): **MAE 5.32, RMSE 6.56, R² 0.68**. Printed at
training time; also printed feature importances (day_of_week and local_event
are the top two drivers, matching the generative process).

## Step 3 — Simulation engine (`monte_carlo.py` + `survival_stock.py`)

`monte_carlo.py`: given tomorrow's conditions, jitters rain_probability
(±0.08 std) and temperature (±1.5°C std), derives rainfall from the jittered
rain probability (mirroring the generator's own relationship), gets the
model's point prediction, then adds gaussian forecast-noise (std ≈ 9, close
to the model's RMSE) — 500 draws total.

`survival_stock.py`: sweeps stock levels 60→130 step 5. For each level,
computes expected profit, expected waste units/cost, and stockout
probability across all 500 draws. Recommends per risk mode exactly as
specified (protect_cash → min waste cost, balanced → max profit,
maximize_sales → min stockout probability).

**Note on `protect_cash` behavior (superseded — see "Post-review fixes"
below):** the first pass implemented `protect_cash` as a literal
`min(expected_waste_cost)` over the swept range. Expected waste cost is
mathematically non-decreasing in stock level, so that always landed on the
*floor* of the range (60 units) regardless of conditions. This was caught in
review as a live-demo risk (a judge toggling risk mode + conditions together
would see it never move) and replaced with a percentile-of-demand-draws
approach so all three modes respond to conditions — see "Post-review fixes"
for the actual final implementation. `balanced` and `maximize_sales` responded
dynamically to changing conditions even before that fix (verified: heavy rain
→ 90 units recommended; light rain + event → 100 units).

Why-breakdown compares scenario-on vs scenario-off point predictions for
rain, weekend, event, and a 30-day-ago vs today trend comparison — all
expressed as % delta.

Savings calculator: naive stock = rounded raw ML forecast (snapped to nearest
evaluated 5-unit level for a fair comparison), vs. the recommended Survival
Stock, showing waste cost avoided and `daily_savings × 30` projected monthly.

## Step 4 — Backend API (FastAPI)

Built `/dashboard` (GET), `/forecast` (GET, query params), `/simulate` (POST,
JSON body). CORS enabled for all origins (hackathon scope — no auth).

**Decision:** "tomorrow" for `/forecast` and `/simulate` is always the day
*after* the last row in `vendor_sales.csv` (continuing the synthetic
timeline), not the real system date. **Why:** keeps day-of-week/day-index
features consistent with the training data's trend regardless of when the
demo is actually run.

**Decision:** `/simulate` uses a fixed random seed (42) per request. **Why:**
makes the demand distribution stable when only the risk-mode toggle changes
(same 500 simulated futures, different recommendation lens) — matches the
spec's framing of the risk toggle "re-calling /simulate and updating live"
without the chart visibly jumping around for an unrelated reason.

Tested all three endpoints via curl, including all three risk modes, before
touching the frontend.

## Step 5 — Frontend (React + Tailwind, Vite)

**Decision:** scaffolded Vite/Tailwind config files by hand instead of
`npm create vite` — the CLI refused to run non-interactively in a non-empty
directory (the `src/pages` etc. subfolders from the spec's exact repo
structure already existed). **Decision:** used a lightweight tab-based
`page` state in `App.jsx` instead of adding `react-router` — only two pages,
so a router dependency wasn't worth it (matches "don't expand scope").

**Decision:** `DemandChart` is a hand-rolled SVG histogram (no charting
library) — keeps the dependency list minimal and matches the spec's "a
static histogram... beats an elaborate animation" guidance.

Built all listed components: VendorCard, SimulateButton, DemandChart,
SurvivalStockCard, RiskPersonalityToggle, WhyExplainer, SavingsCalculator.

**Verification:** ran the actual app in a headless Chromium via Playwright
(no project-specific run skill existed yet, so followed the generic
browser-driven-app pattern) — loaded the Dashboard, navigated to Simulate,
adjusted rain/temperature/event controls, ran a simulation, confirmed the
chart/Survival Stock card/why-explainer/savings all render with real data
from the backend, and confirmed the risk-mode toggle re-fetches and updates
numbers live. Zero console errors. Confirmed via screenshots that the layout
reads as clean and professional.

## Step 6 — Documentation

Wrote `README.md` (problem, approach, synthetic-data disclosure, setup/run
instructions, implemented vs. future scope) and `docs/demo_script.md` (6-8
minute script following the requested flow). This `PROGRESS.md` serves as the
running build log.

## Status: complete

All 6 steps built end-to-end and verified working (backend endpoints tested
via curl, frontend tested via a driven headless browser session against the
live backend). No blocking errors encountered.

## Post-review fixes

A review pass ahead of the demo caught two real issues, both fixed:

**1. `protect_cash` never moved.** The original `min(expected_waste_cost)`
selection is mathematically non-decreasing in stock level, so it always
collapsed to the floor of the swept range (60) regardless of weather/event
conditions — a judge toggling risk mode + conditions together would have
seen zero response and assumed it was broken. **Fix:** switched all three
risk modes to target a **percentile of the same 500 simulated demand
draws** (the newsvendor "critical fractile" approach) —
`protect_cash` → 25th percentile, `maximize_sales` → 88th percentile,
`balanced` → unchanged (still maximizes expected profit directly, which for
i.i.d. demand naturally lands near the profit-optimal critical fractile
anyway). Verified live: going from mild to heavy-rain+event conditions now
moves protect_cash 95→115, balanced 100→125, maximize_sales 110→130 — all
three track conditions and stay correctly ordered
(`protect_cash < balanced < maximize_sales`). See `PROTECT_CASH_PERCENTILE` /
`MAXIMIZE_SALES_PERCENTILE` in `survival_stock.py`.

**2. Forecast model was training on demand-censored data.** `units_sold` in
the synthetic dataset is capped by `units_prepared` on days the vendor
under-prepared and sold out — measured **61/150 days (40.7%) were capped**,
with a mean gap of ~13 units on those days between what could have sold and
what actually did. Training the forecaster on `units_sold` directly would
have taught the model to reproduce the vendor's own past under-preparation
instead of forecasting true demand — understating exactly the high-demand
days (weekends, events, low rain) this tool exists to catch.
**Fix:** `generate_data.py` now also writes a `true_demand` column (the
uncapped ground-truth demand from the generative process); `units_sold`
stays as-is for the dashboard's "today" actuals (that's genuinely what was
sold), but `forecast_model.py` now trains on `true_demand`
(`TARGET_COLUMN = "true_demand"`). Retrained: R² improved 0.68 → 0.81,
`local_event` importance jumped to 0.46 (was diluted before by the
censoring noise). Talking point for judges: "we log observed sales for the
dashboard, but train the forecaster on true demand — training on censored
sales would just teach the model to repeat the vendor's own stockouts."

**Housekeeping:** froze `backend/requirements.txt` via `pip freeze` (was
unpinned `>=` ranges) so a judge's machine resolves the exact same dependency
versions this was built and tested against, rather than whatever's newest on
install day.

Re-verified the full flow after both fixes: backend endpoints via curl across
all three risk modes and multiple condition combinations, and the frontend
again via a driven headless-Chromium session (risk-mode toggle now shows
distinct, correctly-ordered numbers with zero console errors).

## 2026-08-22 — Deployment prep, stock table, Bazaar Mesh, landing page, robustness pass

Worked through the six priorities in order. Status: **1–5 complete, 6 partially
complete** (blocked on live deployment — see below). Nothing left half-finished.

### Priority 1 — Deploy the app live: BLOCKED on credentials, prep complete

Checked for every autonomous path to actually deploying: no git repo existed
yet, no `gh`/`vercel`/`netlify`/`railway` CLI was authenticated, no API tokens
were present in the environment (`env | grep -i` across all four platforms
came up empty), and no SSH key existed for GitHub (`~/.ssh` didn't exist,
`git ls-remote` against the user-provided GitHub URL returned nothing —
confirmed separately via the GitHub API that the repo exists, is public, and
is empty). Live deployment to Render/Vercel fundamentally requires either an
interactive OAuth login (not possible in a non-interactive session) or a
token/credential the user supplies — this isn't something more retrying
fixes, so rather than stall on it, made everything else deployment-ready and
moved on, per the instruction to make the simplest reasonable call and keep
going.

**What's done:**
- `render.yaml` (Render Blueprint: root dir `backend`, build/start commands,
  `PYTHON_VERSION=3.12.7`, `ALLOWED_ORIGINS` env var).
- `backend/Procfile` + `backend/runtime.txt` as a Railway/Heroku-buildpack
  fallback to Render.
- `frontend/vercel.json` (Vite framework preset, build/output dirs) +
  `frontend/.env.example` documenting `VITE_API_BASE`.
- **CORS fix:** `main.py` now reads allowed origins from an `ALLOWED_ORIGINS`
  env var (comma-separated), defaulting to `*` for local dev. Also switched
  `allow_credentials` from `True` to `False` — the API uses no
  cookies/auth, and `True` would have forced Starlette to reflect a specific
  origin instead of allowing a literal `*`, which is the wrong default for an
  undeployed target origin.
- `git init` + staged everything locally (not pushed — no destination
  credentials) so a push is one `git remote add` + `git push` away.
- Full step-by-step deploy instructions written into README's new
  [Deployment](README.md#deployment) section (git push → Render blueprint →
  Vercel import + env var → optional CORS lock-down → update README links).

**What's still needed from the user:** either (a) a GitHub push credential
(PAT or SSH key) plus a Render + Vercel account/token so this can be finished
autonomously next session, or (b) ~10 minutes to click through the README's
Deployment steps directly. Mid-session the user shared a GitHub repo URL
(`github.com/akshitsharma24-ux/BazzarSathi`, confirmed public + empty) and a
Vercel account URL, but no push/API credentials came with them, so the repo
still has no remote content and no Vercel project exists yet.

### Priority 2 — Stock-level comparison table: done

Added `StockComparisonTable.jsx`, reusing `stock_level_stats` already
returned by `/simulate` (no backend changes) — shows the recommended level
±3 steps (a 7-row window, clipped at the sweep's 60/130 bounds), with
Expected Profit, Waste risk %, and Stockout risk % columns and the
recommended row highlighted. "Waste risk %" is computed client-side as
`expected_waste_units / stock_level` (share of prepared stock going unused)
since the backend only exposed the rupee cost, not a percentage — this is
exactly the kind of display-only derivation the task described, no new
simulation logic needed. Wired into `Simulate.jsx` directly under
`SurvivalStockCard`.

### Priority 3 — Bazaar Mesh: done

New `backend/app/routers/mesh.py`: 5 hardcoded nearby vendors (name,
distance, item, surplus/shortage status + quantity), all "Vada Pav" or
adjacent items so at least a few can match on the same item. `POST
/mesh/match` takes our vendor's `{direction, quantity}` and returns the
nearest same-item vendor with the opposite status within 1km, or
`match_found: false`. `BazaarMeshCard.jsx` derives our vendor's
direction/quantity client-side from data already in the `/simulate`
response (recommended stock vs. the mean of the 500 simulated demand draws,
diff > 5 units = surplus/shortage, else "balanced") and calls the endpoint
on a "Check nearby vendors" button click, reachable from the bottom of the
Simulate results.

**Bug found & fixed during Playwright verification:** switching risk mode
(which changes `recommended_stock`) didn't reset a mesh check the user had
already run — the card kept showing the *previous* mode's stale match/no-match
result instead of re-evaluating against the new recommendation. A judge
comparing Bazaar Mesh across risk modes would have seen a wrong or outdated
match. Fixed with a `useEffect` in `BazaarMeshCard.jsx` that resets to `idle`
whenever `result.recommended_stock` or `result.risk_mode` changes. Verified
after the fix: Balanced mode (stock 125, near mean demand) correctly shows
"balanced, no match"; switching to Protect Cash (stock 115, likely shortfall)
resets the card and, on re-check, correctly surfaces "Iqbal's Vada Pav Cart,
900m, 8 units matched, ₹200 recovered."

### Priority 4 — Landing page: done

New `pages/Landing.jsx` ("Meet Ramesh" framing + one-line explanation of what
BazaarSaathi does + a "See how it works →" CTA into the Dashboard).
`App.jsx`'s page state now defaults to `"landing"` instead of `"dashboard"`;
the nav tabs (Dashboard/Simulate) are hidden while on the landing page and
the header logo is now a button that returns to it. Added the required
verbatim closing line ("Prediction tells a vendor what may happen.
BazaarSaathi helps them survive when the prediction is wrong.") as a footer
on the Simulate page, shown once results are in.

### Priority 5 — Robustness pass: done

- New shared `ErrorState.jsx` (generic "something went wrong, try again"
  message + retry button) and `Skeleton.jsx` (`VendorCardSkeleton` +
  `Spinner`) components, replacing the old plain-text loading/error copy in
  `Dashboard.jsx` and `Simulate.jsx`. Verified by killing the backend mid-session
  and confirming the Dashboard shows the error state with a working "Try
  again" button rather than a blank screen or crash.
- **Mobile responsive fixes**, found via an actual Playwright pass at a
  375×812 viewport (not just assumed): `SurvivalStockCard`'s 3-metric grid
  had no breakpoint and would cram on a phone — changed to
  `grid-cols-1 sm:grid-cols-3`. `StockComparisonTable` originally forced a
  480px-wide table in a horizontally-scrolling container, which on a 375px
  viewport clipped the "Stockout risk" column out of view with no visible
  scroll affordance — rebuilt as a `table-fixed` layout with shortened
  headers (Profit/Waste/Stockout) and tighter padding so all 4 columns fit
  natively without scrolling on a phone-sized screen.
- Fixed a stray punctuation bug in the new `ErrorState` message concatenation
  (missing period between the backend error text and "Please try again.").

Verified everything above via headless-Chromium Playwright passes at both
1280×900 (desktop) and 375×812 (mobile — iPhone SE-class width), covering:
landing → dashboard → simulate → stock table → distribution chart → risk
toggle → why-breakdown → savings → Bazaar Mesh, in both viewports, plus a
separate pass with the backend killed to confirm the error state. Zero
console errors across every pass. Screenshots reviewed directly (not just
"tests passed") to catch the two issues above that assertions alone wouldn't
have surfaced (the sticky-header duplication seen in full-page screenshots
was checked and confirmed to be a Playwright full-page-stitching artifact,
not a real rendering bug — a real scrolling user only ever sees one header).

### Priority 6 — Final re-verification: partially done

Cannot re-run against the **live deployed URL** since deployment (Priority 1)
is blocked pending user credentials — there is no live URL yet. Substituted
the most thorough alternative available: the full desktop + mobile Playwright
pass described under Priority 5 above already exercises every item on this
priority's checklist (dashboard load, all three risk modes responding to
changing conditions, stock comparison table, Bazaar Mesh match display,
landing page, mobile viewport) against the local dev servers, with the
Priority-1-era risk-mode fix from the last pass re-confirmed still holding
(protect_cash/balanced/maximize_sales gave distinct, correctly-ordered
numbers in this session's tests too, e.g. 115/125/130 under one condition
set). **Still to do once deployed:** re-run this same Playwright pass
pointed at the real Vercel/Render URLs instead of localhost, and update
README/demo script if the live URLs surface anything that only shows up
under real network latency/CORS (unlikely given the CORS/env-var work in
Priority 1, but not yet verified against the real thing).

### Docs updated this pass

- `README.md`: new "Live demo" section (pending, with clear status + link to
  deploy steps), new "Deployment" section with exact commands, expanded
  project structure tree, added `/mesh/match` to the endpoint table, updated
  implemented/future-scope lists (Bazaar Mesh is now implemented in its
  minimal hardcoded form; a real "Bazaar Intelligence" collective-learning
  version remains future scope, replacing the old "multi-vendor surplus
  matching" future-scope line since a version of it now exists).
- `docs/demo_script.md`: rewritten to open on the landing page instead of a
  blank slide, add a stock-comparison-table beat, add a Bazaar Mesh beat, and
  close on the verbatim required line instead of a paraphrased one. Kept
  within the 6–8 minute target (~7:15).

## 2026-08-22 (later same day) — Deployment resumed: user pushed to GitHub, Vercel multi-service discovered

The user pushed the repo to GitHub themselves
(`github.com/akshitsharma24-ux/BazzarSathi`, confirmed via the GitHub API:
non-empty, `main` branch, pushed 2026-08-21T20:58:39Z) and started the Vercel
import flow, which surfaced something not accounted for in the original
Priority 1 plan: Vercel's newer **"Services"** project type, which auto-detects
multiple deployable directories in one repo (here: `frontend/` as a Vite Web
Service, `backend/` as a FastAPI Web Service) and can host both under a single
Vercel project with path-based routing between them — no separate Render
deployment needed at all. Vercel blocked the import with "vercel.json required
to deploy projects with multiple services" and offered to auto-generate one;
the user copied that generated config and pasted it in.

**Decision:** adopted this as the new primary deployment path (simpler — one
platform instead of two) rather than steering back to the original Render +
Vercel split, since the user was already mid-flow on it and it's a strictly
better outcome if it works. Kept `render.yaml` in the repo as a documented
fallback in case the Vercel Python service hits a dependency-size or cold-start
limit that Render wouldn't.

**What was added:**
- Root-level `vercel.json` — the exact config Vercel generated (`services`
  block: `frontend` at Vite, `backend` at root; `rewrites`: `/api(/.*)?` →
  backend service, everything else → frontend service). Written verbatim
  rather than edited, since this is a very new/unfamiliar Vercel feature and
  guessing at "improvements" to a schema neither of us has full docs for
  seemed like the wrong place to take risk.
- **Genuine unknown, hedged defensively:** whether Vercel's service-rewrite
  forwards the *full* incoming path to the backend (so `/api/dashboard`
  arrives as `/api/dashboard`) or *strips* the matched `/api` prefix first (so
  it arrives as `/dashboard`) isn't something that could be verified without a
  live deploy to test against. Rather than guess and risk a broken deploy,
  `backend/app/main.py` now registers every router twice — once at the bare
  path (`/dashboard`, `/simulate`, etc.) and once under an `/api` prefix
  (`/api/dashboard`, `/api/simulate`, etc.) — so it answers correctly either
  way. Verified locally: both `/dashboard` and `/api/dashboard` (and the other
  three endpoints) return identical, correct responses.
- `frontend/.env.example` updated: for this unified deploy, `VITE_API_BASE`
  must be set to `/api` (relative, same-origin) rather than an absolute
  backend URL — otherwise the frontend would try to call `localhost` from the
  live site. Documented both cases (unified Vercel vs. separate-backend
  fallback).
- Confirmed `npm run build` (the exact command Vercel will run) succeeds
  cleanly with no changes needed.
- Rewrote README's Deployment section: unified-Vercel path is now primary
  with step-by-step instructions including the "verify `/api/dashboard`
  directly once live" check; the original Render+Vercel split is kept as a
  documented fallback. Updated the top-of-file "Live demo" status line to
  reflect that deployment is in progress rather than not-yet-started.

**Status:** deployment is actively in progress on the user's end (they're on
the Vercel import screen). Not yet re-verified against a live URL — that
remains the one open item from Priority 6, to be done as soon as the deploy
completes.
