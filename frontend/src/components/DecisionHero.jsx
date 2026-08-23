import { useLanguage } from "../i18n.jsx";
import { useCountUp } from "../hooks/useCountUp.js";

const RISK_LABEL_KEYS = {
  protect_cash: "risk_protect_cash",
  balanced: "risk_balanced",
  maximize_sales: "risk_maximize_sales",
};

export default function DecisionHero({ result, expectedDemand }) {
  const { t } = useLanguage();
  const displayStock = useCountUp(result?.recommended_stock ?? 0, { duration: 500 });
  if (!result) return null;

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  // Top two |impact| factors from the why-breakdown, for the inline "why" line.
  const topFactors = Object.entries(result.why_breakdown || {})
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 2);
  const factorLabel = { rain_impact_pct: "why_rain", weekend_impact_pct: "why_weekend", event_impact_pct: "why_event", trend_impact_pct: "why_trend" };

  return (
    <div className="bg-ink-900 rounded-xl p-6 sm:p-8 text-white">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-300">
        {t("decision_eyebrow")}
      </p>

      <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-saathi-300 font-semibold">{t("decision_prepare")}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-display font-extrabold tabular-nums-all leading-none">
              {displayStock}
            </span>
            <span className="text-lg text-ink-300 font-medium">{t("survival_units")}</span>
          </div>
          <p className="text-sm text-ink-300 mt-1.5">{t(RISK_LABEL_KEYS[result.risk_mode])} {t("decision_strategy")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
        <div>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">{t("decision_expected_demand")}</p>
          <p className="text-xl font-display font-bold tabular-nums-all mt-0.5">{Math.round(expectedDemand)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">{t("survival_stockout_risk")}</p>
          <p className="text-xl font-display font-bold tabular-nums-all mt-0.5">{Math.round(result.stockout_probability * 100)}%</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">{t("decision_expected_waste")}</p>
          <p className="text-xl font-display font-bold tabular-nums-all mt-0.5">{rupee(result.expected_waste_cost)}</p>
        </div>
        <div>
          <p className="text-[11px] text-ink-400 uppercase tracking-wide">{t("survival_expected_profit")}</p>
          <p className="text-xl font-display font-bold tabular-nums-all mt-0.5 text-saathi-300">{rupee(result.expected_profit)}</p>
        </div>
      </div>

      {topFactors.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-5 pt-5 border-t border-white/10 text-sm">
          <span className="text-ink-400">{t("why_title")}</span>
          {topFactors.map(([key, pct]) => (
            <span key={key} className={pct >= 0 ? "text-saathi-300" : "text-mesh-300"}>
              {t(factorLabel[key] || key)} {pct >= 0 ? "↑" : "↓"} {Math.abs(pct)}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
