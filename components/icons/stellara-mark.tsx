interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Stellara brand mark — eight-pointed star with central dot.
 * Used as logo, favicon, and ceremonial divider.
 */
export function StellaraMark({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>Stellara</title>
      {/* Eight-point star (Ishtar/Venus) */}
      <path
        d="M16 1.5 L18 14 L30.5 16 L18 18 L16 30.5 L14 18 L1.5 16 L14 14 Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* Diagonal rays */}
      <path
        d="M16 5 L17 15 L27 16 L17 17 L16 27 L15 17 L5 16 L15 15 Z"
        fill="currentColor"
        opacity="0.55"
        transform="rotate(45 16 16)"
      />
      {/* Center bright */}
      <circle cx="16" cy="16" r="1.4" fill="#fff" opacity="0.9" />
    </svg>
  );
}

/**
 * Compact star ornament for section dividers.
 */
export function StarOrnament({ className = "", size = 12 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>ornament</title>
      <path
        d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Crescent moon icon for night-time indicator.
 */
export function MoonIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>moon</title>
      <path
        d="M14 9.5 A6.5 6.5 0 0 1 6.5 2 A6.5 6.5 0 1 0 14 9.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Sun icon for day-time indicator.
 */
export function SunIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <title>sun</title>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="8" y1="0.5" x2="8" y2="2.5" />
        <line x1="8" y1="13.5" x2="8" y2="15.5" />
        <line x1="0.5" y1="8" x2="2.5" y2="8" />
        <line x1="13.5" y1="8" x2="15.5" y2="8" />
        <line x1="2.7" y1="2.7" x2="4.1" y2="4.1" />
        <line x1="11.9" y1="11.9" x2="13.3" y2="13.3" />
        <line x1="2.7" y1="13.3" x2="4.1" y2="11.9" />
        <line x1="11.9" y1="4.1" x2="13.3" y2="2.7" />
      </g>
    </svg>
  );
}
