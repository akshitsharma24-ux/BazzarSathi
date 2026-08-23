import BazaarIntelligenceCard from "../components/BazaarIntelligenceCard.jsx";
import BazaarMeshCard from "../components/BazaarMeshCard.jsx";
import BazaarChat from "../components/BazaarChat.jsx";
import { useLanguage } from "../i18n.jsx";
import { useAuth } from "../auth.jsx";
import { MeshIcon } from "../components/icons.jsx";
import { Surface, PageHeader, SectionHeader, PrimaryButton } from "../components/ui.jsx";

const NODES = [
  { name: "Sunita", x: 30, y: 12 },
  { name: "Iqbal", x: 8, y: 50 },
  { name: "Ramesh", x: 50, y: 50, self: true },
  { name: "Ravi", x: 88, y: 50 },
  { name: "Meena", x: 30, y: 88 },
];

function NetworkDiagram() {
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[280px] mx-auto" aria-hidden="true">
      {NODES.filter((n) => !n.self).map((n) => (
        <line key={n.name} x1={50} y1={50} x2={n.x} y2={n.y} stroke="#e1dbcd" strokeWidth={0.6} />
      ))}
      {NODES.map((n) => (
        <g key={n.name}>
          <circle cx={n.x} cy={n.y} r={n.self ? 5.5 : 4} fill={n.self ? "#d95d20" : "#176b65"} />
          <text x={n.x} y={n.y - 8} textAnchor="middle" fontSize="6" fill="#4c4842" fontFamily="Inter, sans-serif">
            {n.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Network({ simResult, onGoToSimulate, onRequireAuth }) {
  const { t } = useLanguage();
  const { enabled: chatEnabled } = useAuth();

  return (
    <div className="space-y-8">
      <PageHeader title={t("network_title")} subtitle={t("network_subtitle")} />

      <div className="grid lg:grid-cols-[3fr_2fr] gap-4">
        <div>
          <SectionHeader title={t("neighborhood_title")} />
          <Surface className="shadow-card p-5 sm:p-6">
            <BazaarIntelligenceCard />
          </Surface>
        </div>
        <div>
          <SectionHeader title={t("network_diagram_title")} />
          <Surface className="shadow-card p-5 sm:p-6 flex items-center justify-center h-full">
            <NetworkDiagram />
          </Surface>
        </div>
      </div>

      <div>
        <SectionHeader title={t("mesh_title")} />
        <Surface className="shadow-card p-5 sm:p-6">
          {simResult ? (
            <BazaarMeshCard result={simResult} />
          ) : (
            <div className="text-center py-6">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-ink-100 text-ink-400 mx-auto mb-3">
                <MeshIcon className="w-5 h-5" />
              </span>
              <h3 className="font-display font-semibold text-ink-900">{t("network_mesh_locked_title")}</h3>
              <p className="text-sm text-ink-500 mt-1 max-w-sm mx-auto">{t("network_mesh_locked_desc")}</p>
              <PrimaryButton onClick={onGoToSimulate} className="mt-4">
                {t("nav_simulate")} →
              </PrimaryButton>
            </div>
          )}
        </Surface>
      </div>

      {chatEnabled && (
        <div>
          <SectionHeader title={t("chat_title")} subtitle={t("chat_subtitle")} />
          <Surface className="shadow-card p-5 sm:p-6">
            <BazaarChat onRequireAuth={onRequireAuth} />
          </Surface>
        </div>
      )}
    </div>
  );
}
