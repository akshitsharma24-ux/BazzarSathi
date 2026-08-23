import { useLanguage } from "../i18n.jsx";
import {
  TrendIcon, DiceIcon, ShieldIcon, MeshIcon, ScaleIcon, RocketIcon, CompassIcon,
  MicIcon, ReceiptIcon, CloudIcon, CoinIcon, CalendarIcon,
} from "../components/icons.jsx";

const FEATURES = [
  { Icon: TrendIcon, titleKey: "feat_forecast_title", descKey: "feat_forecast_desc" },
  { Icon: DiceIcon, titleKey: "feat_montecarlo_title", descKey: "feat_montecarlo_desc" },
  { Icon: ShieldIcon, titleKey: "feat_survival_title", descKey: "feat_survival_desc" },
  { Icon: ScaleIcon, titleKey: "feat_risk_title", descKey: "feat_risk_desc" },
  { Icon: CalendarIcon, titleKey: "feat_why_title", descKey: "feat_why_desc" },
  { Icon: CoinIcon, titleKey: "feat_savings_title", descKey: "feat_savings_desc" },
  { Icon: MeshIcon, titleKey: "feat_mesh_title", descKey: "feat_mesh_desc" },
  { Icon: CompassIcon, titleKey: "feat_intel_title", descKey: "feat_intel_desc" },
  { Icon: CloudIcon, titleKey: "feat_weather_title", descKey: "feat_weather_desc" },
  { Icon: MicIcon, titleKey: "feat_voice_title", descKey: "feat_voice_desc" },
  { Icon: ReceiptIcon, titleKey: "feat_ocr_title", descKey: "feat_ocr_desc" },
  { Icon: RocketIcon, titleKey: "feat_login_title", descKey: "feat_login_desc" },
];

const ROADMAP = [
  "roadmap_ocr",
  "roadmap_intel",
  "roadmap_svanidhi",
  "roadmap_pos",
  "roadmap_realdata",
  "roadmap_cities",
  "roadmap_offline",
];

function ReceiptPreview() {
  const { t } = useLanguage();
  return (
    <div className="bg-white border border-ink-200 rounded-xl shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-dashed border-ink-200 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          {t("landing_preview_label")}
        </p>
        <p className="text-[11px] text-ink-400">{t("landing_preview_item")}</p>
      </div>

      <div className="px-5 py-4 border-b border-dashed border-ink-200">
        <p className="text-xs text-ink-500">{t("forecast_predicted")}</p>
        <p className="text-3xl font-display font-bold text-ink-800 tabular-nums-all">108</p>
      </div>

      <div className="px-5 py-5 bg-saathi-50/60">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-saathi-700">
          {t("survival_title")}
        </p>
        <p className="text-6xl font-display font-extrabold text-saathi-600 tabular-nums-all leading-none mt-1">
          115
        </p>
        <p className="text-xs text-ink-500 mt-1">{t("survival_units")}</p>
      </div>

      <div className="px-5 py-4 grid grid-cols-3 gap-3 border-b border-dashed border-ink-200">
        <div>
          <p className="text-[10px] text-ink-500 uppercase tracking-wide">{t("survival_stockout_risk")}</p>
          <p className="text-sm font-semibold text-ink-800 tabular-nums-all">9%</p>
        </div>
        <div>
          <p className="text-[10px] text-ink-500 uppercase tracking-wide">{t("compare_waste")}</p>
          <p className="text-sm font-semibold text-ink-800 tabular-nums-all">4%</p>
        </div>
        <div>
          <p className="text-[10px] text-ink-500 uppercase tracking-wide">{t("survival_expected_profit")}</p>
          <p className="text-sm font-semibold text-mesh-700 tabular-nums-all">₹1,860</p>
        </div>
      </div>

      <div className="px-5 py-3 flex items-center justify-between text-xs">
        <span className="text-saathi-600 font-medium">{t("why_event")} ↑ 34%</span>
        <span className="text-mesh-600 font-medium">{t("why_rain")} ↓ 12%</span>
      </div>
    </div>
  );
}

function FeatureItem({ Icon, title, desc }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 w-9 h-9 rounded-lg bg-ink-100 flex items-center justify-center text-ink-600">
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <h3 className="text-sm font-display font-semibold text-ink-900">{title}</h3>
        <p className="text-sm text-ink-600 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ProcessStep({ number, title, desc, last }) {
  return (
    <div className="flex-1 min-w-[150px] relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-display font-bold text-saathi-600 tabular-nums-all">{number}</span>
        {!last && <span className="hidden sm:block h-px flex-1 bg-ink-200" />}
      </div>
      <h3 className="text-sm font-display font-semibold text-ink-900">{title}</h3>
      <p className="text-sm text-ink-600 mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Landing({ onEnter, onPlan }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero */}
      <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-saathi-600 mb-4">
            {t("landing_eyebrow")}
          </p>
          <h1 className="text-[34px] sm:text-[44px] leading-[1.08] font-display font-bold text-ink-900 tracking-tight">
            {t("landing_headline_1")}
            <br />
            {t("landing_headline_2")}
          </h1>
          <p className="text-[17px] text-ink-600 leading-relaxed mt-5 max-w-lg">{t("landing_subcopy")}</p>

          <div className="flex items-center gap-5 mt-7 flex-wrap">
            <button
              onClick={onPlan}
              className="inline-flex items-center gap-2 bg-saathi-500 hover:bg-saathi-600 active:scale-[0.98] text-white font-display font-semibold text-[15px] px-5 py-3 rounded-[10px] transition-all"
            >
              {t("landing_cta_primary")} →
            </button>
            <button
              onClick={onEnter}
              className="text-[15px] font-medium text-ink-700 hover:text-ink-900 underline decoration-ink-300 underline-offset-4"
            >
              {t("landing_cta_secondary")}
            </button>
          </div>

          <p className="text-xs text-ink-500 mt-8 tracking-wide">{t("landing_trustline")}</p>
        </div>

        <ReceiptPreview />
      </section>

      {/* Process */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-5">
          {t("landing_process_label")}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
          <ProcessStep number="01" title={t("landing_step1_title")} desc={t("landing_step1_desc")} />
          <ProcessStep number="02" title={t("landing_step2_title")} desc={t("landing_step2_desc")} />
          <ProcessStep number="03" title={t("landing_step3_title")} desc={t("landing_step3_desc")} />
          <ProcessStep number="04" title={t("landing_step4_title")} desc={t("landing_step4_desc")} last />
        </div>
      </section>

      {/* Ramesh editorial */}
      <section className="grid lg:grid-cols-2 gap-10 lg:gap-16 border-t border-ink-200 pt-14">
        <h2 className="text-2xl sm:text-[28px] font-display font-semibold text-ink-900 leading-snug">
          {t("landing_ramesh_headline_1")}
          <br />
          {t("landing_ramesh_headline_2")}
        </h2>

        <div className="space-y-6">
          <p className="text-ink-600 leading-relaxed">{t("landing_p1")}</p>
          <p className="text-ink-600 leading-relaxed">{t("landing_p2")}</p>

          <div className="grid grid-cols-3 items-center gap-3 pt-2">
            <div className="text-center border border-ink-200 rounded-lg py-4 px-2">
              <p className="text-xs font-semibold text-rose-600 uppercase tracking-wide">{t("landing_understock")}</p>
              <p className="text-sm text-ink-600 mt-1">{t("landing_understock_desc")}</p>
            </div>
            <div className="text-center border border-ink-200 rounded-lg py-4 px-2">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">{t("landing_overstock")}</p>
              <p className="text-sm text-ink-600 mt-1">{t("landing_overstock_desc")}</p>
            </div>
            <div className="text-center border border-saathi-300 bg-saathi-50 rounded-lg py-4 px-2">
              <p className="text-xs font-semibold text-saathi-700 uppercase tracking-wide">{t("landing_balanced")}</p>
              <p className="text-sm text-ink-700 mt-1 font-medium">{t("landing_balanced_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Everything that's actually built */}
      <section className="border-t border-ink-200 pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">
          {t("features_label")}
        </p>
        <h2 className="text-xl font-display font-semibold text-ink-900 mb-8">{t("features_title")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {FEATURES.map(({ Icon, titleKey, descKey }) => (
            <FeatureItem key={titleKey} Icon={Icon} title={t(titleKey)} desc={t(descKey)} />
          ))}
        </div>
      </section>

      {/* Roadmap -- explicitly not built yet */}
      <section className="border-t border-ink-200 pt-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-1">
          {t("roadmap_label")}
        </p>
        <h2 className="text-xl font-display font-semibold text-ink-900 mb-2">{t("roadmap_title")}</h2>
        <p className="text-sm text-ink-500 mb-6 max-w-lg">{t("roadmap_subtitle")}</p>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {ROADMAP.map((key) => (
            <li key={key} className="flex items-start gap-2 text-sm text-ink-600">
              <span className="text-ink-300 mt-0.5">—</span>
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-ink-200 pt-10 text-center">
        <button
          onClick={onPlan}
          className="inline-flex items-center gap-2 bg-ink-900 hover:bg-ink-800 active:scale-[0.98] text-white font-display font-semibold px-6 py-3 rounded-[10px] transition-all"
        >
          {t("landing_cta_primary")} →
        </button>
      </section>
    </div>
  );
}
