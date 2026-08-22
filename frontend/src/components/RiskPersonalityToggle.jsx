import { useLanguage } from "../i18n.jsx";
import { ShieldIcon, ScaleIcon, RocketIcon } from "./icons.jsx";

const MODES = [
  { key: "protect_cash", Icon: ShieldIcon, labelKey: "risk_protect_cash", descKey: "risk_protect_cash_desc" },
  { key: "balanced", Icon: ScaleIcon, labelKey: "risk_balanced", descKey: "risk_balanced_desc" },
  { key: "maximize_sales", Icon: RocketIcon, labelKey: "risk_maximize_sales", descKey: "risk_maximize_sales_desc" },
];

export default function RiskPersonalityToggle({ value, onChange, disabled }) {
  const { t } = useLanguage();
  return (
    <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-4 sm:p-5 animate-fade-up">
      <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">{t("risk_title")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {MODES.map(({ key, Icon, labelKey, descKey }) => {
          const active = value === key;
          return (
            <button
              key={key}
              disabled={disabled}
              onClick={() => onChange(key)}
              className={`text-left rounded-xl border-2 px-4 py-3 transition-all duration-200 disabled:opacity-50 ${
                active
                  ? "border-saathi-500 bg-saathi-50 shadow-glow scale-[1.02]"
                  : "border-ink-100 hover:border-ink-200 bg-white hover:-translate-y-0.5"
              }`}
            >
              <p className={`text-sm font-display font-semibold flex items-center gap-1.5 ${
                active ? "text-saathi-700" : "text-ink-700"
              }`}>
                <Icon className={`w-4 h-4 ${active ? "text-saathi-600" : "text-ink-400"}`} />
                {t(labelKey)}
              </p>
              <p className="text-xs text-ink-500 mt-1 leading-snug">{t(descKey)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
