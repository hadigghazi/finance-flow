import { formatCurrency } from '../utils/formatters';

export const StatCard = ({ label, value, helper, tone = 'default', currency = 'USD', locale = 'en-US' }) => (
  <div className={`stat-card tone-${tone}`}>
    <div className="stat-card-label-row">
      <span>{label}</span>
      <span className="stat-card-pulse" aria-hidden="true" />
    </div>
    <strong>{formatCurrency(value, currency, locale)}</strong>
    <small>{helper}</small>
  </div>
);
