import { useEffect, useState } from "react";
import { getNeighborhoodInsights } from "../api/client.js";
import { useLanguage } from "../i18n.jsx";
import { RainIcon, CalendarIcon, EventIcon } from "./icons.jsx";

function ImpactRow({ icon: RowIcon, label, pct }) {
  const positive = pct >= 0;
  const magnitude = Math.min(Math.abs(pct), 100);
  return (
    <div className="flex items-center gap-3 py-2">
      <RowIcon className="w-4 h-4 text-ink-400 shrink-0" />
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

  if (!data) return <div className="h-24 rounded-lg skeleton-shimmer" />;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <p className="text-sm text-ink-500 max-w-md">{t("neighborhood_subtitle")}</p>
        <span className="shrink-0 text-xs font-semibold bg-mesh-50 text-mesh-700 border border-mesh-200 rounded-md px-2.5 py-1">
          {t("neighborhood_vendor_count", { n: data.vendor_count })}
        </span>
      </div>

      <div className="divide-y divide-ink-100">
        <ImpactRow icon={RainIcon} label={t("why_rain")} pct={data.rain_impact_pct} />
        <ImpactRow icon={CalendarIcon} label={t("why_weekend")} pct={data.weekend_impact_pct} />
        <ImpactRow icon={EventIcon} label={t("why_event")} pct={data.event_impact_pct} />
      </div>

      <p className="text-[11px] text-ink-400 mt-3">{t("neighborhood_disclaimer")}</p>
    </div>
  );
}
