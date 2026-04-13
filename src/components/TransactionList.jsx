import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const TransactionList = ({ items, type, currency = 'USD', onDelete }) => {
  if (!items.length) {
    return <div className="empty-state">No {type} entries yet. Add one to start tracking.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>{type === 'income' ? 'Source' : 'Category'}</th>
            <th>Details</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{formatDate(item.date)}</td>
              <td>{type === 'income' ? item.source : item.category}</td>
              <td>{type === 'income' ? item.type : item.subcategory || item.paymentMethod || '-'}</td>
              <td>{formatCurrency(item.amount, currency)}</td>
              <td>
                <button className="ghost-button" onClick={() => onDelete(item.id)}>
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
