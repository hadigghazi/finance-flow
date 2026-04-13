import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionList = ({ items, type, currency = 'USD', locale = 'en-US', copy, onDelete }) => {
  if (!items.length) {
    return <div className="empty-state">{type === 'income' ? copy.noIncomeEntries : copy.noExpenseEntries}</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>{copy.date}</th>
            <th>{type === 'income' ? copy.source : copy.category}</th>
            <th>{copy.details}</th>
            <th>{copy.amount}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{formatDate(item.date, locale)}</td>
              <td>{type === 'income' ? item.source : item.category}</td>
              <td>{type === 'income' ? item.type : item.subcategory || item.paymentMethod || '-'}</td>
              <td>{formatCurrency(item.amount, currency, locale)}</td>
              <td>
                <button className="ghost-button" type="button" aria-label={copy.delete} onClick={() => onDelete(item.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
