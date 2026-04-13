export function WalletLoader({ label }) {
  return (
    <div className="boot-screen" aria-live="polite" aria-busy="true" aria-label={label}>
      <div className="wallet-loader" aria-hidden="true">
        <div className="wallet-back" />
        <div className="bill bill-1" />
        <div className="bill bill-2" />
        <div className="bill bill-3" />
        <div className="wallet-front">
          <div className="text">
            {label}
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
