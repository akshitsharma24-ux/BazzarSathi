import { useEffect, useRef, useState } from "react";
import { postSimulate, getForecast } from "../api/client.js";
import { fetchTomorrowWeather } from "../utils/weather.js";
import DecisionHero from "../components/DecisionHero.jsx";
import DemandChart from "../components/DemandChart.jsx";
import StockComparisonTable from "../components/StockComparisonTable.jsx";
import RiskPersonalityToggle from "../components/RiskPersonalityToggle.jsx";
import WhyExplainer from "../components/WhyExplainer.jsx";
import SavingsCalculator from "../components/SavingsCalculator.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { Surface, PageHeader, SectionHeader, PrimaryButton, SecondaryButton } from "../components/ui.jsx";
import { useLanguage } from "../i18n.jsx";
import { RainIcon, ThermometerIcon, EventIcon, CloudIcon, MeshIcon, DiceIcon } from "../components/icons.jsx";
import { getDistributionStats } from "../utils/stats.js";

const PRESETS = {
  normal: { rainProbability: 0.2, temperature: 30, localEvent: false },
  rain: { rainProbability: 0.85, temperature: 25, localEvent: false },
  festival: { rainProbability: 0.15, temperature: 30, localEvent: true },
};

export default function Simulate({ onSimulated, onGoToNetwork }) {
  const { t } = useLanguage();
  const [rainProbability, setRainProbability] = useState(0.3);
  const [temperature, setTemperature] = useState(30);
  const [localEvent, setLocalEvent] = useState(false);

  const [preview, setPreview] = useState(null);
  const previewTimer = useRef(null);

  const [riskMode, setRiskMode] = useState("balanced");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSimulated, setHasSimulated] = useState(false);

  const [weatherState, setWeatherState] = useState("idle");
  const [weatherDate, setWeatherDate] = useState(null);

  useEffect(() => {
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      getForecast({ rainProbability, temperature, localEvent }).then(setPreview).catch(() => {});
    }, 350);
    return () => clearTimeout(previewTimer.current);
  }, [rainProbability, temperature, localEvent]);

  async function useRealWeather() {
    setWeatherState("loading");
    try {
      const weather = await fetchTomorrowWeather();
      setRainProbability(weather.rainProbability);
      setTemperature(weather.temperature);
      setWeatherDate(weather.date);
      setWeatherState("done");
    } catch {
      setWeatherState("error");
    }
  }

  function applyPreset(key) {
    const p = PRESETS[key];
    setRainProbability(p.rainProbability);
    setTemperature(p.temperature);
    setLocalEvent(p.localEvent);
    setWeatherState("idle");
  }

  async function runSimulation(mode = riskMode) {
    setLoading(true);
    setError(null);
    try {
      const data = await postSimulate({ rainProbability, temperature, localEvent, riskMode: mode });
      setResult(data);
      setHasSimulated(true);
      onSimulated?.(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleRiskChange(mode) {
    setRiskMode(mode);
    if (hasSimulated) runSimulation(mode);
  }

  const rainPct = Math.round(rainProbability * 100);
  const tempPct = Math.round(((temperature - 15) / (42 - 15)) * 100);
  const expectedDemand = result
    ? getDistributionStats(result.demand_distribution).mostLikely
    : preview?.predicted_units_sold ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader title={t("sim_title")} subtitle={t("sim_subtitle")} />

      {/* Scenario + preview workspace */}
      <div className="grid lg:grid-cols-[5fr_7fr] gap-4">
        <Surface className="shadow-card p-5 sm:p-6">
          <SectionHeader title={t("scenario_title")} />

          <button
            onClick={useRealWeather}
            disabled={weatherState === "loading"}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-mesh-700 bg-mesh-50 hover:bg-mesh-100 border border-mesh-200 disabled:opacity-60 px-3.5 py-2.5 rounded-[8px] transition-colors mb-5"
          >
            {weatherState === "loading" ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-mesh-300 border-t-mesh-700 rounded-full animate-spin" />
            ) : (
              <CloudIcon className="w-4 h-4" />
            )}
            {t("sim_use_real_weather")}
          </button>
          {weatherState === "done" && weatherDate && (
            <p className="text-xs text-ink-500 -mt-4 mb-4">{t("sim_weather_source", { date: weatherDate })}</p>
          )}
          {weatherState === "error" && (
            <p className="text-xs text-rose-600 -mt-4 mb-4">{t("sim_weather_error")}</p>
          )}

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="font-medium text-ink-700 flex items-center gap-1.5">
                  <RainIcon className="w-4 h-4 text-ink-400" /> {t("sim_rain_prob")}
                </label>
                <span className="text-ink-600 font-semibold tabular-nums-all">{rainPct}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={rainProbability}
                onChange={(e) => setRainProbability(parseFloat(e.target.value))}
                style={{ "--range-pct": rainPct }}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <label className="font-medium text-ink-700 flex items-center gap-1.5">
                  <ThermometerIcon className="w-4 h-4 text-ink-400" /> {t("sim_temperature")}
                </label>
                <span className="text-ink-600 font-semibold tabular-nums-all">{temperature}°C</span>
              </div>
              <input
                type="range" min="15" max="42" step="1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ "--range-pct": tempPct }}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium text-ink-700 text-sm flex items-center gap-1.5">
                <EventIcon className="w-4 h-4 text-ink-400" /> {t("sim_local_event")}
              </label>
              <button
                onClick={() => setLocalEvent((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors ${localEvent ? "bg-saathi-500" : "bg-ink-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${localEvent ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-ink-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">{t("presets_label")}</p>
            <div className="flex flex-wrap gap-2">
              <SecondaryButton className="text-xs px-3 py-1.5" onClick={() => applyPreset("normal")}>{t("preset_normal")}</SecondaryButton>
              <SecondaryButton className="text-xs px-3 py-1.5" onClick={() => applyPreset("rain")}>{t("preset_rain")}</SecondaryButton>
              <SecondaryButton className="text-xs px-3 py-1.5" onClick={() => applyPreset("festival")}>{t("preset_festival")}</SecondaryButton>
            </div>
          </div>

          <PrimaryButton onClick={() => runSimulation()} disabled={loading} className="w-full mt-5 py-3">
            {loading ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                {t("sim_button_loading")}
              </>
            ) : (
              <>
                <DiceIcon className="w-4 h-4" />
                {t("sim_button")}
              </>
            )}
          </PrimaryButton>
        </Surface>

        <div className="rounded-xl shadow-card p-5 sm:p-6 bg-ink-900 border border-ink-900 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-300 mb-4">{t("preview_title")}</p>
          <div className="flex items-center gap-6 flex-wrap text-sm mb-6">
            <span className="text-ink-300">{t("dash_rain_prob")} <b className="text-white">{rainPct}%</b></span>
            <span className="text-ink-300">{t("sim_temperature")} <b className="text-white">{temperature}°C</b></span>
            <span className="text-ink-300">{t("dash_event")} <b className="text-white">{localEvent ? "Yes" : "No"}</b></span>
          </div>
          <p className="text-xs uppercase tracking-wider text-saathi-300 font-semibold">{t("forecast_predicted")}</p>
          <p className="text-6xl font-display font-extrabold tabular-nums-all mt-1">
            {preview ? `~${Math.round(preview.predicted_units_sold)}` : "—"}
          </p>
          <p className="text-xs text-ink-400 mt-4 max-w-xs">{t("forecast_subtitle")}</p>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={() => runSimulation()} />}

      {result && (
        <div className="space-y-8">
          <DecisionHero result={result} expectedDemand={expectedDemand} />

          <RiskPersonalityToggle value={riskMode} onChange={handleRiskChange} disabled={loading} />

          <div>
            <SectionHeader title={t("section_futures_title")} subtitle={t("section_futures_subtitle")} />
            <Surface className="shadow-card p-5 sm:p-6">
              <DemandChart
                distribution={result.demand_distribution}
                recommendedStock={result.recommended_stock}
                forecast={preview?.predicted_units_sold}
              />
            </Surface>
          </div>

          <div>
            <SectionHeader title={t("section_tradeoff_title", { n: result.recommended_stock })} />
            <Surface className="shadow-card p-5 sm:p-6">
              <StockComparisonTable stockLevelStats={result.stock_level_stats} recommendedStock={result.recommended_stock} />
            </Surface>
          </div>

          <div>
            <SectionHeader title={t("section_why_title")} />
            <Surface className="shadow-card p-5 sm:p-6">
              <WhyExplainer why={result.why_breakdown} riskModeLabel={t({ protect_cash: "risk_protect_cash", balanced: "risk_balanced", maximize_sales: "risk_maximize_sales" }[result.risk_mode])} />
            </Surface>
          </div>

          <div>
            <SectionHeader title={t("savings_title")} />
            <Surface className="shadow-card p-5 sm:p-6">
              <SavingsCalculator savings={result.savings} />
            </Surface>
          </div>

          {onGoToNetwork && (
            <button
              onClick={onGoToNetwork}
              className="w-full flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800 text-white font-display font-semibold px-5 py-3.5 rounded-[10px] transition-colors"
            >
              <MeshIcon className="w-4 h-4" />
              {t("sim_check_network_cta")} →
            </button>
          )}

          <p className="text-center text-sm text-ink-500 italic pt-2 pb-4 max-w-md mx-auto leading-relaxed">
            {t("sim_closing_line")}
          </p>
        </div>
      )}
    </div>
  );
}
