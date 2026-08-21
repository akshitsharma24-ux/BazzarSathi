function Stat({ label, value, accent }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <span className={`text-2xl font-bold ${accent || "text-gray-900"}`}>{value}</span>
    </div>
  );
}

export default function VendorCard({ data }) {
  if (!data) return null;

  const rupee = (n) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Today's Snapshot</h2>
        <span className="text-sm text-gray-400">{data.date}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Stat label="Prepared" value={data.units_prepared} />
        <Stat label="Sold" value={data.units_sold} accent="text-green-600" />
        <Stat label="Unsold" value={data.units_unsold} accent="text-red-500" />
        <Stat label="Profit" value={rupee(data.profit)} accent="text-saathi-700" />
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
        <div>
          <span className="text-gray-400">Revenue</span>
          <p className="font-medium">{rupee(data.revenue)}</p>
        </div>
        <div>
          <span className="text-gray-400">Waste loss</span>
          <p className="font-medium text-red-500">{rupee(data.waste_loss)}</p>
        </div>
        <div>
          <span className="text-gray-400">Rain probability</span>
          <p className="font-medium">{Math.round(data.rain_probability * 100)}%</p>
        </div>
        <div>
          <span className="text-gray-400">Conditions</span>
          <p className="font-medium">
            {data.weekend ? "Weekend" : "Weekday"}
            {data.local_event ? " · Event" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
