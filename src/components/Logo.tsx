/** The Career E-Sandbox compass mark. */
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="24" fill="#2563eb" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="4" />
      <g transform="rotate(40 50 50)">
        <path d="M50 18 L60 50 L40 50 Z" fill="#fff" />
        <path d="M50 82 L60 50 L40 50 Z" fill="#bfdbfe" />
      </g>
      <circle cx="50" cy="50" r="5" fill="#2563eb" />
    </svg>
  );
}
