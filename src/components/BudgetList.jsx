import { formatCurrency } from '../utils/formatters';

export const BudgetList = ({ items, currency, locale = 'en-US', copy }) => {
  if (!items.length) return <div className="empty-state">{copy.noBudgets}</div>;

  return (
    <div className="budget-list">
      {items.map((item) => (
        <div className="budget-item" key={item.id}>
          <div className="budget-header-row">
            <div>
              <strong>{item.category}</strong>
              <p>
                {formatCurrency(item.spent, currency, locale)} {copy.of} {formatCurrency(item.limit, currency, locale)}
              </p>
            </div>
            <span className={`status-pill ${item.status}`}>{item.percentage}%</span>
          </div>
          <div className="progress-track">
            <div className={`progress-fill ${item.status}`} style={{ width: `${Math.min(item.percentage, 100)}%` }} />
          </div>
          <small>{item.remaining >= 0 ? `${formatCurrency(item.remaining, currency, locale)} ${copy.remaining}` : `${formatCurrency(Math.abs(item.remaining), currency, locale)} ${copy.overBudget}`}</small>
        </div>
      ))}
    </div>
  );
};
