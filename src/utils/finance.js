import { getMonthKey } from './formatters';

export const calculateDashboardMetrics = (state) => {
  const currentMonth = getMonthKey();
  const incomesThisMonth = state.incomes.filter((item) => item.date.startsWith(currentMonth));
  const expensesThisMonth = state.expenses.filter((item) => item.date.startsWith(currentMonth));
  const incomeThisMonth = incomesThisMonth.reduce((sum, item) => sum + Number(item.amount), 0);
  const expensesThisMonthTotal = expensesThisMonth.reduce((sum, item) => sum + Number(item.amount), 0);
  const generalSavings = Number(state.savings.startingBalance) + Number(state.savings.generalSaved);
  const goalReserved = state.goals.reduce((sum, goal) => sum + Number(goal.currentSaved), 0);
  const totalSavings = generalSavings + goalReserved;
  const topCategories = Object.entries(
    expensesThisMonth.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {})
  )
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    currentMonth,
    incomeThisMonth,
    expensesThisMonth: expensesThisMonthTotal,
    netThisMonth: incomeThisMonth - expensesThisMonthTotal,
    totalSavings,
    generalSavings,
    goalReserved,
    topCategories,
  };
};

export const buildMonthlyTrend = (state) => {
  const months = new Map();

  [...state.incomes, ...state.expenses].forEach((item) => {
    const month = getMonthKey(item.date);
    if (!months.has(month)) {
      months.set(month, { month, income: 0, expenses: 0 });
    }
  });

  Array.from(months.values()).forEach((monthItem) => {
    monthItem.income = state.incomes
      .filter((item) => getMonthKey(item.date) === monthItem.month)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    monthItem.expenses = state.expenses
      .filter((item) => getMonthKey(item.date) === monthItem.month)
      .reduce((sum, item) => sum + Number(item.amount), 0);
    monthItem.net = monthItem.income - monthItem.expenses;
  });

  return Array.from(months.values()).sort((a, b) => a.month.localeCompare(b.month));
};

export const buildCategoryTotals = (expenses, month) => {
  return Object.entries(
    expenses
      .filter((item) => !month || getMonthKey(item.date) === month)
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));
};

export const buildBudgetStatus = (state, month) => {
  const targetMonth = month || getMonthKey();

  return state.budgets
    .filter((budget) => budget.month === targetMonth)
    .map((budget) => {
      const spent = state.expenses
        .filter((expense) => expense.category === budget.category && getMonthKey(expense.date) === targetMonth)
        .reduce((sum, item) => sum + Number(item.amount), 0);
      const percentage = budget.limit ? Math.round((spent / budget.limit) * 100) : 0;

      return {
        ...budget,
        spent,
        remaining: Number(budget.limit) - spent,
        percentage,
        status: percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'good',
      };
    })
    .sort((a, b) => b.percentage - a.percentage);
};

export const buildSavingsGrowth = (state) => {
  const trend = buildMonthlyTrend(state);
  let cumulative = Number(state.savings.startingBalance);

  return trend.map((item) => {
    const savedThisMonth = state.savings.history
      .filter((entry) => getMonthKey(entry.date) === item.month)
      .reduce((sum, entry) => sum + Number(entry.amount), 0);
    cumulative += savedThisMonth;
    return {
      month: item.month,
      savings: cumulative,
    };
  });
};

export const buildRecentTransactions = (state) => {
  return [
    ...state.incomes.map((item) => ({ ...item, entryType: 'income' })),
    ...state.expenses.map((item) => ({ ...item, entryType: 'expense' })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);
};
