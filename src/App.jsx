import { useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { Card } from './components/Card';
import { StatCard } from './components/StatCard';
import { FormSection } from './components/FormSection';
import { TransactionList } from './components/TransactionList';
import { BudgetList } from './components/BudgetList';
import { GoalList } from './components/GoalList';
import { SettingsPanel } from './components/SettingsPanel';
import { CategoryPieChart, MonthlyTrendChart, SavingsGrowthChart } from './components/Charts';
import { WalletLoader } from './components/WalletLoader';
import { useFinance } from './context/FinanceContext';
import { formatCurrency, formatDate } from './utils/formatters';
import {
  buildLocalizedCategoryOptions,
  getLocaleConfig,
  incomeTypeOptions,
  languageOptions,
  localizeCategory,
  localizeOptionValue,
  localizedCategories,
  paymentMethodOptions,
} from './utils/i18n';

const today = new Date().toISOString().slice(0, 10);

function App() {
  const { state, actions, analytics, loading, error } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const language = state.settings.language || 'en';
  const localeConfig = getLocaleConfig(language);
  const locale = localeConfig.locale;
  const copy = localeConfig.common;
  const appCopy = localeConfig.app;
  const currency = state.settings.currency;
  const loadingLabel = language === 'ar' ? 'جارٍ التحميل' : 'Loading';

  const localizedCategoryOptions = useMemo(
    () => buildLocalizedCategoryOptions(state.categories, language),
    [language, state.categories]
  );

  const filteredExpenses = useMemo(
    () =>
      state.expenses.filter(
        (expense) =>
          localizeCategory(expense.category, language).toLowerCase().includes(search.toLowerCase()) ||
          expense.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
          expense.notes?.toLowerCase().includes(search.toLowerCase())
      ),
    [language, search, state.expenses]
  );

  if (loading) {
    return (
      <div className={`app-shell ${state.settings.darkMode ? 'theme-dark' : 'theme-light'}`} dir={localeConfig.dir}>
        <main className="main-content">
          <WalletLoader label={loadingLabel} />
        </main>
      </div>
    );
  }

  const incomeFields = [
    { name: 'amount', label: copy.amount, type: 'number', required: true },
    { name: 'date', label: copy.date, type: 'date', required: true, defaultValue: today },
    { name: 'source', label: copy.source, type: 'text', required: true, placeholder: appCopy.income.sourcePlaceholder },
    { name: 'type', label: copy.type, type: 'select', required: true, options: incomeTypeOptions.map((item) => ({ value: item.value, label: item.label[language] })) },
    { name: 'notes', label: copy.notes, type: 'textarea', full: true, placeholder: appCopy.income.notesPlaceholder },
  ];

  const expenseFields = [
    { name: 'amount', label: copy.amount, type: 'number', required: true },
    { name: 'date', label: copy.date, type: 'date', required: true, defaultValue: today },
    { name: 'category', label: copy.category, type: 'select', required: true, options: localizedCategoryOptions },
    { name: 'subcategory', label: copy.subcategory, type: 'text', placeholder: appCopy.expenses.subcategoryPlaceholder },
    {
      name: 'paymentMethod',
      label: copy.paymentMethod,
      type: 'select',
      options: paymentMethodOptions.map((item) => ({ value: item.value, label: item.label[language] })),
      required: true,
    },
    { name: 'notes', label: copy.notes, type: 'textarea', full: true, placeholder: appCopy.expenses.notesPlaceholder },
  ];

  const savingFields = [
    { name: 'amount', label: copy.amountSaved, type: 'number', required: true },
    { name: 'date', label: copy.date, type: 'date', required: true, defaultValue: today },
    { name: 'note', label: copy.notes, type: 'textarea', full: true, placeholder: appCopy.savings.notePlaceholder },
  ];

  const goalFields = [
    { name: 'name', label: appCopy.goals.name, type: 'text', required: true },
    { name: 'targetAmount', label: copy.targetAmount, type: 'number', required: true },
    { name: 'currentSaved', label: copy.currentSaved, type: 'number', required: true },
    { name: 'deadline', label: copy.deadline, type: 'date' },
    { name: 'notes', label: copy.notes, type: 'textarea', full: true, placeholder: appCopy.goals.notesPlaceholder },
  ];

  const budgetFields = [
    { name: 'month', label: copy.month, type: 'month', required: true, defaultValue: analytics.currentMonth },
    { name: 'category', label: copy.category, type: 'select', required: true, options: localizedCategoryOptions },
    { name: 'limit', label: appCopy.budgets.limit, type: 'number', required: true },
  ];

  const dashboard = (
    <div className="page-grid">
      <div className="stats-grid">
        <StatCard label={appCopy.dashboard.incomeThisMonth} value={analytics.incomeThisMonth} helper={appCopy.dashboard.incomeHelper} currency={currency} locale={locale} />
        <StatCard label={appCopy.dashboard.expensesThisMonth} value={analytics.expensesThisMonth} helper={appCopy.dashboard.expensesHelper} tone="danger" currency={currency} locale={locale} />
        <StatCard label={appCopy.dashboard.netBalance} value={analytics.netThisMonth} helper={appCopy.dashboard.netHelper} tone={analytics.netThisMonth >= 0 ? 'success' : 'danger'} currency={currency} locale={locale} />
        <StatCard label={appCopy.dashboard.totalSavings} value={analytics.totalSavings} helper={appCopy.dashboard.totalSavingsHelper} tone="highlight" currency={currency} locale={locale} />
      </div>

      <div className="page-grid two-columns">
        <Card title={appCopy.dashboard.monthlyCashFlow} subtitle={appCopy.dashboard.monthlyCashFlowSubtitle}>
          <MonthlyTrendChart data={analytics.monthlyTrend} currency={currency} locale={locale} />
        </Card>
        <Card title={appCopy.dashboard.spendingByCategory} subtitle={appCopy.dashboard.spendingByCategorySubtitle}>
          <CategoryPieChart
            data={analytics.categoryTotals.map((item) => ({ ...item, name: localizeCategory(item.name, language) }))}
            currency={currency}
            locale={locale}
          />
        </Card>
      </div>

      <div className="page-grid two-columns">
        <Card title={appCopy.dashboard.budgetUsage} subtitle={appCopy.dashboard.budgetUsageSubtitle}>
          <BudgetList
            items={analytics.budgetStatus.map((item) => ({ ...item, category: localizeCategory(item.category, language) }))}
            currency={currency}
            locale={locale}
            copy={copy}
          />
        </Card>
        <Card title={appCopy.dashboard.goalProgress} subtitle={appCopy.dashboard.goalProgressSubtitle}>
          <GoalList goals={state.goals} currency={currency} locale={locale} copy={copy} />
        </Card>
      </div>

      <Card title={appCopy.dashboard.recentTransactions} subtitle={appCopy.dashboard.recentTransactionsSubtitle}>
        <div className="transactions-stack">
          {analytics.recentTransactions.map((item) => (
            <div key={item.id} className="recent-item">
              <div>
                <strong>{item.entryType === 'income' ? item.source : localizeCategory(item.category, language)}</strong>
                <p>
                  {formatDate(item.date, locale)} |{' '}
                  {item.entryType === 'income'
                    ? localizeOptionValue(incomeTypeOptions, item.type, language)
                    : localizeOptionValue(paymentMethodOptions, item.paymentMethod, language)}
                </p>
              </div>
              <span className={item.entryType === 'income' ? 'positive' : 'negative'}>
                {item.entryType === 'income' ? '+' : '-'}
                {formatCurrency(item.amount, currency, locale)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const incomePage = (
    <div className="page-grid two-columns">
      <Card title={appCopy.income.addIncome} subtitle={appCopy.income.addIncomeSubtitle}>
        <FormSection fields={incomeFields} onSubmit={actions.addIncome} submitLabel={appCopy.income.submit} selectLabel={copy.select} />
      </Card>
      <Card title={appCopy.income.incomeHistory} subtitle={appCopy.income.incomeHistorySubtitle}>
        <TransactionList
          items={state.incomes.map((item) => ({
            ...item,
            type: localizeOptionValue(incomeTypeOptions, item.type, language),
          }))}
          type="income"
          currency={currency}
          locale={locale}
          copy={copy}
          onDelete={(id) => actions.deleteEntry('incomes', id)}
        />
      </Card>
    </div>
  );

  const expensesPage = (
    <div className="page-grid two-columns">
      <Card title={appCopy.expenses.addExpense} subtitle={appCopy.expenses.addExpenseSubtitle}>
        <FormSection fields={expenseFields} onSubmit={actions.addExpense} submitLabel={appCopy.expenses.submit} selectLabel={copy.select} />
        <div className="inline-actions">
          <input
            type="text"
            placeholder={copy.addCustomCategory}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                actions.addCategory(e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
        </div>
      </Card>
      <Card
        title={appCopy.expenses.expenseHistory}
        subtitle={appCopy.expenses.expenseHistorySubtitle}
        action={<input className="search-input" placeholder={copy.searchExpenses} value={search} onChange={(e) => setSearch(e.target.value)} />}
      >
        <TransactionList
          items={filteredExpenses.map((item) => ({
            ...item,
            category: localizeCategory(item.category, language),
            paymentMethod: localizeOptionValue(paymentMethodOptions, item.paymentMethod, language),
          }))}
          type="expense"
          currency={currency}
          locale={locale}
          copy={copy}
          onDelete={(id) => actions.deleteEntry('expenses', id)}
        />
      </Card>
    </div>
  );

  const savingsPage = (
    <div className="page-grid two-columns">
      <Card title={appCopy.savings.overview} subtitle={appCopy.savings.overviewSubtitle}>
        <div className="stats-grid single-column">
          <StatCard label={appCopy.savings.startingSavings} value={state.savings.startingBalance} helper={appCopy.savings.startingSavingsHelper} currency={currency} locale={locale} />
          <StatCard label={appCopy.savings.generalSaved} value={state.savings.generalSaved} helper={appCopy.savings.generalSavedHelper} tone="success" currency={currency} locale={locale} />
          <StatCard label={appCopy.savings.reservedForGoals} value={analytics.goalReserved} helper={appCopy.savings.reservedForGoalsHelper} tone="highlight" currency={currency} locale={locale} />
          <StatCard label={appCopy.savings.totalSavingsBalance} value={analytics.totalSavings} helper={appCopy.savings.totalSavingsBalanceHelper} tone="highlight" currency={currency} locale={locale} />
        </div>
      </Card>
      <Card title={appCopy.savings.addSavingsEntry} subtitle={appCopy.savings.addSavingsEntrySubtitle}>
        <FormSection fields={savingFields} onSubmit={actions.addSavingsEntry} submitLabel={appCopy.savings.submit} selectLabel={copy.select} />
      </Card>
      <Card title={appCopy.savings.savingsGrowth} subtitle={appCopy.savings.savingsGrowthSubtitle} className="span-2">
        <SavingsGrowthChart data={analytics.savingsGrowth} currency={currency} locale={locale} />
      </Card>
    </div>
  );

  const goalsPage = (
    <div className="page-grid two-columns">
      <Card title={appCopy.goals.createGoal} subtitle={appCopy.goals.createGoalSubtitle}>
        <FormSection fields={goalFields} onSubmit={actions.addGoal} submitLabel={appCopy.goals.submit} selectLabel={copy.select} />
      </Card>
      <Card title={appCopy.goals.activeGoals} subtitle={appCopy.goals.activeGoalsSubtitle}>
        <GoalList goals={state.goals} currency={currency} locale={locale} copy={copy} />
      </Card>
    </div>
  );

  const budgetsPage = (
    <div className="page-grid two-columns">
      <Card title={appCopy.budgets.createBudget} subtitle={appCopy.budgets.createBudgetSubtitle}>
        <FormSection fields={budgetFields} onSubmit={actions.addBudget} submitLabel={appCopy.budgets.submit} selectLabel={copy.select} />
      </Card>
      <Card title={appCopy.budgets.budgetStatus} subtitle={appCopy.budgets.budgetStatusSubtitle}>
        <BudgetList
          items={analytics.budgetStatus.map((item) => ({ ...item, category: localizeCategory(item.category, language) }))}
          currency={currency}
          locale={locale}
          copy={copy}
        />
      </Card>
    </div>
  );

  const analyticsPage = (
    <div className="page-grid two-columns">
      <Card title={appCopy.analytics.monthlyIncomeVsExpenses} subtitle={appCopy.analytics.monthlyIncomeVsExpensesSubtitle}>
        <MonthlyTrendChart data={analytics.monthlyTrend} currency={currency} locale={locale} />
      </Card>
      <Card title={appCopy.analytics.savingsGrowthOverTime} subtitle={appCopy.analytics.savingsGrowthOverTimeSubtitle}>
        <SavingsGrowthChart data={analytics.savingsGrowth} currency={currency} locale={locale} />
      </Card>
      <Card title={appCopy.analytics.topCategories} subtitle={appCopy.analytics.topCategoriesSubtitle}>
        <div className="list-stack">
          {analytics.topCategories.map((item) => (
            <div className="list-item" key={item.category}>
              <span>{localizeCategory(item.category, language)}</span>
              <strong>{formatCurrency(item.amount, currency, locale)}</strong>
            </div>
          ))}
        </div>
      </Card>
      <Card title={appCopy.analytics.monthlyOverview} subtitle={appCopy.analytics.monthlyOverviewSubtitle}>
        <div className="list-stack">
          <div className="list-item"><span>{copy.income}</span><strong>{formatCurrency(analytics.incomeThisMonth, currency, locale)}</strong></div>
          <div className="list-item"><span>{copy.expenses}</span><strong>{formatCurrency(analytics.expensesThisMonth, currency, locale)}</strong></div>
          <div className="list-item"><span>{appCopy.dashboard.netBalance}</span><strong>{formatCurrency(analytics.netThisMonth, currency, locale)}</strong></div>
          <div className="list-item"><span>{appCopy.dashboard.totalSavings}</span><strong>{formatCurrency(analytics.totalSavings, currency, locale)}</strong></div>
        </div>
      </Card>
    </div>
  );

  const pages = {
    dashboard,
    income: incomePage,
    expenses: expensesPage,
    savings: savingsPage,
    goals: goalsPage,
    budgets: budgetsPage,
    analytics: analyticsPage,
    settings: (
      <SettingsPanel
        state={state}
        actions={actions}
        copy={copy}
        locale={locale}
        language={language}
        languageOptions={languageOptions}
      />
    ),
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      {error ? <div className="status-banner error-banner">{error}</div> : null}
      {pages[activeTab]}
    </Layout>
  );
}

export default App;
