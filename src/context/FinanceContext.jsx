import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createEmptyData, normalizeFinanceState } from '../data/defaultData';
import {
  buildBudgetStatus,
  buildCategoryTotals,
  buildMonthlyTrend,
  buildRecentTransactions,
  buildSavingsGrowth,
  calculateDashboardMetrics,
} from '../utils/finance';
import { getMonthKey } from '../utils/formatters';

const FinanceContext = createContext(null);

const requestFinanceState = async (options = {}) => {
  const response = await fetch('/api/finance', {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || 'Unable to save your finance data right now.');
  }

  return normalizeFinanceState(payload?.state);
};

export const FinanceProvider = ({ children }) => {
  const [state, setState] = useState(() => createEmptyData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let cancelled = false;

    const loadState = async () => {
      setLoading(true);
      setError('');

      try {
        const loadedState = await requestFinanceState();
        if (!cancelled) {
          setState(loadedState);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadState();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistState = async (updater) => {
    const previousState = stateRef.current;
    const nextState = normalizeFinanceState(typeof updater === 'function' ? updater(previousState) : updater);

    setState(nextState);
    stateRef.current = nextState;
    setSaving(true);
    setError('');

    try {
      const savedState = await requestFinanceState({
        method: 'PUT',
        body: JSON.stringify({ state: nextState }),
      });
      setState(savedState);
      stateRef.current = savedState;
      return savedState;
    } catch (saveError) {
      setState(previousState);
      stateRef.current = previousState;
      setError(saveError.message);
      return previousState;
    } finally {
      setSaving(false);
    }
  };

  const actions = {
    addIncome: (payload) =>
      persistState((prev) => ({
        ...prev,
        incomes: [{ id: crypto.randomUUID(), ...payload }, ...prev.incomes],
      })),
    addExpense: (payload) =>
      persistState((prev) => ({
        ...prev,
        expenses: [{ id: crypto.randomUUID(), ...payload }, ...prev.expenses],
      })),
    addBudget: (payload) =>
      persistState((prev) => ({
        ...prev,
        budgets: [{ id: crypto.randomUUID(), ...payload }, ...prev.budgets],
      })),
    addGoal: (payload) =>
      persistState((prev) => ({
        ...prev,
        goals: [{ id: crypto.randomUUID(), ...payload }, ...prev.goals],
      })),
    addSavingsEntry: (payload) =>
      persistState((prev) => ({
        ...prev,
        savings: {
          ...prev.savings,
          generalSaved: Number(prev.savings.generalSaved) + Number(payload.amount),
          history: [{ id: crypto.randomUUID(), ...payload }, ...prev.savings.history],
        },
      })),
    updateStartingSavings: (value) =>
      persistState((prev) => ({
        ...prev,
        savings: {
          ...prev.savings,
          startingBalance: Number(value),
        },
      })),
    addCategory: (category) =>
      persistState((prev) => ({
        ...prev,
        categories: prev.categories.includes(category) ? prev.categories : [...prev.categories, category],
      })),
    updateDarkMode: () =>
      persistState((prev) => ({
        ...prev,
        settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
      })),
    updateLanguage: (value) =>
      persistState((prev) => ({
        ...prev,
        settings: { ...prev.settings, language: value },
      })),
    deleteEntry: (collection, id) =>
      persistState((prev) => ({
        ...prev,
        [collection]: prev[collection].filter((item) => item.id !== id),
      })),
    exportData: () => JSON.stringify(state, null, 2),
    importData: (payload) => persistState(payload),
    resetData: () => persistState(createEmptyData()),
  };

  const analytics = useMemo(() => {
    const metrics = calculateDashboardMetrics(state);
    return {
      ...metrics,
      monthlyTrend: buildMonthlyTrend(state),
      categoryTotals: buildCategoryTotals(state.expenses, getMonthKey()),
      budgetStatus: buildBudgetStatus(state, getMonthKey()),
      savingsGrowth: buildSavingsGrowth(state),
      recentTransactions: buildRecentTransactions(state),
    };
  }, [state]);

  return <FinanceContext.Provider value={{ state, actions, analytics, loading, saving, error }}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
