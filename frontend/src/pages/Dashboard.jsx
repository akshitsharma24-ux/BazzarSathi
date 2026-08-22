import { useEffect, useState } from "react";
import { getDashboard } from "../api/client.js";
import VendorCard from "../components/VendorCard.jsx";
import ForecastCard from "../components/ForecastCard.jsx";
import BazaarIntelligenceCard from "../components/BazaarIntelligenceCard.jsx";
import VoiceLogger from "../components/VoiceLogger.jsx";
import BillScannerCard from "../components/BillScannerCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { VendorCardSkeleton } from "../components/Skeleton.jsx";
import { useLanguage } from "../i18n.jsx";

export default function Dashboard({ onGoToSimulate }) {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    setError(null);
    getDashboard()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900">{t("dash_title")}</h1>
        <p className="text-ink-500 mt-1">{t("dash_subtitle")}</p>
      </div>

      {loading && <VendorCardSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && data && (
        <>
          <VendorCard data={data} />
          <ForecastCard />
          <BazaarIntelligenceCard />
          <VoiceLogger />
          <BillScannerCard />

          <div className="bg-gradient-to-br from-saathi-500 to-saathi-700 rounded-2xl p-6 sm:p-7 flex items-center justify-between flex-wrap gap-5 shadow-card-hover">
            <div>
              <h3 className="font-display font-semibold text-white text-lg">{t("dash_cta_title")}</h3>
              <p className="text-sm text-saathi-50/90 mt-1 max-w-sm">{t("dash_cta_desc")}</p>
            </div>
            <button
              onClick={onGoToSimulate}
              className="shrink-0 bg-white text-saathi-700 hover:bg-saathi-50 active:scale-[0.98] font-display font-semibold px-5 py-3 rounded-xl transition shadow-lg"
            >
              {t("dash_cta_button")} →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
