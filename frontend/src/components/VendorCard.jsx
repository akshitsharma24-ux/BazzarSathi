import { useLanguage } from "../i18n.jsx";

function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-ink-400 font-medium">{label}</span>
      <span className={`text-2xl sm:text-3xl font-display font-bold tabular-nums-all ${accent || "text-ink-900"}`}>
        {value}
      </span>
    </div>
  );
}

export default function VendorCard({ data }) {
  const { t } = useLanguage();
  if (!data) return null;

  const rupee = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-mesh-500" />
          <h2 className="text-lg font-display font-semibold text-ink-900">{t("dash_today_snapshot")}</h2>
        </div>
        <span className="text-sm text-ink-400 font-medium">{data.date}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
        <Stat label={t("dash_prepared")} value={data.units_prepared} />
        <Stat label={t("dash_sold")} value={data.units_sold} accent="text-mesh-600" />
        <Stat label={t("dash_unsold")} value={data.units_unsold} accent="text-rose-500" />
        <Stat label={t("dash_profit")} value={rupee(data.profit)} accent="text-saathi-700" />
      </div>

      <div className="mt-5 pt-4 border-t border-ink-100 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 text-sm">
        <div>
          <span className="text-ink-400 text-xs">{t("dash_revenue")}</span>
          <p className="font-semibold text-ink-800 mt-0.5 tabular-nums-all">{rupee(data.revenue)}</p>
        </div>
        <div>
          <span className="text-ink-400 text-xs">{t("dash_waste_loss")}</span>
          <p className="font-semibold text-rose-500 mt-0.5 tabular-nums-all">{rupee(data.waste_loss)}</p>
        </div>
        <div>
          <span className="text-ink-400 text-xs">{t("dash_rain_prob")}</span>
          <p className="font-semibold text-ink-800 mt-0.5 tabular-nums-all">
            {Math.round(data.rain_probability * 100)}%
          </p>
        </div>
        <div>
          <span className="text-ink-400 text-xs">{t("dash_conditions")}</span>
          <p className="font-semibold text-ink-800 mt-0.5">
            {data.weekend ? t("dash_weekend") : t("dash_weekday")}
            {data.local_event ? ` · ${t("dash_event")}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
