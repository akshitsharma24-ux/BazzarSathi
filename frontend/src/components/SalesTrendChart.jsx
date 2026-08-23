import { useEffect, useState } from "react";
import { getSalesHistory } from "../api/client.js";
import { useLanguage } from "../i18n.jsx";
import { TrendIcon } from "./icons.jsx";

const WIDTH = 560;
const HEIGHT = 150;
const PAD_X = 8;

function buildSmoothPath(points) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function SalesTrendChart() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(null);

  useEffect(() => {
    getSalesHistory(14).then(setData).catch(() => {});
  }, []);

  if (!data || data.points.length < 2) {
    return <div className="h-40 rounded-lg skeleton-shimmer" />;
  }

  const values = data.points.map((p) => p.units_sold);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const usableWidth = WIDTH - PAD_X * 2;

  const points = data.points.map((p, i) => ({
    x: PAD_X + (i / (data.points.length - 1)) * usableWidth,
    y: HEIGHT - 20 - ((p.units_sold - min) / span) * (HEIGHT - 40),
    ...p,
  }));

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${HEIGHT} L ${points[0].x} ${HEIGHT} Z`;
  const active = hoverIdx != null ? points[hoverIdx] : points[points.length - 1];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-1">
        <div>
          <h3 className="font-display font-semibold text-ink-900 flex items-center gap-1.5">
            <TrendIcon className="w-4 h-4 text-mesh-600" /> {t("trend_title", { n: data.days })}
          </h3>
          <p className="text-sm text-ink-500 mt-0.5">{t("trend_subtitle")}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-display font-bold text-mesh-700 tabular-nums-all">{active.units_sold}</p>
          <p className="text-xs text-ink-400">{active.date}</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full mt-3"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#249a91" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#249a91" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} x2={WIDTH} y1={HEIGHT * f} y2={HEIGHT * f} stroke="#e1dbcd" strokeWidth={1} />
        ))}

        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} fill="none" stroke="#1c7c76" strokeWidth="2.25" strokeLinecap="round" />

        {points.map((p, i) => {
          const slot = usableWidth / points.length;
          const rawX = p.x - slot / 2;
          const clampedX = Math.max(0, rawX);
          const clampedWidth = Math.min(WIDTH, rawX + slot) - clampedX;
          return (
          <g key={i}>
            <rect
              x={clampedX}
              y={0}
              width={clampedWidth}
              height={HEIGHT}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i || (hoverIdx == null && i === points.length - 1) ? 4 : 2.5}
              fill={i === points.length - 1 ? "#dd5612" : "#1c7c76"}
              className="transition-all duration-150"
            />
          </g>
          );
        })}
      </svg>

      <div className="flex justify-between text-xs text-ink-400 mt-1">
        <span>{points[0].date}</span>
        <span>{points[points.length - 1].date}</span>
      </div>
    </div>
  );
}

