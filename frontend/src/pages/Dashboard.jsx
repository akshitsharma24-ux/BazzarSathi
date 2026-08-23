import { useEffect, useState } from "react";
import { getDashboard, getForecast, getModelInfo } from "../api/client.js";
import SalesTrendChart from "../components/SalesTrendChart.jsx";
import VoiceLogger from "../components/VoiceLogger.jsx";
import BillScannerCard from "../components/BillScannerCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { Surface, PageHeader, Metric, PrimaryButton, SectionHeader } from "../components/ui.jsx";
import { useLanguage } from "../i18n.jsx";

const DEFAULT_CONDITIONS = { rainProbability: 0.3, temperature: 30, localEvent: false };

export default function Dashboard({ onGoToSimulate }) {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  function load() {
    setLoading(true);
    setError(null);
    getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    getForecast(DEFAULT_CONDITIONS).then(setForecast).catch(() => {});
    getModelInfo().then(setModelInfo).catch(() => {});
  }

  useEffect(load, []);

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-10">
      <PageHeader title={t("dash_title")} subtitle={t("dash_subtitle")} />

      {loading && <div className="h-40 rounded-xl skeleton-shimmer" />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && data && (
        <>
          {/* Hero decision strip */}
          <Surface className="shadow-card overflow-hidden">
            <div className="grid sm:grid-cols-[1.2fr_1fr_auto] divide-y sm:divide-y-0 sm:divide-x divide-ink-200">
              <div className="p-5 sm:p-6">
                <Metric
                  label={t("forecast_title")}
                  value={forecast ? Math.round(forecast.predicted_units_sold) : "—"}
                  sublabel={t("forecast_predicted")}
                  size="lg"
                  accent="text-ink-900"
                />
                <p className="text-xs text-ink-500 mt-3 leading-relaxed max-w-xs">
                  {t("forecast_conditions_note")}
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-2">
                  {t("model_accuracy")}
                </p>
                {modelInfo ? (
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-ink-500">{t("model_r2")}</span><span className="font-semibold text-ink-800 tabular-nums-all">{modelInfo.r2}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">{t("model_mae")}</span><span className="font-semibold text-ink-800 tabular-nums-all">{modelInfo.mae}</span></div>
                    <div className="flex justify-between"><span className="text-ink-500">{t("model_rmse")}</span><span className="font-semibold text-ink-800 tabular-nums-all">{modelInfo.rmse}</span></div>
                    <p className="text-xs text-ink-500 pt-1">{t("model_trained_on", { n: modelInfo.trained_rows })}</p>
                  </div>
                ) : (
                  <div className="h-16 rounded-lg skeleton-shimmer" />
                )}
              </div>

              <div className="p-5 sm:p-6 flex items-center justify-center bg-ink-50/60">
                <PrimaryButton onClick={onGoToSimulate} className="w-full sm:w-auto px-5 py-3">
                  {t("dash_cta_button")} →
                </PrimaryButton>
              </div>
            </div>
          </Surface>

          {/* Today / yesterday metric strip */}
          <div>
            <SectionHeader title={t("dash_today_snapshot")} subtitle={data.date} />
            <Surface className="shadow-card p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-ink-200">
                <div className="pr-4"><Metric label={t("dash_prepared")} value={data.units_prepared} size="sm" /></div>
                <div className="px-4"><Metric label={t("dash_sold")} value={data.units_sold} size="sm" accent="text-mesh-700" /></div>
                <div className="px-4 mt-4 sm:mt-0"><Metric label={t("dash_unsold")} value={data.units_unsold} size="sm" accent="text-rose-600" /></div>
                <div className="pl-4 mt-4 sm:mt-0"><Metric label={t("dash_profit")} value={rupee(data.profit)} size="sm" accent="text-saathi-600" /></div>
              </div>
              <div className="mt-4 pt-4 border-t border-ink-200 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-600">
                <span>{t("dash_revenue")}: <b className="text-ink-800 tabular-nums-all">{rupee(data.revenue)}</b></span>
                <span>{t("dash_waste_loss")}: <b className="text-rose-600 tabular-nums-all">{rupee(data.waste_loss)}</b></span>
                <span>{t("dash_rain_prob")}: <b className="text-ink-800 tabular-nums-all">{Math.round(data.rain_probability * 100)}%</b></span>
                <span>{t("dash_conditions")}: <b className="text-ink-800">{data.weekend ? t("dash_weekend") : t("dash_weekday")}{data.local_event ? ` · ${t("dash_event")}` : ""}</b></span>
              </div>
            </Surface>
          </div>

          {/* Sales trend: chart + context */}
          <div>
            <SectionHeader title={t("trend_section_title")} />
            <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
              <Surface className="shadow-card p-5 sm:p-6">
                <SalesTrendChart />
              </Surface>
              <Surface className="shadow-card p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-3">
                  {t("trend_context_title")}
                </p>
                <ul className="space-y-2.5 text-sm text-ink-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mesh-500 mt-1.5 shrink-0" />
                    {t("trend_context_weekend")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-saathi-500 mt-1.5 shrink-0" />
                    {t("trend_context_rain")}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mesh-500 mt-1.5 shrink-0" />
                    {t("trend_context_event")}
                  </li>
                </ul>
              </Surface>
            </div>
          </div>

          {/* Quick log */}
          <div>
            <SectionHeader title={t("quicklog_title")} subtitle={t("quicklog_subtitle")} />
            <div className="grid sm:grid-cols-2 gap-4">
              <VoiceLogger />
              <BillScannerCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
