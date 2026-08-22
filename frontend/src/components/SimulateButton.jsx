import { useLanguage } from "../i18n.jsx";

export default function SimulateButton({ onClick, loading }) {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full sm:w-auto bg-saathi-600 hover:bg-saathi-700 disabled:bg-ink-300 text-white font-display font-semibold px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-card-hover disabled:shadow-none"
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          {t("sim_button_loading")}
        </>
      ) : (
        <>
          <span aria-hidden="true">🎲</span>
          {t("sim_button")}
        </>
      )}
    </button>
  );
}
