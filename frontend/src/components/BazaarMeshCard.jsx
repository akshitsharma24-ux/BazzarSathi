import { useEffect, useState } from "react";
import { postMeshMatch } from "../api/client.js";

const SURPLUS_SHORTAGE_THRESHOLD = 5; // units of slack before we call it "balanced"

function deriveOurStatus(result) {
  const distribution = result.demand_distribution;
  const meanDemand =
    distribution.reduce((sum, v) => sum + v, 0) / distribution.length;
  const diff = result.recommended_stock - meanDemand; // positive = likely surplus

  if (diff > SURPLUS_SHORTAGE_THRESHOLD) {
    return { direction: "surplus", quantity: Math.round(diff) };
  }
  if (diff < -SURPLUS_SHORTAGE_THRESHOLD) {
    return { direction: "shortage", quantity: Math.round(-diff) };
  }
  return { direction: "balanced", quantity: 0 };
}

export default function BazaarMeshCard({ result }) {
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [response, setResponse] = useState(null);
  const [ourStatus, setOurStatus] = useState(null);

  // The recommendation changes whenever risk mode or conditions change (a
  // new /simulate call) -- any previous mesh check is stale at that point,
  // so reset back to idle rather than showing a match computed against the
  // old recommended_stock.
  useEffect(() => {
    setState("idle");
    setResponse(null);
    setOurStatus(null);
  }, [result.recommended_stock, result.risk_mode]);

  async function handleCheck() {
    setState("loading");
    try {
      const status = deriveOurStatus(result);
      setOurStatus(status);
      const data = await postMeshMatch(status);
      setResponse(data);
      setState("done");
    } catch (e) {
      setState("error");
    }
  }

  const rupee = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-semibold text-gray-800">Bazaar Mesh</h3>
          <p className="text-sm text-gray-500 mt-1">
            See if a nearby vendor can absorb your surplus, or cover your shortage, today.
          </p>
        </div>
        {state !== "done" && (
          <button
            onClick={handleCheck}
            disabled={state === "loading"}
            className="shrink-0 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            {state === "loading" ? "Checking nearby vendors..." : "Check nearby vendors"}
          </button>
        )}
      </div>

      {state === "error" && (
        <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          Couldn't reach Bazaar Mesh right now. Try again in a moment.
        </p>
      )}

      {state === "done" && response && (
        <div className="mt-4">
          {response.match_found ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-xs uppercase tracking-wide text-green-700 font-semibold mb-2">
                ✅ Surplus Match Found
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{response.match.vendor_name}</span>{" "}
                is only <span className="font-semibold">{response.match.distance_m}m</span> away
                and {response.match.their_status === "shortage" ? "is short on" : "has surplus"}{" "}
                <span className="font-semibold">{response.item}</span> today.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-400">Quantity matched</p>
                  <p className="text-lg font-bold text-gray-800">
                    {response.match.matched_quantity} units
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estimated value recovered</p>
                  <p className="text-lg font-bold text-green-700">
                    {rupee(response.match.estimated_value_recovered)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                {ourStatus?.direction === "balanced"
                  ? "Today's numbers look balanced — no surplus or shortage to match."
                  : "No nearby vendor match found for today's surplus/shortage."}
              </p>
            </div>
          )}
          <button
            onClick={() => setState("idle")}
            className="mt-3 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Check again
          </button>
        </div>
      )}
    </div>
  );
}
