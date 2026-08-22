# BazaarSaathi — Demo Video Script

**Target length: 6-8 minutes.** Keep energy up, keep the screen moving —
narrate over the live app, don't just read slides.

**Not yet recorded.** This script is current against the live app
(https://bazzar-sathi.vercel.app) as of the 2026-08-22 redesign pass, but no
actual video file exists yet — recording needs a human voice and screen
capture, neither of which this session had tooling for. Record against the
live URL, not localhost, so what judges see matches what's on screen here.

---

## 1. Landing page — the vendor's problem (0:00 – 0:45)

*(Open on the BazaarSaathi landing page.)*

> "Meet Ramesh. Every single morning, before his first customer shows up, he
> has to make a high-stakes bet: how much to prepare today.
>
> Too much, and whatever doesn't sell is wasted money — thrown away by
> evening. Too little, and he turns away paying customers on his best day of
> the week. There's no forecasting team, no supply chain software, no room
> for error on tight working capital. It's a guess, every single day, with
> real rupees on the line."

*(Read the "Meet Ramesh" card on screen, then click "See how it works →".)*

## 2. Dashboard (0:45 – 1:45)

> "This is BazaarSaathi — the intelligence a formal retailer's supply chain
> team has, built for a street vendor."

*(On the Dashboard page.)*

> "Here's today's snapshot: what he prepared, what actually sold, what went
> to waste, and today's profit."

*(Point at the Tomorrow's ML Forecast card.)*

> "Before we even simulate anything, the trained model gives its single best
> guess for tomorrow — here, 99 units — along with its own track record:
> mean error, RMSE, R-squared. No black box; the model tells you how much to
> trust it."

*(Optional, if time allows: point at the "Log today's sales" voice card.)*

> "And because not every vendor is comfortable typing on a phone, he can log
> today's numbers by just speaking them — in English or Hindi."

*(Click "Simulate Tomorrow →".)*

## 3. Simulate: setting tomorrow's conditions (1:30 – 2:15)

*(On the Simulate page, adjust the rain-probability slider and toggle the
local-event switch.)*

> "He tells the app what tomorrow looks like — chance of rain, temperature,
> whether there's a local event nearby, like a festival or a cricket match
> that could bring extra footfall."

*(Click "Simulate Tomorrow".)*

> "And now, instead of trusting one single forecast number, BazaarSaathi does
> something different."

## 4. The distribution (2:15 – 3:00)

*(Point at the dark "500 FUTURES SIMULATED" card, then the demand
distribution chart below it.)*

> "It doesn't just predict *one* tomorrow. It simulates **500 possible
> versions** of tomorrow — slightly different weather, slightly different
> turnout, the natural noise in any forecast — and looks at how demand plays
> out across all of them. Here's the range: anywhere from 97 to 149 units,
> most likely around 124. This histogram is that same spread in detail. Most
> forecasting tools give you a single number and hope for the best. We show
> the vendor the full range of what could happen."

## 5. Survival Stock reveal + stock comparison (3:00 – 4:00)

*(Point at the Survival Stock card — the big number — then scroll to the
"Compare nearby stock levels" table.)*

> "From that spread, BazaarSaathi recommends a **Survival Stock** — the
> quantity that stays financially safe across the *likely* outcomes, not just
> the single most probable one. And it's not a black-box number: here's the
> recommendation next to a few stock levels just above and below it, so he
> can see exactly what he'd be trading off — profit, waste, and the chance of
> running out — by stocking a little more or a little less."

## 6. Risk toggle (4:00 – 5:00)

*(Click through Protect Cash → Balanced → Maximize Sales.)*

> "Every vendor has a different risk tolerance. Someone rebuilding after a
> slow month might want to **protect cash** — never overspend on stock, even
> if it means running low some days. Someone with steady footfall might want
> to **maximize sales** — always have enough, even if it means a little
> waste. Watch the recommended number — and the whole comparison table —
> change live as we switch between them. Same 500 simulated futures,
> different lens on the trade-off."

## 7. Why-breakdown (5:00 – 5:30)

*(Point at the Why this number? section.)*

> "And he doesn't just get a number — he gets the reasoning. Rain is pulling
> demand down. Today's local event is pushing it up. This isn't a black box;
> it's a number he can actually trust and explain to himself."

## 8. Savings (5:30 – 6:00)

*(Point at the Savings calculator.)*

> "Compare that to naive stocking — just rounding the raw forecast, the way
> most tools would leave it — and BazaarSaathi shows exactly how many rupees
> of waste this recommendation avoids, projected out to a monthly savings
> figure."

## 9. Bazaar Mesh (6:00 – 6:45)

*(Click "Check nearby vendors" in the Bazaar Mesh section.)*

> "One more thing — Ramesh isn't the only vendor on this street. If today's
> numbers show he's likely to have surplus, or come up short, BazaarSaathi
> checks nearby vendors selling the same item. Here, a nearby cart is short on
> vada pav today — so instead of that surplus going to waste, it can go to a
> vendor who actually needs it, just a few hundred metres away. That's real
> rupees recovered that would otherwise just be thrown out."

## 9b. Language toggle (6:45 – 7:00, optional if time is tight)

*(Click "हिं" in the header.)*

> "And this whole experience works in Hindi too — not just this screen, the
> full flow. For a lot of vendors, that's the difference between a tool they
> can actually use and one they can't."

*(Click back to "EN".)*

## 10. Closing line (7:00 – 7:30)

*(Let the closing line on screen speak for itself, then say it aloud.)*

> "Prediction tells a vendor what may happen. BazaarSaathi helps them survive
> when the prediction is wrong. Thank you."

*(All data shown in this demo is synthetic — mention this once, briefly, if
not already stated on screen.)*
