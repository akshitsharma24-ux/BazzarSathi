import { useLanguage } from "../i18n.jsx";
import { getDistributionStats } from "../utils/stats.js";

export default function SimulationSummary({ distribution }) {
  const { t } = useLanguage();
  if (!distribution || distribution.length === 0) return null;

  const { min, max, mostLikely } = getDistributionStats(distribution);
  const span = max - min || 1;
  const likelyPct = ((mostLikely - min) / span) * 100;

  return (
    <div className="bg-ink-900 rounded-2xl p-6 sm:p-7 text-white shadow-card-hover animate-pop">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs font-display font-bold uppercase tracking-[0.15em] text-saathi-300">
          {t("futures_title", { n: distribution.length })}
        </p>
        <span className="text-[11px] text-ink-400 font-medium">BazaarTwin</span>
      </div>

      <div className="mt-5 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <p className="text-xs text-ink-400 uppercase tracking-wide mb-2">{t("futures_range")}</p>
          <div className="relative h-2 rounded-full bg-white/10">
            <div
              className="absolute inset-y-0 rounded-full bg-gradient-to-r from-mesh-400 to-saathi-400"
              style={{ left: "6%", right: "6%" }}
            />
            <div
              className="absolute -top-1.5 w-1 h-5 rounded-full bg-white shadow"
              style={{ left: `calc(${Math.min(Math.max(likelyPct, 4), 96)}% - 2px)` }}
            />
          </div>
          <div className="flex justify-between text-sm font-semibold mt-2 tabular-nums-all">
            <span>{min}</span>
            <span className="text-ink-400 text-xs font-normal">{t("futures_units")}</span>
            <span>{max}</span>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <p className="text-xs text-ink-400 uppercase tracking-wide">{t("futures_most_likely")}</p>
          <p className="text-4xl sm:text-5xl font-display font-extrabold text-white tabular-nums-all">
            {mostLikely}
          </p>
        </div>
      </div>
    </div>
  );
}
