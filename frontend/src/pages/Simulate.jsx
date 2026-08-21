import { useState } from "react";
import { postSimulate } from "../api/client.js";
import SimulateButton from "../components/SimulateButton.jsx";
import DemandChart from "../components/DemandChart.jsx";
import SurvivalStockCard from "../components/SurvivalStockCard.jsx";
import StockComparisonTable from "../components/StockComparisonTable.jsx";
import RiskPersonalityToggle from "../components/RiskPersonalityToggle.jsx";
import WhyExplainer from "../components/WhyExplainer.jsx";
import SavingsCalculator from "../components/SavingsCalculator.jsx";
import BazaarMeshCard from "../components/BazaarMeshCard.jsx";
import ErrorState from "../components/ErrorState.jsx";

export default function Simulate() {
  const [rainProbability, setRainProbability] = useState(0.3);
  const [temperature, setTemperature] = useState(30);
  const [localEvent, setLocalEvent] = useState(false);
  const [riskMode, setRiskMode] = useState("balanced");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSimulated, setHasSimulated] = useState(false);

  async function runSimulation(mode = riskMode) {
    setLoading(true);
    setError(null);
    try {
      const data = await postSimulate({
        rainProbability,
        temperature,
        localEvent,
        riskMode: mode,
      });
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Simulate Tomorrow</h1>
        <p className="text-gray-500 mt-1">
          Set tomorrow's conditions, then run 500 simulated futures to get a Survival Stock recommendation.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Rain probability</label>
            <span className="text-gray-500">{Math.round(rainProbability * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={rainProbability}
            onChange={(e) => setRainProbability(parseFloat(e.target.value))}
            className="w-full accent-saathi-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <label className="font-medium text-gray-700">Temperature</label>
            <span className="text-gray-500">{temperature}°C</span>
          </div>
          <input
            type="range"
            min="15"
            max="42"
            step="1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-saathi-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="font-medium text-gray-700 text-sm">Local event tomorrow?</label>
          <button
            onClick={() => setLocalEvent((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition ${
              localEvent ? "bg-saathi-600" : "bg-gray-200"
            }`}
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
          <RiskPersonalityToggle value={riskMode} onChange={handleRiskChange} disabled={loading} />
          <SurvivalStockCard result={result} />
          <StockComparisonTable
            stockLevelStats={result.stock_level_stats}
            recommendedStock={result.recommended_stock}
          />
          <DemandChart
            distribution={result.demand_distribution}
            recommendedStock={result.recommended_stock}
          />
          <WhyExplainer why={result.why_breakdown} />
          <SavingsCalculator savings={result.savings} />
          <BazaarMeshCard result={result} />

          <p className="text-center text-sm text-gray-400 italic pt-2 pb-4">
            Prediction tells a vendor what may happen. BazaarSaathi helps them
            survive when the prediction is wrong.
          </p>
        </>
      )}
    </div>
  );
}
