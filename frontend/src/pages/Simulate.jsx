import { useState } from "react";
import { postSimulate } from "../api/client.js";
import { fetchTomorrowWeather } from "../utils/weather.js";
import SimulateButton from "../components/SimulateButton.jsx";
import SimulationSummary from "../components/SimulationSummary.jsx";
import DemandChart from "../components/DemandChart.jsx";
import SurvivalStockCard from "../components/SurvivalStockCard.jsx";
import StockComparisonTable from "../components/StockComparisonTable.jsx";
import RiskPersonalityToggle from "../components/RiskPersonalityToggle.jsx";
import WhyExplainer from "../components/WhyExplainer.jsx";
import SavingsCalculator from "../components/SavingsCalculator.jsx";
import BazaarMeshCard from "../components/BazaarMeshCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { useLanguage } from "../i18n.jsx";
import { RainIcon, ThermometerIcon, EventIcon, CloudIcon } from "../components/icons.jsx";

const RISK_LABEL_KEYS = {
  protect_cash: "risk_protect_cash",
  balanced: "risk_balanced",
  maximize_sales: "risk_maximize_sales",
};

export default function Simulate() {
  const { t } = useLanguage();
  const [rainProbability, setRainProbability] = useState(0.3);
  const [temperature, setTemperature] = useState(30);
  const [localEvent, setLocalEvent] = useState(false);
  const [riskMode, setRiskMode] = useState("balanced");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSimulated, setHasSimulated] = useState(false);

  const [weatherState, setWeatherState] = useState("idle"); // idle | loading | done | error
  const [weatherDate, setWeatherDate] = useState(null);

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

  async function runSimulation(mode = riskMode) {
    setLoading(true);
    setError(null);
    try {
      const data = await postSimulate({ rainProbability, temperature, localEvent, riskMode: mode });
      setResult(data);
      setHasSimulated(true);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900">{t("sim_title")}</h1>
        <p className="text-ink-500 mt-1">{t("sim_subtitle")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 space-y-6 animate-fade-up">
        <div className="flex items-center justify-between flex-wrap gap-2 -mb-2">
          <button
            onClick={useRealWeather}
            disabled={weatherState === "loading"}
            className="flex items-center gap-2 text-sm font-medium text-mesh-700 bg-mesh-50 hover:bg-mesh-100 border border-mesh-200 disabled:opacity-60 px-3.5 py-2 rounded-xl transition-all hover:-translate-y-0.5"
          >
            {weatherState === "loading" ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-mesh-300 border-t-mesh-700 rounded-full animate-spin" />
            ) : (
              <CloudIcon className="w-4 h-4" />
            )}
            {t("sim_use_real_weather")}
          </button>
          {weatherState === "done" && weatherDate && (
            <span className="text-xs text-ink-400">{t("sim_weather_source", { date: weatherDate })}</span>
          )}
          {weatherState === "error" && (
            <span className="text-xs text-rose-500">{t("sim_weather_error")}</span>
          )}
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className="font-medium text-ink-700 flex items-center gap-1.5">
              <RainIcon className="w-4 h-4 text-ink-400" /> {t("sim_rain_prob")}
            </label>
            <span className="text-ink-500 font-semibold tabular-nums-all">{rainPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
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
            <span className="text-ink-500 font-semibold tabular-nums-all">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="15"
            max="42"
            step="1"
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
            className={`relative w-12 h-6 rounded-full transition ${localEvent ? "bg-saathi-600" : "bg-ink-200"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                localEvent ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        <SimulateButton onClick={() => runSimulation()} loading={loading} />
      </div>

      {error && <ErrorState message={error} onRetry={() => runSimulation()} />}

      {result && (
        <>
          <SimulationSummary distribution={result.demand_distribution} />
          <RiskPersonalityToggle value={riskMode} onChange={handleRiskChange} disabled={loading} />
          <SurvivalStockCard result={result} />
          <StockComparisonTable
            stockLevelStats={result.stock_level_stats}
            recommendedStock={result.recommended_stock}
          />
          <DemandChart distribution={result.demand_distribution} recommendedStock={result.recommended_stock} />
          <WhyExplainer why={result.why_breakdown} riskModeLabel={t(RISK_LABEL_KEYS[result.risk_mode])} />
          <SavingsCalculator savings={result.savings} />
          <BazaarMeshCard result={result} />

          <p className="text-center text-sm text-ink-400 italic pt-2 pb-4 max-w-md mx-auto leading-relaxed">
            {t("sim_closing_line")}
          </p>
        </>
      )}
    </div>
  );
}
