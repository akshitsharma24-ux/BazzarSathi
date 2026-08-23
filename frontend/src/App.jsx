import { useState } from "react";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Simulate from "./pages/Simulate.jsx";
import Network from "./pages/Network.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ProfileModal from "./components/ProfileModal.jsx";
import { useLanguage } from "./i18n.jsx";
import { useAuth } from "./auth.jsx";

// Simplified crest mark: a market-stall awning over a shield, in the
// product's own orange/teal pair. Works at 28-32px in the nav.
function LogoMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 14.5 16 3l10 11.5v11.5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V14.5Z" fill="#176b65" />
      <path
        d="M5 15 6.6 9h18.8L27 15a3 3 0 0 1-3 2.6 3 3 0 0 1-2.4-1.2A3 3 0 0 1 19.2 18a3 3 0 0 1-2.4-1.2 3 3 0 0 1-2.4 1.2 3 3 0 0 1-2.4-1.2A3 3 0 0 1 8 17.6 3 3 0 0 1 5 15Z"
        fill="#d95d20"
      />
      <path d="M6.6 9 8.3 4h15.4L25.4 9H6.6Z" fill="#e37940" />
      <circle cx="16" cy="24" r="2.6" fill="#fdf3ee" />
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
    <div className="flex items-center text-xs font-semibold border border-ink-200 rounded-md overflow-hidden">
      {LANGUAGES.map(({ code, label }, i) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`px-2 py-1.5 transition-colors ${i > 0 ? "border-l border-ink-200" : ""} ${
            lang === code ? "bg-ink-900 text-white" : "text-ink-500 hover:bg-ink-50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function AuthButton({ onOpenAuth, onOpenProfile }) {
  const { t } = useLanguage();
  const { enabled, session, profile, signOut } = useAuth();
  if (!enabled) return null;

  if (session) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={onOpenProfile}
          className="hidden sm:inline text-ink-600 font-medium hover:text-saathi-600"
        >
          {profile?.stall_name || session.user.email}
        </button>
        <button
          onClick={signOut}
          className="font-semibold text-ink-500 hover:text-ink-800 border border-ink-200 rounded-md px-2 py-1.5"
        >
          {t("auth_sign_out")}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenAuth}
      className="text-xs font-semibold bg-ink-900 hover:bg-ink-800 text-white rounded-md px-2.5 py-1.5 whitespace-nowrap"
    >
      {t("auth_sign_in")}
    </button>
  );
}

const NAV_TABS = [
  { key: "dashboard", labelKey: "nav_dashboard" },
  { key: "simulate", labelKey: "nav_simulate" },
  { key: "network", labelKey: "nav_network" },
];

function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-0.5 py-2 text-sm font-medium transition-colors ${
        active ? "text-ink-900" : "text-ink-500 hover:text-ink-800"
      }`}
    >
      {children}
      <span
        className={`absolute left-0 right-0 -bottom-px h-[2px] rounded-full transition-opacity ${
          active ? "bg-saathi-500 opacity-100" : "opacity-0"
        }`}
      />
    </button>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");
  const [simResult, setSimResult] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <header className="bg-white/95 backdrop-blur-sm border-b border-ink-200 sticky top-0 z-20 h-16 flex items-center">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 w-full flex items-center justify-between gap-6">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2.5 shrink-0">
            <LogoMark />
            <span className="font-display font-bold text-[17px] text-ink-900 tracking-tight">
              {t("appName")}
            </span>
          </button>

          {page !== "landing" && (
            <nav className="hidden sm:flex items-center gap-6 flex-1">
              {NAV_TABS.map(({ key, labelKey }) => (
                <NavLink key={key} active={page === key} onClick={() => setPage(key)}>
                  {t(labelKey)}
                </NavLink>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            <AuthButton onOpenAuth={() => setAuthOpen(true)} onOpenProfile={() => setProfileOpen(true)} />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}

      {page !== "landing" && (
        <nav className="sm:hidden bg-white border-b border-ink-200 px-2 flex items-stretch">
          {NAV_TABS.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`flex-1 relative py-2.5 text-xs font-medium text-center ${
                page === key ? "text-ink-900" : "text-ink-500"
              }`}
            >
              {t(labelKey)}
              {page === key && (
                <span className="absolute left-3 right-3 -bottom-px h-[2px] bg-saathi-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      )}

      <main className="max-w-[1280px] mx-auto px-5 sm:px-8 py-6 sm:py-10 flex-1 w-full">
        {page === "landing" && (
          <Landing onEnter={() => setPage("dashboard")} onPlan={() => setPage("simulate")} />
        )}
        {page === "dashboard" && <Dashboard onGoToSimulate={() => setPage("simulate")} />}
        {page === "simulate" && (
          <Simulate onSimulated={setSimResult} onGoToNetwork={() => setPage("network")} />
        )}
        {page === "network" && (
          <Network
            simResult={simResult}
            onGoToSimulate={() => setPage("simulate")}
            onRequireAuth={() => setAuthOpen(true)}
          />
        )}
      </main>

      <footer className="border-t border-ink-200 w-full">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-5 text-xs text-ink-500 text-center">
          {t("footer")}
        </div>
      </footer>
    </div>
  );
}
