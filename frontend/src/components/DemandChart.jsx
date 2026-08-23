import { useLanguage } from "../i18n.jsx";
import { buildHistogram } from "../utils/stats.js";

export default function DemandChart({ distribution, recommendedStock, forecast }) {
  const { t } = useLanguage();
  if (!distribution || distribution.length === 0) return null;

  const { bins, min, max } = buildHistogram(distribution);
  const maxCount = Math.max(...bins.map((b) => b.count));
  const chartHeight = 160;
  const chartWidth = 560;
  const barGap = 2.5;
  const barWidth = chartWidth / bins.length - barGap;

  const span = max - min || 1;
  const xFor = (v) => ((v - min) / span) * chartWidth;
  const recommendedX = xFor(recommendedStock);
  const forecastX = forecast != null ? xFor(forecast) : null;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
        <div className="flex items-center gap-4 text-xs">
          {forecast != null && (
            <span className="flex items-center gap-1.5 text-ink-600">
              <span className="w-3 h-0.5 bg-ink-500" style={{ backgroundImage: "repeating-linear-gradient(90deg,#7d766a 0 3px,transparent 3px 5px)" }} />
              {t("decision_expected_demand")} {Math.round(forecast)}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-saathi-700 font-medium">
            <span className="w-3 h-0.5 bg-saathi-500" />
            {t("chart_marker_label")} {recommendedStock}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={chartWidth} y1={chartHeight * f} y2={chartHeight * f} stroke="#e1dbcd" strokeWidth={1} />
        ))}

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
              fill="#e37940"
              style={{
                transformBox: "fill-box",
                transformOrigin: "bottom",
                animation: "grow-bar 0.4s cubic-bezier(0.16,1,0.3,1) both",
                animationDelay: `${i * 10}ms`,
              }}
            />
          );
        })}

        {forecastX != null && (
          <line x1={forecastX} x2={forecastX} y1={0} y2={chartHeight} stroke="#7d766a" strokeWidth={1.5} strokeDasharray="4 3" />
        )}
        {recommendedStock != null && (
          <line x1={recommendedX} x2={recommendedX} y1={0} y2={chartHeight} stroke="#c04d17" strokeWidth={2} />
        )}
      </svg>

      <div className="flex justify-between text-xs text-ink-500 mt-1">
        <span>{Math.round(min)} {t("futures_units")}</span>
        <span>{Math.round(max)} {t("futures_units")}</span>
      </div>
    </div>
  );
}
