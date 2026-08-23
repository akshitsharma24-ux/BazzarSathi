import { useLanguage } from "../i18n.jsx";
import { useCountUp } from "../hooks/useCountUp.js";

export default function SavingsCalculator({ savings }) {
  const { t } = useLanguage();
  const monthlyDisplay = useCountUp(savings?.projected_monthly_savings ?? 0, { duration: 500 });
  if (!savings) return null;

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const dailyGain =
    savings.daily_waste_cost_avoided > 0 ? savings.daily_waste_cost_avoided : savings.daily_profit_gain;
  const isPositive = dailyGain >= 0;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{t("savings_naive")}</p>
          <p className="text-lg font-display font-bold text-ink-800 tabular-nums-all mt-1">
            {savings.naive_stock} <span className="text-sm font-medium text-ink-400">{t("survival_units")}</span>
          </p>
          <p className="text-sm text-ink-600 mt-1">
            {t("savings_waste_cost")}: <b className="text-rose-600 tabular-nums-all">{rupee(savings.naive_expected_waste_cost)}</b>
          </p>
        </div>
        <div className="border-l border-ink-200 pl-4 sm:pl-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-saathi-600">{t("appName")}</p>
          <p className="text-lg font-display font-bold text-saathi-700 tabular-nums-all mt-1">
            {savings.recommended_stock} <span className="text-sm font-medium text-saathi-500">{t("survival_units")}</span>
          </p>
          <p className="text-sm text-ink-600 mt-1">
            {t("savings_waste_cost")}: <b className="text-mesh-700 tabular-nums-all">{rupee(savings.recommended_expected_waste_cost)}</b>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-ink-200" />
        <span className="text-ink-400 text-sm">↓</span>
        <div className="flex-1 h-px bg-ink-200" />
      </div>

      <div
        className={`rounded-lg p-4 sm:p-5 flex items-center justify-between ${
          isPositive ? "bg-mesh-50 border border-mesh-200" : "bg-ink-50 border border-ink-200"
        }`}
      >
        <div>
          <p className="text-sm text-ink-600">{t("savings_monthly")}</p>
          <p className={`text-2xl sm:text-3xl font-display font-bold tabular-nums-all ${isPositive ? "text-mesh-700" : "text-ink-700"}`}>
            {rupee(monthlyDisplay)}
          </p>
        </div>
      </div>

      <p className="text-xs text-ink-500 mt-3">{t("savings_disclaimer")}</p>
    </div>
  );
}
