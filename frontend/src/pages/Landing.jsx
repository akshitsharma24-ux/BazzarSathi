import { useLanguage } from "../i18n.jsx";

function StepCard({ number, title, desc }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-ink-100 p-5 shadow-card">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-saathi-50 text-saathi-700 font-display font-bold text-sm mb-3">
        {number}
      </span>
      <h3 className="font-display font-semibold text-ink-900">{title}</h3>
      <p className="text-sm text-ink-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Landing({ onEnter }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-14">
      <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20 rounded-b-[2.5rem] bg-hero-gradient bg-textured overflow-hidden">
        <div className="relative max-w-2xl mx-auto text-center space-y-5 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-white/80 border border-saathi-200 text-saathi-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            🛒 AI decision support for street vendors
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-ink-900 tracking-tight leading-[1.05]">
            {t("appName")}
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed max-w-lg mx-auto">
            {t("landing_tagline")}
          </p>
          <div className="pt-2">
            <button
              onClick={onEnter}
              className="bg-saathi-600 hover:bg-saathi-700 active:scale-[0.98] text-white font-display font-semibold px-8 py-3.5 rounded-xl transition shadow-card-hover"
            >
              {t("landing_cta")} →
            </button>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto grid grid-cols-3 gap-3 sm:gap-6 mt-12 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-display font-extrabold text-saathi-700 tabular-nums-all">500</p>
            <p className="text-[11px] sm:text-xs text-ink-500 mt-1 leading-tight">{t("landing_stat1_label")}</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-display font-extrabold text-saathi-700 tabular-nums-all">3</p>
            <p className="text-[11px] sm:text-xs text-ink-500 mt-1 leading-tight">{t("landing_stat2_label")}</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-display font-extrabold text-saathi-700 tabular-nums-all">0</p>
            <p className="text-[11px] sm:text-xs text-ink-500 mt-1 leading-tight">{t("landing_stat3_label")}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <StepCard number={1} title={t("landing_step1_title")} desc={t("landing_step1_desc")} />
        <StepCard number={2} title={t("landing_step2_title")} desc={t("landing_step2_desc")} />
        <StepCard number={3} title={t("landing_step3_title")} desc={t("landing_step3_desc")} />
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-card border border-ink-100 p-6 sm:p-8 space-y-4">
        <h2 className="font-display font-semibold text-ink-900 text-lg">{t("landing_meet")}</h2>
        <p className="text-ink-600 leading-relaxed">{t("landing_p1")}</p>
        <p className="text-ink-600 leading-relaxed">{t("landing_p2")}</p>
        <div className="border-t border-ink-100 pt-4">
          <p className="text-ink-800 font-medium leading-relaxed">{t("landing_p3")}</p>
        </div>
      </div>

      <div className="text-center pb-4">
        <button
          onClick={onEnter}
          className="bg-ink-900 hover:bg-ink-800 active:scale-[0.98] text-white font-display font-semibold px-8 py-3 rounded-xl transition"
        >
          {t("landing_cta")} →
        </button>
      </div>
    </div>
  );
}
