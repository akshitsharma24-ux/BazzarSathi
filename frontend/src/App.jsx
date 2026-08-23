import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Simulate from "./pages/Simulate.jsx";
import Network from "./pages/Network.jsx";
import { useLanguage } from "./i18n.jsx";

// Simplified crest mark echoing the brand logo: a market stall awning on
// top of a shield, in the app's own teal/orange pair -- abstracted down to
// something legible at 30px instead of the full illustrated version.
function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 14.5 16 3l10 11.5v11.5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14.5Z" fill="#1c7c76" />
      <path
        d="M5 15 6.6 9h18.8L27 15a3 3 0 0 1-3 2.6 3 3 0 0 1-2.4-1.2A3 3 0 0 1 19.2 18a3 3 0 0 1-2.4-1.2 3 3 0 0 1-2.4 1.2 3 3 0 0 1-2.4-1.2A3 3 0 0 1 8 17.6 3 3 0 0 1 5 15Z"
        fill="#dd5612"
      />
      <path d="M6.6 9 8.3 4h15.4L25.4 9H6.6Z" fill="#f18d3a" />
      <circle cx="16" cy="24" r="2.6" fill="#fef6ee" />
    </svg>
  );
}

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिं" },
  { code: "mr", label: "मरा" },
];

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center rounded-full bg-ink-100 p-0.5 text-xs font-semibold">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 rounded-full transition ${
            lang === code ? "bg-white text-ink-900 shadow-sm" : "text-ink-400 hover:text-ink-600"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const NAV_TABS = [
  { key: "dashboard", labelKey: "nav_dashboard" },
  { key: "simulate", labelKey: "nav_simulate" },
  { key: "network", labelKey: "nav_network" },
];

export default function App() {
  const [page, setPage] = useState("landing");
  const [simResult, setSimResult] = useState(null);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-ink-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setPage("landing")} className="flex items-center gap-2.5 group shrink-0">
              <LogoMark />
              <span className="font-display font-bold text-lg text-ink-900 tracking-tight group-hover:text-saathi-600 transition-colors">
                {t("appName")}
              </span>
            </button>
            <div className="sm:hidden">
              <LanguageToggle />
            </div>
          </div>

          {page !== "landing" && (
            <nav className="flex gap-1 bg-ink-100 rounded-full p-1 w-full sm:w-auto">
              {NAV_TABS.map(({ key, labelKey }) => (
                <button
                  key={key}
                  onClick={() => setPage(key)}
                  className={`flex-1 sm:flex-initial px-2 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition text-center whitespace-nowrap ${
                    page === key ? "bg-white shadow-sm text-saathi-700" : "text-ink-500 hover:text-ink-700"
                  }`}
                >
                  {t(labelKey)}
                </button>
              ))}
            </nav>
          )}

          <div className="hidden sm:block shrink-0">
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        {page === "landing" && <Landing onEnter={() => setPage("dashboard")} />}
        {page === "dashboard" && <Dashboard onGoToSimulate={() => setPage("simulate")} />}
        {page === "simulate" && (
          <Simulate onSimulated={setSimResult} onGoToNetwork={() => setPage("network")} />
        )}
        {page === "network" && <Network simResult={simResult} onGoToSimulate={() => setPage("simulate")} />}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-xs text-ink-400 text-center w-full">
        {t("footer")}
      </footer>
    </div>
  );
}
