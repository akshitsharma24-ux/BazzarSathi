export default function SavingsCalculator({ savings }) {
  if (!savings) return null;

  const rupee = (n) =>
    `₹${Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const dailyGain = savings.daily_waste_cost_avoided > 0
    ? savings.daily_waste_cost_avoided
    : savings.daily_profit_gain;

  const isPositive = dailyGain >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Savings vs. guessing</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Naive stocking (raw forecast)
          </p>
          <p className="text-2xl font-bold text-gray-700 mt-1">
            {savings.naive_stock} <span className="text-sm font-medium text-gray-400">units</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Waste cost: {rupee(savings.naive_expected_waste_cost)}
          </p>
        </div>

        <div className="rounded-lg bg-saathi-50 border border-saathi-100 p-4">
          <p className="text-xs uppercase tracking-wide text-saathi-600">
            Survival Stock recommendation
          </p>
          <p className="text-2xl font-bold text-saathi-700 mt-1">
            {savings.recommended_stock} <span className="text-sm font-medium text-saathi-500">units</span>
          </p>
          <p className="text-xs text-saathi-700/80 mt-2">
            Waste cost: {rupee(savings.recommended_expected_waste_cost)}
          </p>
        </div>
      </div>

      <div className={`mt-4 rounded-lg border p-4 flex items-center justify-between ${
        isPositive ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
      }`}>
        <div>
          <p className="text-sm text-gray-600">Estimated projected monthly savings</p>
          <p className={`text-2xl font-bold ${isPositive ? "text-green-700" : "text-gray-600"}`}>
            {rupee(savings.projected_monthly_savings)}
          </p>
        </div>
        <span className="text-3xl">{isPositive ? "💰" : "📊"}</span>
      </div>
    </div>
  );
}
