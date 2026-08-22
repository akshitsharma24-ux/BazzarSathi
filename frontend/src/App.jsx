import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Simulate from "./pages/Simulate.jsx";
import { useLanguage } from "./i18n.jsx";

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#dd5612" />
      <path
        d="M9 13.5C9 12.1 10.1 11 11.5 11h9c1.4 0 2.5 1.1 2.5 2.5v.3c0 .8-.4 1.6-1.1 2.1l-1 .7c-.4.3-.6.7-.6 1.2v2.7c0 1.4-1.1 2.5-2.5 2.5h-6.6c-1.4 0-2.5-1.1-2.5-2.5v-2.7c0-.5-.2-.9-.6-1.2l-1-.7c-.7-.5-1.1-1.3-1.1-2.1v-.3Z"
        fill="white"
      />
      <circle cx="12.5" cy="22.5" r="1.4" fill="white" />
      <circle cx="19.5" cy="22.5" r="1.4" fill="white" />
    </svg>
  );
}

function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center rounded-full bg-ink-100 p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLang("en")}
        className={`px-2.5 py-1 rounded-full transition ${
          lang === "en" ? "bg-white text-ink-900 shadow-sm" : "text-ink-400 hover:text-ink-600"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("hi")}
        className={`px-2.5 py-1 rounded-full transition ${
          lang === "hi" ? "bg-white text-ink-900 shadow-sm" : "text-ink-400 hover:text-ink-600"
        }`}
      >
        हिं
      </button>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-md border-b border-ink-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2.5 group shrink-0">
            <LogoMark />
            <span className="font-display font-bold text-lg text-ink-900 tracking-tight group-hover:text-saathi-600 transition-colors">
              {t("appName")}
            </span>
          </button>

          <div className="flex items-center gap-3">
            {page !== "landing" && (
              <nav className="flex gap-1 bg-ink-100 rounded-full p-1">
                <button
                  onClick={() => setPage("dashboard")}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    page === "dashboard"
                      ? "bg-white shadow-sm text-saathi-700"
                      : "text-ink-500 hover:text-ink-700"
                  }`}
                >
                  {t("nav_dashboard")}
                </button>
                <button
                  onClick={() => setPage("simulate")}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    page === "simulate"
                      ? "bg-white shadow-sm text-saathi-700"
                      : "text-ink-500 hover:text-ink-700"
                  }`}
                >
                  {t("nav_simulate")}
                </button>
              </nav>
            )}
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full">
        {page === "landing" && <Landing onEnter={() => setPage("dashboard")} />}
        {page === "dashboard" && <Dashboard onGoToSimulate={() => setPage("simulate")} />}
        {page === "simulate" && <Simulate />}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-xs text-ink-400 text-center w-full">
        {t("footer")}
      </footer>
    </div>
  );
}
