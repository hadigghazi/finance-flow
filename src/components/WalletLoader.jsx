export function WalletLoader({ title, description, label }) {
  return (
    <div className="boot-screen" aria-live="polite" aria-busy="true">
      <div className="boot-card">
        <div className="boot-orb boot-orb-left" />
        <div className="boot-orb boot-orb-right" />

        <div className="boot-loader-wrap">
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

        <div className="boot-copy-block">
          <span className="boot-kicker">Secure Sync</span>
          <h1 className="boot-title">{title}</h1>
          <p className="boot-copy">{description}</p>
        </div>
      </div>
    </div>
  );
}
