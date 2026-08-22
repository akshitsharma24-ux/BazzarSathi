import { useLanguage } from "../i18n.jsx";

const DRIVER_META = {
  rain_impact_pct: { labelKey: "why_rain", icon: "🌧️" },
  weekend_impact_pct: { labelKey: "why_weekend", icon: "📅" },
  event_impact_pct: { labelKey: "why_event", icon: "🎪" },
  trend_impact_pct: { labelKey: "why_trend", icon: "📈" },
};

function DriverRow({ driverKey, pct, t }) {
  const meta = DRIVER_META[driverKey];
  if (!meta) return null;

  const positive = pct >= 0;
  const magnitude = Math.min(Math.abs(pct), 100);

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="text-xl w-7 text-center shrink-0" aria-hidden="true">{meta.icon}</span>
      <span className="w-24 sm:w-28 text-sm text-ink-600 shrink-0">{t(meta.labelKey)}</span>
      <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${positive ? "bg-saathi-500" : "bg-mesh-500"}`}
          style={{ width: `${magnitude}%` }}
        />
      </div>
      <span
        className={`w-16 text-right text-sm font-semibold tabular-nums-all shrink-0 ${
          positive ? "text-saathi-700" : "text-mesh-600"
        }`}
      >
        {positive ? "+" : ""}
        {pct}%
      </span>
    </div>
  );
}

export default function WhyExplainer({ why, riskModeLabel }) {
  const { t } = useLanguage();
  if (!why) return null;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 animate-fade-up">
      <h3 className="font-display font-semibold text-ink-900 mb-1">{t("why_title")}</h3>
      <p className="text-sm text-ink-500 mb-1">{t("why_subtitle")}</p>
      <div className="divide-y divide-ink-50">
        {Object.entries(why).map(([key, pct]) => (
          <DriverRow key={key} driverKey={key} pct={pct} t={t} />
        ))}
      </div>
      {riskModeLabel && (
        <div className="mt-2 pt-3 border-t border-ink-100 flex items-center justify-between text-sm">
          <span className="text-ink-500">💰 {t("why_risk_mode")}</span>
          <span className="font-semibold text-ink-800">{riskModeLabel}</span>
        </div>
      )}
    </div>
  );
}
