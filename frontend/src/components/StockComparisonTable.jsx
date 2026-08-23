import { useLanguage } from "../i18n.jsx";

const WINDOW_STEPS = 3; // show recommended level +/- 3 steps (5 units each)

function riskColor(pct) {
  if (pct < 15) return "bg-emerald-500";
  if (pct < 40) return "bg-amber-500";
  return "bg-rose-500";
}

export default function StockComparisonTable({ stockLevelStats, recommendedStock }) {
  const { t } = useLanguage();
  if (!stockLevelStats || stockLevelStats.length === 0) return null;

  const recIndex = stockLevelStats.findIndex((s) => s.stock_level === recommendedStock);
  const start = Math.max(0, recIndex - WINDOW_STEPS);
  const end = Math.min(stockLevelStats.length, recIndex + WINDOW_STEPS + 1);
  const rows = stockLevelStats.slice(start, end);
  const rec = stockLevelStats[recIndex];
  const below = stockLevelStats[Math.max(0, recIndex - 2)];
  const above = stockLevelStats[Math.min(stockLevelStats.length - 1, recIndex + 2)];

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
  const wastePctOf = (s) => (s.stock_level > 0 ? (s.expected_waste_units / s.stock_level) * 100 : 0);

  return (
    <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
      <div>
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="text-left text-ink-500 text-[10px] sm:text-[11px] uppercase tracking-wide border-b border-ink-200">
              <th className="py-2 font-medium w-1/4">{t("compare_stock")}</th>
              <th className="py-2 font-medium w-1/4">{t("compare_profit")}</th>
              <th className="py-2 font-medium w-1/4">{t("compare_waste")}</th>
              <th className="py-2 font-medium w-1/4">{t("compare_stockout")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const isRecommended = s.stock_level === recommendedStock;
              const wastePct = wastePctOf(s);
              const stockoutPct = s.stockout_probability * 100;

              return (
                <tr
                  key={s.stock_level}
                  className={`border-b border-ink-100 ${isRecommended ? "bg-saathi-50/70 border-l-2 border-l-saathi-500" : ""}`}
                >
                  <td className="py-2.5 pl-2 font-semibold tabular-nums-all">
                    <span className={isRecommended ? "text-saathi-700" : "text-ink-700"}>{s.stock_level}</span>
                    {isRecommended && (
                      <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wide text-saathi-600 font-semibold">
                        {t("compare_best")}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-ink-700 tabular-nums-all">{rupee(s.expected_profit)}</td>
                  <td className="py-2.5 text-ink-700 tabular-nums-all">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${riskColor(wastePct)}`} />
                      {wastePct.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2.5 text-ink-700 tabular-nums-all">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${riskColor(stockoutPct)}`} />
                      {stockoutPct.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3">
        <div className="border border-ink-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-ink-800 tabular-nums-all">{below.stock_level} {t("survival_units")}</p>
          <p className="text-xs text-mesh-700 mt-0.5">↓ {t("compare_waste")} {wastePctOf(below).toFixed(0)}%</p>
          <p className="text-xs text-rose-600">↑ {t("compare_stockout")} {(below.stockout_probability * 100).toFixed(0)}%</p>
        </div>
        <div className="border-2 border-saathi-400 bg-saathi-50 rounded-lg p-3">
          <p className="text-sm font-semibold text-saathi-700 tabular-nums-all">{rec.stock_level} {t("survival_units")}</p>
          <p className="text-xs text-saathi-700 font-medium mt-0.5">{t("compare_best_balance")}</p>
        </div>
        <div className="border border-ink-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-ink-800 tabular-nums-all">{above.stock_level} {t("survival_units")}</p>
          <p className="text-xs text-rose-600 mt-0.5">↑ {t("compare_waste")} {wastePctOf(above).toFixed(0)}%</p>
          <p className="text-xs text-mesh-700">↓ {t("compare_stockout")} {(above.stockout_probability * 100).toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
}
