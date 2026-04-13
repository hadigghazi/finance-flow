export const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatMonthLabel = (month) => {
  if (!month) return '';
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const getMonthKey = (date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const sortByDateDesc = (a, b) => new Date(b.date) - new Date(a.date);
