const DRIVER_META = {
  rain_impact_pct: { label: "Rain", icon: "🌧️" },
  weekend_impact_pct: { label: "Weekend", icon: "📅" },
  event_impact_pct: { label: "Local event", icon: "🎪" },
  trend_impact_pct: { label: "Recent trend", icon: "📈" },
};

function DriverRow({ driverKey, pct }) {
  const meta = DRIVER_META[driverKey];
  if (!meta) return null;

  const positive = pct >= 0;
  const magnitude = Math.min(Math.abs(pct), 100);

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xl w-7 text-center">{meta.icon}</span>
      <span className="w-28 text-sm text-gray-600">{meta.label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${positive ? "bg-saathi-500" : "bg-blue-400"}`}
          style={{ width: `${magnitude}%` }}
        />
      </div>
      <span
        className={`w-16 text-right text-sm font-semibold ${
          positive ? "text-saathi-700" : "text-blue-600"
        }`}
      >
        {positive ? "+" : ""}
        {pct}%
      </span>
    </div>
  );
}

export default function WhyExplainer({ why }) {
  if (!why) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-1">Why this number?</h3>
      <p className="text-sm text-gray-500 mb-2">
        How much each factor shifts predicted demand, compared to that factor being absent.
      </p>
      <div className="divide-y divide-gray-50">
        {Object.entries(why).map(([key, pct]) => (
          <DriverRow key={key} driverKey={key} pct={pct} />
        ))}
      </div>
    </div>
  );
}
