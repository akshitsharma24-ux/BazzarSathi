import { useState } from "react";
import { useAuth } from "../auth.jsx";
import { useLanguage } from "../i18n.jsx";
import { PrimaryButton } from "./ui.jsx";

export default function ProfileModal({ onClose }) {
  const { t } = useLanguage();
  const { profile, updateProfile } = useAuth();
  const [stallName, setStallName] = useState(profile?.stall_name || "");
  const [item, setItem] = useState(profile?.item || "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ stall_name: stallName, item });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-ink-200 shadow-card-hover p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-ink-900">{t("profile_edit_title")}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="text-xs text-ink-500">{t("auth_stall_name")}</label>
            <input
              type="text" required value={stallName} onChange={(e) => setStallName(e.target.value)}
              className="w-full text-sm border border-ink-300 rounded-[8px] px-3 py-2.5 mt-1 focus:outline-none focus:shadow-focus"
            />
          </div>
          <div>
            <label className="text-xs text-ink-500">{t("auth_item")}</label>
            <input
              type="text" required value={item} onChange={(e) => setItem(e.target.value)}
              className="w-full text-sm border border-ink-300 rounded-[8px] px-3 py-2.5 mt-1 focus:outline-none focus:shadow-focus"
            />
          </div>
          <PrimaryButton type="submit" disabled={saving} className="w-full py-2.5">
            {saving ? "…" : t("profile_save")}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
