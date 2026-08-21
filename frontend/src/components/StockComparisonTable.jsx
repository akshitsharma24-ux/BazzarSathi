const WINDOW_STEPS = 3; // show recommended level +/- 3 steps (5 units each)

export default function StockComparisonTable({ stockLevelStats, recommendedStock }) {
  if (!stockLevelStats || stockLevelStats.length === 0) return null;

  const recIndex = stockLevelStats.findIndex((s) => s.stock_level === recommendedStock);
  const start = Math.max(0, recIndex - WINDOW_STEPS);
  const end = Math.min(stockLevelStats.length, recIndex + WINDOW_STEPS + 1);
  const rows = stockLevelStats.slice(start, end);

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="font-semibold text-gray-800 mb-1">Compare nearby stock levels</h3>
      <p className="text-sm text-gray-500 mb-4">
        How profit, waste, and stockout risk trade off around the recommendation.
      </p>

      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="text-left text-gray-400 text-[11px] sm:text-xs uppercase tracking-wide">
            <th className="py-2 font-medium w-1/4">Stock</th>
            <th className="py-2 font-medium w-1/4">Profit</th>
            <th className="py-2 font-medium w-1/4">Waste</th>
            <th className="py-2 font-medium w-1/4">Stockout</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const isRecommended = s.stock_level === recommendedStock;
            const wastePct = s.stock_level > 0
              ? (s.expected_waste_units / s.stock_level) * 100
              : 0;
            const stockoutPct = s.stockout_probability * 100;

            return (
              <tr
                key={s.stock_level}
                className={`border-t border-gray-100 ${
                  isRecommended ? "bg-saathi-50" : ""
                }`}
              >
                <td className="py-2.5 font-semibold">
                  <span className={isRecommended ? "text-saathi-700" : "text-gray-700"}>
                    {s.stock_level}
                  </span>
                  {isRecommended && (
                    <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wide bg-saathi-600 text-white rounded-full px-2 py-0.5 align-middle">
                      Best
                    </span>
                  )}
                </td>
                <td className="py-2.5 text-gray-700">{rupee(s.expected_profit)}</td>
                <td className="py-2.5 text-gray-700">{wastePct.toFixed(0)}%</td>
                <td className="py-2.5 text-gray-700">{stockoutPct.toFixed(0)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
