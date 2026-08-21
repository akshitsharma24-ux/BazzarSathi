import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Simulate from "./pages/Simulate.jsx";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setPage("landing")}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">🛒</span>
            <span className="font-bold text-lg text-saathi-700">BazaarSaathi</span>
          </button>
          {page !== "landing" && (
            <nav className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPage("dashboard")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  page === "dashboard"
                    ? "bg-white shadow text-saathi-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setPage("simulate")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                  page === "simulate"
                    ? "bg-white shadow text-saathi-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Simulate
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {page === "landing" && <Landing onEnter={() => setPage("dashboard")} />}
        {page === "dashboard" && (
          <Dashboard onGoToSimulate={() => setPage("simulate")} />
        )}
        {page === "simulate" && <Simulate />}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-xs text-gray-400 text-center">
        Prototype for hackathon demo purposes. All vendor data shown is synthetic.
      </footer>
    </div>
  );
}
