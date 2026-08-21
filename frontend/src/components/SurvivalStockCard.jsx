function RiskBadge({ label, pct, tone }) {
  const tones = {
    good: "bg-green-50 text-green-700 border-green-200",
    warn: "bg-amber-50 text-amber-700 border-amber-200",
    bad: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <div className={`rounded-lg border px-3 py-2 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-lg font-bold">{pct}</p>
    </div>
  );
}

function riskTone(prob) {
  if (prob < 0.15) return "good";
  if (prob < 0.4) return "warn";
  return "bad";
}

export default function SurvivalStockCard({ result }) {
  if (!result) return null;

  const rupee = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">Recommended Survival Stock</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-5xl font-extrabold text-saathi-700">
          {result.recommended_stock}
        </span>
        <span className="text-gray-400 font-medium">units</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        <RiskBadge label="Expected profit" pct={rupee(result.expected_profit)} tone="good" />
        <RiskBadge
          label="Waste risk"
          pct={rupee(result.expected_waste_cost)}
          tone={riskTone(result.expected_waste_cost / (result.expected_profit || 1) > 0.3 ? 0.5 : 0.1)}
        />
        <RiskBadge
          label="Stockout risk"
          pct={`${Math.round(result.stockout_probability * 100)}%`}
          tone={riskTone(result.stockout_probability)}
        />
      </div>
    </div>
  );
}
