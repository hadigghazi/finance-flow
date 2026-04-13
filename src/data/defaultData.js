export const defaultCategories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Health',
  'Subscriptions',
  'Personal',
  'Family',
  'Other',
];

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const withIds = (items) =>
  ensureArray(items).map((item) => ({
    ...(item || {}),
    id: item?.id || crypto.randomUUID(),
  }));

export const createEmptyData = () => ({
  settings: {
    currency: 'USD',
    darkMode: false,
  },
  savings: {
    startingBalance: 0,
    generalSaved: 0,
    history: [],
  },
  categories: [...defaultCategories],
  incomes: [],
  expenses: [],
  goals: [],
  budgets: [],
});

export const normalizeFinanceState = (value = {}) => {
  const empty = createEmptyData();

  return {
    settings: {
      ...empty.settings,
      ...(value.settings || {}),
    },
    savings: {
      ...empty.savings,
      ...(value.savings || {}),
      history: withIds(value.savings?.history),
    },
    categories:
      ensureArray(value.categories).filter(Boolean).length > 0
        ? [...new Set(value.categories.filter(Boolean))]
        : empty.categories,
    incomes: withIds(value.incomes),
    expenses: withIds(value.expenses),
    goals: withIds(value.goals),
    budgets: withIds(value.budgets),
  };
};
