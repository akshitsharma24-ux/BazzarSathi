import { useEffect, useState } from "react";
import { getNeighborhoodInsights } from "../api/client.js";
import { useLanguage } from "../i18n.jsx";

function ImpactRow({ icon, label, pct }) {
  const positive = pct >= 0;
  const magnitude = Math.min(Math.abs(pct), 100);
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-lg w-6 text-center shrink-0" aria-hidden="true">{icon}</span>
      <span className="w-20 text-sm text-ink-600 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${positive ? "bg-mesh-500" : "bg-saathi-500"}`}
          style={{ width: `${magnitude}%` }}
        />
      </div>
      <span className={`w-14 text-right text-sm font-semibold tabular-nums-all shrink-0 ${
        positive ? "text-mesh-600" : "text-saathi-700"
      }`}>
        {positive ? "+" : ""}{pct}%
      </span>
    </div>
  );
}

export default function BazaarIntelligenceCard() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);

  useEffect(() => {
    getNeighborhoodInsights().then(setData).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 animate-fade-up">
        <div className="h-24 rounded-lg skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-mesh-100 p-5 sm:p-7 animate-fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-ink-900 flex items-center gap-1.5">
            <span aria-hidden="true">🧭</span> {t("neighborhood_title")}
          </h3>
          <p className="text-sm text-ink-500 mt-0.5 max-w-md">{t("neighborhood_subtitle")}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold bg-mesh-50 text-mesh-700 border border-mesh-200 rounded-full px-3 py-1">
          {t("neighborhood_vendor_count", { n: data.vendor_count })}
        </span>
      </div>

      <div className="mt-4 divide-y divide-ink-50">
        <ImpactRow icon="🌧️" label={t("why_rain")} pct={data.rain_impact_pct} />
        <ImpactRow icon="📅" label={t("why_weekend")} pct={data.weekend_impact_pct} />
        <ImpactRow icon="🎪" label={t("why_event")} pct={data.event_impact_pct} />
      </div>

      {data.vendors?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-ink-100">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 mb-1.5">
            {t("neighborhood_based_on")}
          </p>
          <p className="text-xs text-ink-500 leading-relaxed">
            {data.vendors.map((v) => `${v.name} (${v.item})`).join(" · ")}
          </p>
        </div>
      )}

      <p className="text-[11px] text-ink-400 mt-3">{t("neighborhood_disclaimer")}</p>
    </div>
  );
}
