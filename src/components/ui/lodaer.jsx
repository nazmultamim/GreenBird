export default function Loader({ label = "Loading" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <svg width="48" height="48" viewBox="0 0 80 80" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ld-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#34d399" stopOpacity="0" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* track ring */}
        <circle cx="40" cy="40" r="32" fill="none" stroke="#10b981" strokeWidth="1" opacity=".12" />

        {/* spinning arc */}
        <circle
          cx="40" cy="40" r="32"
          fill="none"
          stroke="url(#ld-arc)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="60 141"
          style={{
            transformOrigin: "40px 40px",
            animation: "ld-spin 1.2s cubic-bezier(.6,.15,.4,.85) infinite",
          }}
        />
      </svg>

      <style>{`
        @keyframes ld-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}