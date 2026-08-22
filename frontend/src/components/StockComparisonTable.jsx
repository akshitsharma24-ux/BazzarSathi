import { useLanguage } from "../i18n.jsx";

const WINDOW_STEPS = 3; // show recommended level +/- 3 steps (5 units each)

function riskColor(pct) {
  if (pct < 15) return "bg-emerald-400";
  if (pct < 40) return "bg-amber-400";
  return "bg-rose-400";
}

export default function StockComparisonTable({ stockLevelStats, recommendedStock }) {
  const { t } = useLanguage();
  if (!stockLevelStats || stockLevelStats.length === 0) return null;

  const recIndex = stockLevelStats.findIndex((s) => s.stock_level === recommendedStock);
  const start = Math.max(0, recIndex - WINDOW_STEPS);
  const end = Math.min(stockLevelStats.length, recIndex + WINDOW_STEPS + 1);
  const rows = stockLevelStats.slice(start, end);
  const maxProfit = Math.max(...rows.map((r) => r.expected_profit));

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-4 sm:p-7 animate-fade-up">
      <h3 className="font-display font-semibold text-ink-900 mb-1">{t("compare_title")}</h3>
      <p className="text-sm text-ink-500 mb-4">{t("compare_subtitle")}</p>

      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="text-left text-ink-400 text-[10px] sm:text-[11px] uppercase tracking-wide">
            <th className="py-2 font-medium w-1/4">{t("compare_stock")}</th>
            <th className="py-2 font-medium w-1/4">{t("compare_profit")}</th>
            <th className="py-2 font-medium w-1/4">{t("compare_waste")}</th>
            <th className="py-2 font-medium w-1/4">{t("compare_stockout")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const isRecommended = s.stock_level === recommendedStock;
            const wastePct = s.stock_level > 0 ? (s.expected_waste_units / s.stock_level) * 100 : 0;
            const stockoutPct = s.stockout_probability * 100;
            const profitBarPct = maxProfit ? (s.expected_profit / maxProfit) * 100 : 0;

            return (
              <tr
                key={s.stock_level}
                className={`border-t border-ink-100 transition-colors ${isRecommended ? "bg-saathi-50" : ""}`}
              >
                <td className="py-2.5 font-semibold">
                  <span className={isRecommended ? "text-saathi-700" : "text-ink-700"}>
                    {s.stock_level}
                  </span>
                  {isRecommended && (
                    <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wide bg-saathi-600 text-white rounded-full px-2 py-0.5 align-middle font-semibold">
                      {t("compare_best")}
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-ink-700 tabular-nums-all">
                  <div className="flex flex-col gap-1">
                    <span>{rupee(s.expected_profit)}</span>
                    <span className="hidden sm:block h-1 rounded-full bg-ink-100 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-mesh-500"
                        style={{ width: `${profitBarPct}%` }}
                      />
                    </span>
                  </div>
                </td>
                <td className="py-2.5 text-ink-700 tabular-nums-all">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskColor(wastePct)}`} />
                    {wastePct.toFixed(0)}%
                  </div>
                </td>
                <td className="py-2.5 text-ink-700 tabular-nums-all">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskColor(stockoutPct)}`} />
                    {stockoutPct.toFixed(0)}%
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
