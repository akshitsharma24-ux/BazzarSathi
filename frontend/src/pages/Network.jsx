import BazaarIntelligenceCard from "../components/BazaarIntelligenceCard.jsx";
import BazaarMeshCard from "../components/BazaarMeshCard.jsx";
import { useLanguage } from "../i18n.jsx";
import { MeshIcon } from "../components/icons.jsx";

export default function Network({ simResult, onGoToSimulate }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900">{t("network_title")}</h1>
        <p className="text-ink-500 mt-1">{t("network_subtitle")}</p>
      </div>

      <BazaarIntelligenceCard />

      {simResult ? (
        <BazaarMeshCard result={simResult} />
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-6 sm:p-7 text-center animate-fade-up">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-ink-50 text-ink-400 mx-auto mb-3">
            <MeshIcon className="w-5 h-5" />
          </span>
          <h3 className="font-display font-semibold text-ink-900">{t("network_mesh_locked_title")}</h3>
          <p className="text-sm text-ink-500 mt-1 max-w-sm mx-auto">{t("network_mesh_locked_desc")}</p>
          <button
            onClick={onGoToSimulate}
            className="mt-4 bg-saathi-600 hover:bg-saathi-700 active:scale-[0.98] text-white font-display font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
          >
            {t("nav_simulate")} →
          </button>
        </div>
      )}
    </div>
  );
}
