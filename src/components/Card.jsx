export const Card = ({ title, subtitle, action, children, className = '' }) => (
  <section className={`card ${className}`}>
    {(title || subtitle || action) && (
      <div className="card-header">
        <div className="card-copy">
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action ? <div className="card-action">{action}</div> : null}
      </div>
    )}
    {children}
  </section>
);
