import { useEffect, useState } from "react";
import { getForecast, getModelInfo } from "../api/client.js";
import { useLanguage } from "../i18n.jsx";

const DEFAULT_CONDITIONS = { rainProbability: 0.3, temperature: 30, localEvent: false };

export default function ForecastCard() {
  const { t } = useLanguage();
  const [forecast, setForecast] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    getForecast(DEFAULT_CONDITIONS).then(setForecast).catch(() => {});
    getModelInfo().then(setModelInfo).catch(() => {});
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-ink-100 p-5 sm:p-7 animate-fade-up transition-shadow duration-300">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-ink-900">{t("forecast_title")}</h3>
          <p className="text-sm text-ink-500 mt-0.5 max-w-sm">{t("forecast_subtitle")}</p>
        </div>

        {forecast ? (
          <div className="text-right shrink-0">
            <span className="text-4xl sm:text-5xl font-display font-extrabold text-mesh-700 tabular-nums-all">
              {Math.round(forecast.predicted_units_sold)}
            </span>
            <p className="text-xs text-ink-400 font-medium">{t("forecast_predicted")}</p>
          </div>
        ) : (
          <div className="h-12 w-24 rounded-lg skeleton-shimmer" />
        )}
      </div>

      <p className="text-xs text-ink-400 mt-3 leading-relaxed">{t("forecast_conditions_note")}</p>

      {modelInfo && (
        <div className="mt-5 pt-4 border-t border-ink-100 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
            {t("model_accuracy")}
          </span>
          <span className="text-sm text-ink-700">
            {t("model_mae")} <b className="tabular-nums-all">{modelInfo.mae}</b>
          </span>
          <span className="text-sm text-ink-700">
            {t("model_rmse")} <b className="tabular-nums-all">{modelInfo.rmse}</b>
          </span>
          <span className="text-sm text-ink-700">
            {t("model_r2")} <b className="tabular-nums-all">{modelInfo.r2}</b>
          </span>
          <span className="text-xs text-ink-400">
            {t("model_trained_on", { n: modelInfo.trained_rows })}
          </span>
        </div>
      )}
    </div>
  );
}
