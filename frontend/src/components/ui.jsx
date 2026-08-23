// Small set of reusable primitives so the product doesn't repeat
// `bg-white border rounded-xl shadow p-6` by hand in every component.
// Deliberately not a full design-system layer -- just the handful of
// patterns that actually recur.

export function Surface({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`bg-white border border-ink-200/70 rounded-xl ${className}`} {...props}>
      {children}
    </Tag>
  );
}

export function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-saathi-600 mb-1">{eyebrow}</p>
        )}
        <h1 className="text-2xl sm:text-[28px] font-display font-bold text-ink-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-ink-600 mt-1 text-[15px]">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-3">
      <div>
        <h2 className="text-base font-display font-semibold text-ink-900">{title}</h2>
        {subtitle && <p className="text-sm text-ink-600 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Metric({ label, value, sublabel, accent, size = "md" }) {
  const sizes = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl",
    lg: "text-4xl sm:text-5xl",
  };
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className={`font-display font-bold tabular-nums-all leading-tight mt-0.5 ${sizes[size]} ${accent || "text-ink-900"}`}>
        {value}
      </p>
      {sublabel && <p className="text-xs text-ink-500 mt-0.5">{sublabel}</p>}
    </div>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 bg-saathi-500 hover:bg-saathi-600 disabled:bg-ink-300 text-white font-display font-semibold text-sm px-4 py-2.5 rounded-[10px] transition-colors focus-visible:outline-none focus-visible:shadow-focus ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 bg-white hover:bg-ink-50 border border-ink-300 disabled:opacity-50 text-ink-800 font-medium text-sm px-4 py-2.5 rounded-[10px] transition-colors focus-visible:outline-none focus-visible:shadow-focus ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-saathi-600 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusChip({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-ink-100 text-ink-700",
    good: "bg-mesh-50 text-mesh-700",
    warn: "bg-amber-50 text-amber-700",
    bad: "bg-rose-50 text-rose-600",
    accent: "bg-saathi-50 text-saathi-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
