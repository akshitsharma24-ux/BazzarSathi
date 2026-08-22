// Small, consistent line-icon set (stroke-based, currentColor) replacing
// the emoji used throughout the app. Emoji render inconsistently across
// platforms/fonts and read as a hackathon-prototype shortcut next to an
// otherwise deliberate visual system -- these are hand-drawn to match:
// 1.75px stroke, rounded caps/joins, 24x24 viewBox, no fill.

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Icon({ children, className = "w-5 h-5", ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base} {...props}>
      {children}
    </svg>
  );
}

export function RainIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6.5 15a4.5 4.5 0 0 1 .5-8.98A6 6 0 0 1 18.5 8.5 4 4 0 0 1 18 16H7" />
      <path d="M8 18.5 7 20.5M12 18.5l-1 2M16 18.5l-1 2" />
    </Icon>
  );
}

export function CalendarIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function EventIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 4c-3.2 4-7 9.5-7.5 13.5h15C19 13.5 15.2 8 12 4Z" />
      <path d="M12 9v8.5M9 17.5v-3M15 17.5v-3" />
    </Icon>
  );
}

export function TrendIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 16.5 10 10l4 4 6.5-7.5" />
      <path d="M15 6h5.5v5.5" />
    </Icon>
  );
}

export function ShieldIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3 4.5 6v6c0 5 3.4 8.2 7.5 9 4.1-.8 7.5-4 7.5-9V6L12 3Z" />
      <path d="M9 12.2 11 14l4-4.2" />
    </Icon>
  );
}

export function ScaleIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3v17M8 20h8" />
      <path d="M5 8h5M14 8h5" />
      <path d="M5 8 2.5 13a2.7 2.7 0 0 0 5 0L5 8ZM19 8l-2.5 5a2.7 2.7 0 0 0 5 0L19 8Z" />
    </Icon>
  );
}

export function RocketIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3c2.3 2 3.3 5.2 3.3 8 0 1.4-.3 2.8-.9 4h-4.8c-.6-1.2-.9-2.6-.9-4 0-2.8 1-6 3.3-8Z" />
      <circle cx="12" cy="9.3" r="1.1" fill="currentColor" stroke="none" />
      <path d="M8.6 12.5 6.3 15v2.3M15.4 12.5l2.3 2.5v2.3" />
      <path d="m10.6 15.5 1.4 4 1.4-4Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function DiceIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function MicIcon(props) {
  return (
    <Icon {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </Icon>
  );
}

export function ReceiptIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 3.5h12v17l-2.5-1.5L13 20.5 10.5 19 8 20.5 5.5 19V3.5Z" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
    </Icon>
  );
}

export function CompassIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.5 9.5-1.8 4.2-4.2 1.8 1.8-4.2 4.2-1.8Z" />
    </Icon>
  );
}

export function MeshIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="7" r="2.3" />
      <circle cx="18" cy="7" r="2.3" />
      <circle cx="12" cy="18" r="2.3" />
      <path d="M8 8.3 10.3 16M16 8.3 13.7 16M8.3 7h7.4" />
    </Icon>
  );
}

export function ZapIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13L12.5 3Z" />
    </Icon>
  );
}

export function CheckCircleIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.5 2.3 2.3 4.7-5" />
    </Icon>
  );
}

export function CloudIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6.5 17a4 4 0 0 1 .3-8 5.5 5.5 0 0 1 10.6 1.3A3.8 3.8 0 0 1 17 17H6.5Z" />
    </Icon>
  );
}

export function CoinIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M9.3 9.7c0-1.3 1.2-2.2 2.7-2.2s2.7.9 2.7 2.1c0 2.7-5.4 1.4-5.4 4.1 0 1.3 1.2 2.2 2.7 2.2s2.7-.9 2.7-2.2" />
    </Icon>
  );
}

export function ThermometerIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 14.5V5a2 2 0 1 0-4 0v9.5a3.5 3.5 0 1 0 4 0Z" />
      <circle cx="10" cy="16" r="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function CartIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3.5 4h2l1 2.5M6.5 6.5 8.3 14a1.5 1.5 0 0 0 1.5 1.2h6.7a1.5 1.5 0 0 0 1.4-1L19.5 8.5H6.5Z" />
      <circle cx="10" cy="19" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="16" cy="19" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  );
}
