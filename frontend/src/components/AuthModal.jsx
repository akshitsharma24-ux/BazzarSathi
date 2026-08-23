import { useState } from "react";
import { useAuth } from "../auth.jsx";
import { useLanguage } from "../i18n.jsx";
import { PrimaryButton, SecondaryButton } from "./ui.jsx";

export default function AuthModal({ onClose }) {
  const { t } = useLanguage();
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stallName, setStallName] = useState("");
  const [item, setItem] = useState("Vada Pav");
  const [status, setStatus] = useState("idle"); // idle | loading | check-email | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      if (mode === "signup") {
        const data = await signUp(email, password, stallName || "New Vendor", item);
        if (!data.session) {
          setStatus("check-email");
          return;
        }
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || String(err));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-ink-200 shadow-card-hover p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-ink-900">
            {mode === "signin" ? t("auth_sign_in") : t("auth_sign_up")}
          </h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 text-xl leading-none">×</button>
        </div>

        {status === "check-email" ? (
          <p className="text-sm text-ink-600">{t("auth_check_email")}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <>
                <input
                  type="text" required placeholder={t("auth_stall_name")}
                  value={stallName} onChange={(e) => setStallName(e.target.value)}
                  className="w-full text-sm border border-ink-300 rounded-[8px] px-3 py-2.5 focus:outline-none focus:shadow-focus"
                />
                <input
                  type="text" required placeholder={t("auth_item")}
                  value={item} onChange={(e) => setItem(e.target.value)}
                  className="w-full text-sm border border-ink-300 rounded-[8px] px-3 py-2.5 focus:outline-none focus:shadow-focus"
                />
              </>
            )}
            <input
              type="email" required placeholder={t("auth_email")}
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm border border-ink-300 rounded-[8px] px-3 py-2.5 focus:outline-none focus:shadow-focus"
            />
            <input
              type="password" required minLength={6} placeholder={t("auth_password")}
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm border border-ink-300 rounded-[8px] px-3 py-2.5 focus:outline-none focus:shadow-focus"
            />

            {status === "error" && <p className="text-xs text-rose-600">{errorMsg}</p>}

            <PrimaryButton type="submit" disabled={status === "loading"} className="w-full py-2.5">
              {status === "loading" ? "…" : mode === "signin" ? t("auth_sign_in_button") : t("auth_sign_up_button")}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              className="w-full py-2 text-xs"
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setStatus("idle"); }}
            >
              {mode === "signin" ? t("auth_switch_to_signup") : t("auth_switch_to_signin")}
            </SecondaryButton>
          </form>
        )}
      </div>
    </div>
  );
}
