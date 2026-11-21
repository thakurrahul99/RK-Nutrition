export default function RKWatermark({ className = '' }) {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Precision grid coordinate lines */}
      <line x1="0" y1="200" x2="500" y2="200" stroke="#F5F4F2" strokeOpacity="0.04" strokeDasharray="4 8" />
      <line x1="250" y1="0" x2="250" y2="400" stroke="#F5F4F2" strokeOpacity="0.04" strokeDasharray="4 8" />
      
      {/* Signature Red Corner Accent Line & Block */}
      <path d="M 440 40 L 480 40 L 480 80" stroke="#C8202B" strokeWidth="2" strokeOpacity="0.35" />
      <rect x="472" y="32" width="8" height="8" fill="#C8202B" fillOpacity="0.5" />

      {/* Massive Bold Architectural RK Monogram */}
      <text
        x="250"
        y="300"
        fontFamily="'Oswald', 'Bebas Neue', sans-serif"
        fontWeight="900"
        fontSize="320"
        fill="#F5F4F2"
        fillOpacity="0.035"
        stroke="#F5F4F2"
        strokeWidth="1.5"
        strokeOpacity="0.06"
        textAnchor="middle"
        letterSpacing="-10"
      >
        RK
      </text>

      {/* Technical Brand Descriptor */}
      <text
        x="250"
        y="340"
        fontFamily="monospace"
        fontWeight="600"
        fontSize="11"
        fill="#C8202B"
        fillOpacity="0.3"
        textAnchor="middle"
        letterSpacing="12"
      >
        ATHLETIC FORMULATION // STANDARDS
      </text>
    </svg>
  );
}
