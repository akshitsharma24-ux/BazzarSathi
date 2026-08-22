import { useLanguage } from "../i18n.jsx";

export default function ErrorState({ message, onRetry }) {
  const { t } = useLanguage();
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-600 flex items-center justify-between gap-4 flex-wrap animate-fade-in">
      <span>
        {t("error_generic")}
        {message ? `: ${message}.` : "."} {t("error_please_retry")}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 bg-white border border-rose-300 text-rose-600 hover:bg-rose-100 font-medium text-xs px-3 py-1.5 rounded-lg transition"
        >
          {t("error_retry")}
        </button>
      )}
    </div>
  );
}
