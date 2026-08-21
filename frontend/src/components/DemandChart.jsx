function buildHistogram(values, binCount = 16) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const binWidth = range / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => ({
    start: min + i * binWidth,
    end: min + (i + 1) * binWidth,
    count: 0,
  }));

  for (const v of values) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count += 1;
  }

  return { bins, min, max };
}

export default function DemandChart({ distribution, recommendedStock }) {
  if (!distribution || distribution.length === 0) return null;

  const { bins, min, max } = buildHistogram(distribution);
  const maxCount = Math.max(...bins.map((b) => b.count));
  const chartHeight = 160;
  const chartWidth = 560;
  const barGap = 2;
  const barWidth = chartWidth / bins.length - barGap;

  const recommendedX =
    ((recommendedStock - min) / (max - min || 1)) * chartWidth;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-1">
        Simulated demand across 500 possible tomorrows
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Each bar is how often that demand level showed up across the simulations.
      </p>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {bins.map((bin, i) => {
          const h = maxCount ? (bin.count / maxCount) * chartHeight : 0;
          const x = i * (barWidth + barGap);
          const y = chartHeight - h;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={2}
              className="fill-saathi-500/70"
            />
          );
        })}

        {recommendedStock != null && (
          <g>
            <line
              x1={recommendedX}
              x2={recommendedX}
              y1={0}
              y2={chartHeight}
              stroke="#9a3412"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <text
              x={Math.min(Math.max(recommendedX, 40), chartWidth - 40)}
              y={chartHeight + 20}
              textAnchor="middle"
              className="fill-saathi-700 text-[11px] font-medium"
            >
              Survival Stock: {recommendedStock}
            </text>
          </g>
        )}
      </svg>

      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{Math.round(min)} units</span>
        <span>{Math.round(max)} units</span>
      </div>
    </div>
  );
}
