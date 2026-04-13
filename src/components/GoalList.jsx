import { formatCurrency, formatDate } from '../utils/formatters';

export const GoalList = ({ goals, currency = 'USD' }) => {
  if (!goals.length) return <div className="empty-state">No saving goals yet. Add one to plan ahead.</div>;

  return (
    <div className="goal-list">
      {goals.map((goal) => {
        const progress = Math.round((goal.currentSaved / goal.targetAmount) * 100);
        return (
          <div className="goal-card" key={goal.id}>
            <div className="budget-header-row">
              <div>
                <strong>{goal.name}</strong>
                <p>
                  {formatCurrency(goal.currentSaved, currency)} of {formatCurrency(goal.targetAmount, currency)}
                </p>
              </div>
              <span className="status-pill neutral">{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill neutral" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <small>{goal.deadline ? `Target by ${formatDate(goal.deadline)}` : 'Flexible target date'}</small>
          </div>
        );
      })}
    </div>
  );
};
