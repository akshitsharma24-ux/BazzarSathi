import { useEffect, useState } from "react";
import { getDashboard } from "../api/client.js";
import VendorCard from "../components/VendorCard.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { VendorCardSkeleton } from "../components/Skeleton.jsx";

export default function Dashboard({ onGoToSimulate }) {
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
        <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
        <p className="text-gray-500 mt-1">
          A quick look at how today went before deciding tomorrow's stock.
        </p>
      </div>

      {loading && <VendorCardSkeleton />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}

      {!loading && data && <VendorCard data={data} />}

      {!loading && data && (
        <div className="bg-saathi-50 border border-saathi-100 rounded-xl p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold text-saathi-700">Not sure how much to prepare tomorrow?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Run 500 simulated "tomorrows" and get a Survival Stock recommendation.
            </p>
          </div>
          <button
            onClick={onGoToSimulate}
            className="shrink-0 bg-saathi-600 hover:bg-saathi-700 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            Simulate Tomorrow →
          </button>
        </div>
      )}
    </div>
  );
}
