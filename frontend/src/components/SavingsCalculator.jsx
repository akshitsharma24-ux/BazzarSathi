import { useLanguage } from "../i18n.jsx";

export default function SavingsCalculator({ savings }) {
  const { t } = useLanguage();
  if (!savings) return null;

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const dailyGain =
    savings.daily_waste_cost_avoided > 0 ? savings.daily_waste_cost_avoided : savings.daily_profit_gain;
  const isPositive = dailyGain >= 0;

  const naiveWaste = savings.naive_expected_waste_cost;
  const recWaste = savings.recommended_expected_waste_cost;
  const maxWaste = Math.max(naiveWaste, recWaste, 1);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 animate-fade-up">
      <h3 className="font-display font-semibold text-ink-900 mb-4">{t("savings_title")}</h3>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl bg-ink-50 border border-ink-100 p-4">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium">{t("savings_naive")}</p>
          <p className="text-2xl font-display font-bold text-ink-700 mt-1 tabular-nums-all">
            {savings.naive_stock} <span className="text-sm font-medium text-ink-400">{t("survival_units")}</span>
          </p>
          <div className="h-1.5 rounded-full bg-ink-200 mt-3 overflow-hidden">
            <div className="h-full bg-rose-400 rounded-full" style={{ width: `${(naiveWaste / maxWaste) * 100}%` }} />
          </div>
          <p className="text-xs text-ink-500 mt-2 tabular-nums-all">
            {t("savings_waste_cost")}: {rupee(naiveWaste)}
          </p>
        </div>

        <div className="rounded-xl bg-saathi-50 border border-saathi-100 p-4">
          <p className="text-[11px] uppercase tracking-wide text-saathi-600 font-medium">
            {t("savings_recommended")}
          </p>
          <p className="text-2xl font-display font-bold text-saathi-700 mt-1 tabular-nums-all">
            {savings.recommended_stock} <span className="text-sm font-medium text-saathi-500">{t("survival_units")}</span>
          </p>
          <div className="h-1.5 rounded-full bg-saathi-200/60 mt-3 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(recWaste / maxWaste) * 100}%` }} />
          </div>
          <p className="text-xs text-saathi-700/80 mt-2 tabular-nums-all">
            {t("savings_waste_cost")}: {rupee(recWaste)}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl border p-4 sm:p-5 flex items-center justify-between ${
          isPositive ? "bg-emerald-50 border-emerald-200" : "bg-ink-50 border-ink-100"
        }`}
      >
        <div>
          <p className="text-sm text-ink-600">{t("savings_monthly")}</p>
          <p className={`text-2xl sm:text-3xl font-display font-bold tabular-nums-all ${isPositive ? "text-emerald-700" : "text-ink-600"}`}>
            {rupee(savings.projected_monthly_savings)}
          </p>
        </div>
        <span className="text-3xl" aria-hidden="true">{isPositive ? "💰" : "📊"}</span>
      </div>

      <p className="text-xs text-ink-400 mt-3">{t("savings_disclaimer")}</p>
    </div>
  );
}
