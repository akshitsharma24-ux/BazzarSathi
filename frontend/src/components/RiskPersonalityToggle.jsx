const MODES = [
  {
    key: "protect_cash",
    label: "Protect Cash",
    desc: "Minimize wasted stock, even if it means running out",
  },
  {
    key: "balanced",
    label: "Balanced",
    desc: "Maximize expected profit",
  },
  {
    key: "maximize_sales",
    label: "Maximize Sales",
    desc: "Minimize running out, even if it means some waste",
  },
];

export default function RiskPersonalityToggle({ value, onChange, disabled }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <p className="text-sm font-medium text-gray-500 mb-3">Risk personality</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {MODES.map((mode) => (
          <button
            key={mode.key}
            disabled={disabled}
            onClick={() => onChange(mode.key)}
            className={`text-left rounded-lg border px-3 py-2.5 transition disabled:opacity-50 ${
              value === mode.key
                ? "border-saathi-500 bg-saathi-50 ring-1 ring-saathi-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                value === mode.key ? "text-saathi-700" : "text-gray-700"
              }`}
            >
              {mode.label}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{mode.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
