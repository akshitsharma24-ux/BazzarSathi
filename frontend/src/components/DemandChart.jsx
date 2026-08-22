import { useLanguage } from "../i18n.jsx";
import { buildHistogram } from "../utils/stats.js";

export default function DemandChart({ distribution, recommendedStock }) {
  const { t } = useLanguage();
  if (!distribution || distribution.length === 0) return null;

  const { bins, min, max } = buildHistogram(distribution);
  const maxCount = Math.max(...bins.map((b) => b.count));
  const chartHeight = 170;
  const chartWidth = 560;
  const barGap = 2.5;
  const barWidth = chartWidth / bins.length - barGap;

  const recommendedX = ((recommendedStock - min) / (max - min || 1)) * chartWidth;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-7 animate-fade-up">
      <h3 className="font-display font-semibold text-ink-900">{t("chart_title")}</h3>
      <p className="text-sm text-ink-500 mb-4">{t("chart_subtitle")}</p>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + 34}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f18d3a" />
            <stop offset="100%" stopColor="#dd5612" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={chartWidth}
            y1={chartHeight * f}
            y2={chartHeight * f}
            stroke="#efece7"
            strokeWidth={1}
          />
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
              rx={3}
              fill="url(#barGradient)"
              style={{
                transformBox: "fill-box",
                transformOrigin: "bottom",
                animation: "grow-bar 0.5s cubic-bezier(0.16,1,0.3,1) both",
                animationDelay: `${i * 12}ms`,
              }}
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
              stroke="#211d18"
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <rect
              x={Math.min(Math.max(recommendedX - 72, 0), chartWidth - 144)}
              y={chartHeight + 8}
              width={144}
              height={20}
              rx={10}
              fill="#211d18"
            />
            <text
              x={Math.min(Math.max(recommendedX, 72), chartWidth - 72)}
              y={chartHeight + 22}
              textAnchor="middle"
              fill="white"
              className="text-[11px] font-semibold"
            >
              {t("chart_marker_label")}: {recommendedStock}
            </text>
          </g>
        )}
      </svg>

      <div className="flex justify-between text-xs text-ink-400 mt-1">
        <span>{Math.round(min)} {t("futures_units")}</span>
        <span>{Math.round(max)} {t("futures_units")}</span>
      </div>
    </div>
  );
}
