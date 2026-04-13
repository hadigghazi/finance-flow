import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency, formatMonthLabel } from '../utils/formatters';

const fallbackColors = ['#0084b6', '#2fa7df', '#005a7d', '#7ac9ee', '#1bb36a', '#d68a00'];

const CustomTooltip = ({ active, payload, label, currency, locale = 'en-US' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p>{label?.includes('-') ? formatMonthLabel(label, locale) : label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="tooltip-row">
          <span>{entry.name}</span>
          <strong>{formatCurrency(entry.value, currency, locale)}</strong>
        </div>
      ))}
    </div>
  );
};

export const MonthlyTrendChart = ({ data, currency, locale = 'en-US' }) => (
  <div className="chart-box">
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2fa7df" />
            <stop offset="100%" stopColor="#0084b6" />
          </linearGradient>
          <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#005a7d" />
            <stop offset="100%" stopColor="#0b1520" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
        <XAxis dataKey="month" tickFormatter={(value) => formatMonthLabel(value, locale)} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip currency={currency} locale={locale} />} />
        <Bar dataKey="income" fill="url(#incomeBar)" radius={[10, 10, 0, 0]} />
        <Bar dataKey="expenses" fill="url(#expenseBar)" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const CategoryPieChart = ({ data, currency, locale = 'en-US' }) => (
  <div className="chart-box">
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, index) => (
            <Cell key={index} fill={fallbackColors[index % fallbackColors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip currency={currency} locale={locale} />} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export const SavingsGrowthChart = ({ data, currency, locale = 'en-US' }) => (
  <div className="chart-box">
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="savingsArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0084b6" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#0084b6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
        <XAxis dataKey="month" tickFormatter={(value) => formatMonthLabel(value, locale)} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip currency={currency} locale={locale} />} />
        <Area type="monotone" dataKey="savings" stroke="#0084b6" strokeWidth={3} fill="url(#savingsArea)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
