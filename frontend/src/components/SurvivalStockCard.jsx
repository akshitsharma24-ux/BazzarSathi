import { useLanguage } from "../i18n.jsx";
import { getDistributionStats } from "../utils/stats.js";

function MetricTile({ label, value, tone }) {
  const tones = {
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    bad: "bg-rose-50 text-rose-700 border-rose-200",
    neutral: "bg-mesh-50 text-mesh-700 border-mesh-200",
  };
  return (
    <div className={`rounded-xl border px-3.5 py-3 ${tones[tone]}`}>
      <p className="text-[11px] uppercase tracking-wide opacity-70 font-medium">{label}</p>
      <p className="text-lg sm:text-xl font-display font-bold tabular-nums-all mt-0.5">{value}</p>
    </div>
  );
}

function riskTone(prob) {
  if (prob < 0.15) return "good";
  if (prob < 0.4) return "warn";
  return "bad";
}

export default function SurvivalStockCard({ result }) {
  const { t } = useLanguage();
  if (!result) return null;

  const rupee = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const { min, max } = getDistributionStats(result.demand_distribution);
  const wasteShare = result.expected_waste_cost / (result.expected_profit + result.expected_waste_cost || 1);

  return (
    <div className="relative bg-white rounded-2xl shadow-card-hover border border-saathi-200 p-6 sm:p-7 overflow-hidden animate-pop">
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-saathi-50" aria-hidden="true" />

      <div className="relative flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-sm font-medium text-ink-500 flex items-center gap-1.5">
            <span aria-hidden="true">🛡</span> {t("survival_title")}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl sm:text-6xl font-display font-extrabold text-saathi-700 tabular-nums-all">
              {result.recommended_stock}
            </span>
            <span className="text-ink-400 font-medium">{t("survival_units")}</span>
          </div>
          <p className="text-xs text-ink-400 mt-1.5 max-w-xs">{t("survival_safest_because")}</p>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6">
        <MetricTile label={t("survival_expected_profit")} value={rupee(result.expected_profit)} tone="good" />
        <MetricTile
          label={t("survival_waste_risk")}
          value={rupee(result.expected_waste_cost)}
          tone={riskTone(wasteShare)}
        />
        <MetricTile
          label={t("survival_stockout_risk")}
          value={`${Math.round(result.stockout_probability * 100)}%`}
          tone={riskTone(result.stockout_probability)}
        />
        <MetricTile label={t("survival_likely_demand")} value={`${min}–${max}`} tone="neutral" />
      </div>
    </div>
  );
}
