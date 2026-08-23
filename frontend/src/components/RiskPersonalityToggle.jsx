import { useLanguage } from "../i18n.jsx";
import { ShieldIcon, ScaleIcon, RocketIcon } from "./icons.jsx";

const MODES = [
  { key: "protect_cash", Icon: ShieldIcon, labelKey: "risk_protect_cash", descKey: "risk_protect_cash_desc" },
  { key: "balanced", Icon: ScaleIcon, labelKey: "risk_balanced", descKey: "risk_balanced_desc" },
  { key: "maximize_sales", Icon: RocketIcon, labelKey: "risk_maximize_sales", descKey: "risk_maximize_sales_desc" },
];

export default function RiskPersonalityToggle({ value, onChange, disabled }) {
  const { t } = useLanguage();
  const active = MODES.find((m) => m.key === value);

  return (
    <div>
      <p className="text-sm font-medium text-ink-800 mb-2.5">{t("risk_title")}</p>
      <div className="inline-flex items-center border border-ink-300 rounded-[10px] p-0.5 bg-white">
        {MODES.map(({ key, Icon, labelKey }) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => onChange(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] text-sm font-medium transition-colors disabled:opacity-50 ${
                isActive ? "bg-ink-900 text-white" : "text-ink-600 hover:text-ink-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(labelKey)}
            </button>
          );
        })}
      </div>
      {active && (
        <p className="text-sm text-ink-600 mt-2 transition-opacity">{t(active.descKey)}</p>
      )}
    </div>
  );
}
