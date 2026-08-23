import { useLanguage } from "../i18n.jsx";

const DRIVER_META = {
  rain_impact_pct: "why_rain",
  weekend_impact_pct: "why_weekend",
  event_impact_pct: "why_event",
  trend_impact_pct: "why_trend",
};

function DriverRow({ driverKey, pct, t }) {
  const labelKey = DRIVER_META[driverKey];
  if (!labelKey) return null;

  const positive = pct >= 0;
  const magnitude = Math.min(Math.abs(pct), 50); // 50% fills half the track either direction

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-24 sm:w-28 text-sm text-ink-700 shrink-0">{t(labelKey)}</span>
      <div className="relative flex-1 h-5">
        <div className="absolute inset-y-0 left-1/2 w-px bg-ink-300" />
        <div className="absolute inset-0 flex items-center">
          <div className="relative w-1/2 h-2.5">
            {!positive && (
              <div
                className="absolute right-0 h-full bg-mesh-500 rounded-l-sm origin-right animate-grow-x"
                style={{ width: `${(magnitude / 50) * 100}%` }}
              />
            )}
          </div>
          <div className="relative w-1/2 h-2.5">
            {positive && (
              <div
                className="absolute left-0 h-full bg-saathi-500 rounded-r-sm origin-left animate-grow-x"
                style={{ width: `${(magnitude / 50) * 100}%` }}
              />
            )}
          </div>
        </div>
      </div>
      <span className={`w-14 text-right text-sm font-semibold tabular-nums-all shrink-0 ${positive ? "text-saathi-700" : "text-mesh-700"}`}>
        {positive ? "+" : ""}{pct}%
      </span>
    </div>
  );
}

export default function WhyExplainer({ why, riskModeLabel }) {
  const { t } = useLanguage();
  if (!why) return null;

  return (
    <div>
      <div className="divide-y divide-ink-100">
        {Object.entries(why).map(([key, pct]) => (
          <DriverRow key={key} driverKey={key} pct={pct} t={t} />
        ))}
      </div>
      {riskModeLabel && (
        <div className="mt-2 pt-3 border-t border-ink-200 flex items-center justify-between text-sm">
          <span className="text-ink-600">{t("why_risk_mode")}</span>
          <span className="font-semibold text-ink-800">{riskModeLabel}</span>
        </div>
      )}
    </div>
  );
}
