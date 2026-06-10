export default function Logo({ variant = "light", size = "md" }) {
  const sizes = {
    sm: { width: 180, height: 45 },
    md: { width: 280, height: 70 },
    lg: { width: 400, height: 100 },
  };

  const { width, height } = sizes[size];

  const colors = {
    mark: variant === "dark" ? "#E8723A" : "#D4622A",
    wordmark: variant === "dark" ? "#f0ece6" : "#1c1c1c",
    accent: variant === "dark" ? "#E8723A" : "#D4622A",
    tagline: variant === "dark" ? "#555" : "#aaa",
    divider: variant === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 480 120"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="LetteraMia"
    >
      {/* Mark */}
      <path
        d="M 36 10 C 33 24 27 44 28 62 C 29 74 35 82 45 85 C 57 89 68 82 70 72 C 73 60 66 50 56 49 C 46 48 40 56 43 64 C 45 70 52 73 58 69"
        stroke={colors.mark}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="58" cy="69" r="4" fill={colors.mark} />
      <line x1="22" y1="88" x2="80" y2="88" stroke={colors.mark} strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />

      {/* Divider */}
      <line x1="96" y1="14" x2="96" y2="88" stroke={colors.divider} strokeWidth="0.8" />

      {/* Wordmark */}
      <text
        x="108"
        y="76"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="52"
        letterSpacing="-1.5"
      >
        <tspan fontWeight="200" fill={colors.wordmark}>lettera</tspan>
        <tspan fontWeight="700" fill={colors.accent}>mia</tspan>
      </text>

      {/* Tagline */}
      <text
        x="109"
        y="96"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="10"
        fill={colors.tagline}
        letterSpacing="3.5"
      >
        your voice · in italian
      </text>
    </svg>
  );
}
