import { useEffect, useState } from "react";
import { postMeshMatch } from "../api/client.js";
import { useLanguage } from "../i18n.jsx";
import { ZapIcon } from "./icons.jsx";
import { PrimaryButton, TextButton } from "./ui.jsx";

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

  if (state === "idle" || state === "loading" || state === "error") {
    return (
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-ink-500 max-w-sm">{t("mesh_subtitle")}</p>
        <PrimaryButton onClick={handleCheck} disabled={state === "loading"}>
          {state === "loading" ? t("mesh_checking") : t("mesh_check_button")}
        </PrimaryButton>
        {state === "error" && (
          <p className="w-full text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
            {t("mesh_error")}
          </p>
        )}
      </div>
    );
  }

  const ourDirectionLabel = ourStatus?.direction === "surplus" ? t("mesh_has_surplus") : t("mesh_short_on");

  return (
    <div className="animate-fade-in">
      {response.match_found ? (
        <div>
          <div className="grid sm:grid-cols-[1fr_auto_1fr] items-center gap-4 mb-4">
            <div className="border border-ink-200 rounded-lg p-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-ink-500">{t("mesh_your_position")}</p>
              <p className="text-sm font-semibold text-ink-800 mt-1 capitalize">
                {ourDirectionLabel} · {ourStatus.quantity} {t("survival_units")}
              </p>
            </div>
            <ZapIcon className="w-5 h-5 text-saathi-500 mx-auto rotate-90 sm:rotate-0" />
            <div className="border-2 border-mesh-400 bg-mesh-50 rounded-lg p-3 text-center">
              <p className="text-[10px] uppercase tracking-wide text-mesh-700 font-semibold">{t("mesh_match_found")}</p>
              <p className="text-sm font-semibold text-mesh-800 mt-1">{response.match.vendor_name}</p>
              <p className="text-xs text-mesh-700">{response.match.distance_m}m {t("mesh_away")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-ink-200 pt-4">
            <div>
              <p className="text-xs text-ink-500">{t("mesh_qty_matched")}</p>
              <p className="text-xl font-display font-bold text-ink-800 tabular-nums-all">
                {response.match.matched_quantity} {t("survival_units")}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink-500">{t("mesh_value_recovered")}</p>
              <p className="text-xl font-display font-bold text-mesh-700 tabular-nums-all">
                {rupee(response.match.estimated_value_recovered)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-ink-200 rounded-lg p-4">
          <p className="text-sm text-ink-600">
            {ourStatus?.direction === "balanced" ? t("mesh_balanced") : t("mesh_no_match")}
          </p>
        </div>
      )}
      <TextButton onClick={() => setState("idle")} className="mt-3 text-ink-400 hover:text-ink-600">
        {t("mesh_check_again")}
      </TextButton>
    </div>
  );
}
