export function buildHistogram(values, binCount = 16) {
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

export function getDistributionStats(values) {
  const { bins, min, max } = buildHistogram(values);
  const peak = bins.reduce((best, b) => (b.count > best.count ? b : best), bins[0]);
  const mostLikely = Math.round((peak.start + peak.end) / 2);
  return { min: Math.round(min), max: Math.round(max), mostLikely };
}
