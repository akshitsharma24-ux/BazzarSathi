import { useLanguage } from "../i18n.jsx";
import { useCountUp } from "../hooks/useCountUp.js";
import { useReveal } from "../hooks/useReveal.js";
import Reveal from "../components/Reveal.jsx";
import { CartIcon, TrendIcon, DiceIcon, ShieldIcon } from "../components/icons.jsx";

function StatNumber({ value, label }) {
  const [ref, visible] = useReveal();
  const display = useCountUp(visible ? value : 0, { duration: 1100 });
  return (
    <div ref={ref}>
      <p className="text-2xl sm:text-3xl font-display font-extrabold text-saathi-700 tabular-nums-all">
        {display}
      </p>
      <p className="text-[11px] sm:text-xs text-ink-500 mt-1 leading-tight">{label}</p>
    </div>
  );
}

function StepCard({ number, title, desc, icon: StepIcon, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="h-full flex-1 bg-white rounded-2xl border border-ink-100 p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-saathi-50 text-saathi-600">
            <StepIcon className="w-[18px] h-[18px]" />
          </span>
          <span className="text-xs font-display font-bold text-ink-300">0{number}</span>
        </div>
        <h3 className="font-display font-semibold text-ink-900">{title}</h3>
        <p className="text-sm text-ink-500 mt-1 leading-relaxed">{desc}</p>
      </div>
    </Reveal>
  );
}

export default function Landing({ onEnter }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-14">
      <div className="relative -mx-4 sm:-mx-6 px-4 sm:px-6 pt-10 pb-14 sm:pt-16 sm:pb-20 rounded-b-[2.5rem] bg-hero-gradient bg-textured overflow-hidden">
        <div
          className="absolute w-72 h-72 rounded-full bg-saathi-200/40 blur-3xl animate-blob-drift-1 pointer-events-none"
          style={{ top: "-4rem", left: "-3rem" }}
          aria-hidden="true"
        />
        <div
          className="absolute w-80 h-80 rounded-full bg-mesh-200/40 blur-3xl animate-blob-drift-2 pointer-events-none"
          style={{ top: "2rem", right: "-4rem" }}
          aria-hidden="true"
        />

        <div className="relative max-w-2xl mx-auto text-center space-y-5 animate-fade-up">
          <span className="inline-flex items-center gap-1.5 bg-white/80 border border-saathi-200 text-saathi-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            <CartIcon className="w-3.5 h-3.5" />
            AI decision support for street vendors
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight leading-[1.05] bg-gradient-to-br from-ink-900 via-saathi-700 to-mesh-700 bg-clip-text text-transparent animate-float">
            {t("appName")}
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed max-w-lg mx-auto">
            {t("landing_tagline")}
          </p>
          <div className="pt-2">
            <button
              onClick={onEnter}
              className="bg-saathi-600 hover:bg-saathi-700 active:scale-[0.97] text-white font-display font-semibold px-8 py-3.5 rounded-xl transition-all shadow-card-hover hover:shadow-xl hover:-translate-y-0.5"
            >
              {t("landing_cta")} →
            </button>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto grid grid-cols-3 gap-3 sm:gap-6 mt-12 text-center">
          <StatNumber value={500} label={t("landing_stat1_label")} />
          <StatNumber value={3} label={t("landing_stat2_label")} />
          <StatNumber value={0} label={t("landing_stat3_label")} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto items-stretch">
        <StepCard number={1} icon={TrendIcon} title={t("landing_step1_title")} desc={t("landing_step1_desc")} delay={0} />
        <StepCard number={2} icon={DiceIcon} title={t("landing_step2_title")} desc={t("landing_step2_desc")} delay={100} />
        <StepCard number={3} icon={ShieldIcon} title={t("landing_step3_title")} desc={t("landing_step3_desc")} delay={200} />
      </div>

      <Reveal className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-ink-100 p-6 sm:p-8 space-y-4">
          <h2 className="font-display font-semibold text-ink-900 text-lg">{t("landing_meet")}</h2>
          <p className="text-ink-600 leading-relaxed">{t("landing_p1")}</p>
          <p className="text-ink-600 leading-relaxed">{t("landing_p2")}</p>
          <div className="border-t border-ink-100 pt-4">
            <p className="text-ink-800 font-medium leading-relaxed">{t("landing_p3")}</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="text-center pb-4">
        <button
          onClick={onEnter}
          className="bg-ink-900 hover:bg-ink-800 active:scale-[0.97] text-white font-display font-semibold px-8 py-3 rounded-xl transition-all hover:-translate-y-0.5"
        >
          {t("landing_cta")} →
        </button>
      </Reveal>
    </div>
  );
}
