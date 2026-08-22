import { useEffect, useState } from "react";
import { postMeshMatch } from "../api/client.js";
import { useLanguage } from "../i18n.jsx";

const SURPLUS_SHORTAGE_THRESHOLD = 5; // units of slack before we call it "balanced"

function deriveOurStatus(result) {
  const distribution = result.demand_distribution;
  const meanDemand = distribution.reduce((sum, v) => sum + v, 0) / distribution.length;
  const diff = result.recommended_stock - meanDemand; // positive = likely surplus

  if (diff > SURPLUS_SHORTAGE_THRESHOLD) {
    return { direction: "surplus", quantity: Math.round(diff) };
  }
  if (diff < -SURPLUS_SHORTAGE_THRESHOLD) {
    return { direction: "shortage", quantity: Math.round(-diff) };
  }
  return { direction: "balanced", quantity: 0 };
}

export default function BazaarMeshCard({ result }) {
  const { t } = useLanguage();
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [response, setResponse] = useState(null);
  const [ourStatus, setOurStatus] = useState(null);

  // The recommendation changes whenever risk mode or conditions change (a
  // new /simulate call) -- any previous mesh check is stale at that point,
  // so reset back to idle rather than showing a match computed against the
  // old recommended_stock.
  useEffect(() => {
    setState("idle");
    setResponse(null);
    setOurStatus(null);
  }, [result.recommended_stock, result.risk_mode]);

  async function handleCheck() {
    setState("loading");
    try {
      const status = deriveOurStatus(result);
      setOurStatus(status);
      const data = await postMeshMatch(status);
      setResponse(data);
      setState("done");
    } catch {
      setState("error");
    }
  }

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 animate-fade-up">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-ink-900 flex items-center gap-1.5">
            <span aria-hidden="true">🔗</span> {t("mesh_title")}
          </h3>
          <p className="text-sm text-ink-500 mt-1 max-w-sm">{t("mesh_subtitle")}</p>
        </div>
        {state !== "done" && (
          <button
            onClick={handleCheck}
            disabled={state === "loading"}
            className="shrink-0 bg-ink-900 hover:bg-ink-800 disabled:bg-ink-300 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
          >
            {state === "loading" ? t("mesh_checking") : t("mesh_check_button")}
          </button>
        )}
      </div>

      {state === "error" && (
        <p className="mt-4 text-sm text-rose-500 bg-rose-50 border border-rose-200 rounded-xl p-3">
          {t("mesh_error")}
        </p>
      )}

      {state === "done" && response && (
        <div className="mt-4 animate-fade-in">
          {response.match_found ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold mb-2">
                ⚡ {t("mesh_match_found")}
              </p>
              <p className="text-sm text-ink-700">
                <span className="font-semibold">{response.match.vendor_name}</span>{" "}
                <span className="font-semibold">{response.match.distance_m}m</span> {t("mesh_away")} ·{" "}
                {response.match.their_status === "shortage" ? t("mesh_short_on") : t("mesh_has_surplus")}{" "}
                <span className="font-semibold">{response.item}</span>.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-ink-400">{t("mesh_qty_matched")}</p>
                  <p className="text-lg font-display font-bold text-ink-800 tabular-nums-all">
                    {response.match.matched_quantity} {t("survival_units")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-ink-400">{t("mesh_value_recovered")}</p>
                  <p className="text-lg font-display font-bold text-emerald-700 tabular-nums-all">
                    {rupee(response.match.estimated_value_recovered)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-ink-100 bg-ink-50 p-4">
              <p className="text-sm text-ink-600">
                {ourStatus?.direction === "balanced" ? t("mesh_balanced") : t("mesh_no_match")}
              </p>
            </div>
          )}
          <button
            onClick={() => setState("idle")}
            className="mt-3 text-xs text-ink-400 hover:text-ink-600 underline"
          >
            {t("mesh_check_again")}
          </button>
        </div>
      )}
    </div>
  );
}
