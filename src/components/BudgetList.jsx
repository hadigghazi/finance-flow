import { formatCurrency } from '../utils/formatters';

export const BudgetList = ({ items, currency }) => {
  if (!items.length) return <div className="empty-state">No budgets set for this month yet.</div>;

  return (
    <div className="budget-list">
      {items.map((item) => (
        <div className="budget-item" key={item.id}>
          <div className="budget-header-row">
            <div>
              <strong>{item.category}</strong>
              <p>
                {formatCurrency(item.spent, currency)} of {formatCurrency(item.limit, currency)}
              </p>
            </div>
            <span className={`status-pill ${item.status}`}>{item.percentage}%</span>
          </div>
          <div className="progress-track">
            <div className={`progress-fill ${item.status}`} style={{ width: `${Math.min(item.percentage, 100)}%` }} />
          </div>
          <small>{item.remaining >= 0 ? `${formatCurrency(item.remaining, currency)} remaining` : `${formatCurrency(Math.abs(item.remaining), currency)} over budget`}</small>
        </div>
      ))}
    </div>
  );
};
