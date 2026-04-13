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
import { useFinance } from './context/FinanceContext';
import { formatCurrency, formatDate } from './utils/formatters';

const today = new Date().toISOString().slice(0, 10);

function App() {
  const { state, actions, analytics, loading, error } = useFinance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const currency = state.settings.currency;

  const filteredExpenses = useMemo(
    () =>
      state.expenses.filter(
        (expense) =>
          expense.category.toLowerCase().includes(search.toLowerCase()) ||
          expense.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
          expense.notes?.toLowerCase().includes(search.toLowerCase())
      ),
    [search, state.expenses]
  );

  if (loading) {
    return (
      <div className={`app-shell ${state.settings.darkMode ? 'theme-dark' : 'theme-light'} boot-shell`}>
        <main className="main-content">
          <div className="card">
            <h3>Loading your finance workspace</h3>
            <p className="boot-copy">Fetching your saved data from MongoDB so you can pick up where you left off.</p>
          </div>
        </main>
      </div>
    );
  }

  const incomeFields = [
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true, defaultValue: today },
    { name: 'source', label: 'Source', type: 'text', required: true, placeholder: 'Main job, freelance, gift...' },
    { name: 'type', label: 'Type', type: 'select', required: true, options: ['salary', 'freelance', 'gift', 'refund', 'other'] },
    { name: 'notes', label: 'Notes', type: 'textarea', full: true, placeholder: 'Optional notes' },
  ];

  const expenseFields = [
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true, defaultValue: today },
    { name: 'category', label: 'Category', type: 'select', required: true, options: state.categories },
    { name: 'subcategory', label: 'Subcategory', type: 'text', placeholder: 'Groceries, fuel, lunch...' },
    { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'Card', 'Transfer', 'Wallet'], required: true },
    { name: 'notes', label: 'Notes', type: 'textarea', full: true, placeholder: 'Optional note' },
  ];

  const savingFields = [
    { name: 'amount', label: 'Amount saved', type: 'number', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true, defaultValue: today },
    { name: 'note', label: 'Note', type: 'textarea', full: true, placeholder: 'Salary top-up, bonus, monthly saving...' },
  ];

  const goalFields = [
    { name: 'name', label: 'Goal name', type: 'text', required: true },
    { name: 'targetAmount', label: 'Target amount', type: 'number', required: true },
    { name: 'currentSaved', label: 'Current saved', type: 'number', required: true },
    { name: 'deadline', label: 'Deadline', type: 'date' },
    { name: 'notes', label: 'Notes', type: 'textarea', full: true, placeholder: 'Optional notes' },
  ];

  const budgetFields = [
    { name: 'month', label: 'Month', type: 'month', required: true, defaultValue: analytics.currentMonth },
    { name: 'category', label: 'Category', type: 'select', required: true, options: state.categories },
    { name: 'limit', label: 'Budget limit', type: 'number', required: true },
  ];

  const dashboard = (
    <div className="page-grid">
      <div className="stats-grid">
        <StatCard label="Income this month" value={analytics.incomeThisMonth} helper="All salary and other inflows" currency={currency} />
        <StatCard label="Expenses this month" value={analytics.expensesThisMonth} helper="Everything you spent so far" tone="danger" currency={currency} />
        <StatCard label="Net balance" value={analytics.netThisMonth} helper="Income minus expenses" tone={analytics.netThisMonth >= 0 ? 'success' : 'danger'} currency={currency} />
        <StatCard label="Total savings" value={analytics.totalSavings} helper="Starting balance + saved + goal reserves" tone="highlight" currency={currency} />
      </div>

      <div className="page-grid two-columns">
        <Card title="Monthly cash flow" subtitle="Compare monthly income and expenses at a glance.">
          <MonthlyTrendChart data={analytics.monthlyTrend} currency={currency} />
        </Card>
        <Card title="Spending by category" subtitle="Where your money is going this month.">
          <CategoryPieChart data={analytics.categoryTotals} currency={currency} />
        </Card>
      </div>

      <div className="page-grid two-columns">
        <Card title="Budget usage" subtitle="See where you're close to the limit.">
          <BudgetList items={analytics.budgetStatus} currency={currency} />
        </Card>
        <Card title="Saving goals progress" subtitle="Track dedicated goals separately from general savings.">
          <GoalList goals={state.goals} currency={currency} />
        </Card>
      </div>

      <Card title="Recent transactions" subtitle="Latest money movements across income and expenses.">
        <div className="transactions-stack">
          {analytics.recentTransactions.map((item) => (
            <div key={item.id} className="recent-item">
              <div>
                <strong>{item.entryType === 'income' ? item.source : item.category}</strong>
                <p>{formatDate(item.date)} | {item.entryType === 'income' ? item.type : item.paymentMethod}</p>
              </div>
              <span className={item.entryType === 'income' ? 'positive' : 'negative'}>
                {item.entryType === 'income' ? '+' : '-'}{formatCurrency(item.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const incomePage = (
    <div className="page-grid two-columns">
      <Card title="Add income" subtitle="Log salary, freelance work, gifts, refunds, and more.">
        <FormSection fields={incomeFields} onSubmit={actions.addIncome} submitLabel="Add income entry" />
      </Card>
      <Card title="Income history" subtitle="All recorded income entries.">
        <TransactionList items={state.incomes} type="income" currency={currency} onDelete={(id) => actions.deleteEntry('incomes', id)} />
      </Card>
    </div>
  );

  const expensesPage = (
    <div className="page-grid two-columns">
      <Card title="Add expense" subtitle="Keep track of everything you spend.">
        <FormSection fields={expenseFields} onSubmit={actions.addExpense} submitLabel="Add expense entry" />
        <div className="inline-actions">
          <input type="text" placeholder="Add custom category" onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              actions.addCategory(e.currentTarget.value.trim());
              e.currentTarget.value = '';
            }
          }} />
        </div>
      </Card>
      <Card
        title="Expense history"
        subtitle="Search by category, subcategory, or notes."
        action={<input className="search-input" placeholder="Search expenses" value={search} onChange={(e) => setSearch(e.target.value)} />}
      >
        <TransactionList items={filteredExpenses} type="expense" currency={currency} onDelete={(id) => actions.deleteEntry('expenses', id)} />
      </Card>
    </div>
  );

  const savingsPage = (
    <div className="page-grid two-columns">
      <Card title="Savings overview" subtitle="Separate starting savings, general savings, and goal reserves clearly.">
        <div className="stats-grid single-column">
          <StatCard label="Starting savings" value={state.savings.startingBalance} helper="Existing balance before using the app" currency={currency} />
          <StatCard label="General money saved" value={state.savings.generalSaved} helper="Savings added through normal saving entries" tone="success" currency={currency} />
          <StatCard label="Reserved for goals" value={analytics.goalReserved} helper="Money currently allocated to saving goals" tone="highlight" currency={currency} />
          <StatCard label="Total savings balance" value={analytics.totalSavings} helper="Your complete savings picture" tone="highlight" currency={currency} />
        </div>
      </Card>
      <Card title="Add savings entry" subtitle="Record money you want to add to your general savings pool.">
        <FormSection fields={savingFields} onSubmit={actions.addSavingsEntry} submitLabel="Add savings entry" />
      </Card>
      <Card title="Savings growth" subtitle="Watch your total saved amount grow over time." className="span-2">
        <SavingsGrowthChart data={analytics.savingsGrowth} currency={currency} />
      </Card>
    </div>
  );

  const goalsPage = (
    <div className="page-grid two-columns">
      <Card title="Create saving goal" subtitle="Track dedicated money targets like a laptop, phone, trip, or emergency fund.">
        <FormSection fields={goalFields} onSubmit={actions.addGoal} submitLabel="Create goal" />
      </Card>
      <Card title="Active goals" subtitle="See progress and target dates clearly.">
        <GoalList goals={state.goals} currency={currency} />
      </Card>
    </div>
  );

  const budgetsPage = (
    <div className="page-grid two-columns">
      <Card title="Create monthly budget" subtitle="Set category limits and see warnings as you approach them.">
        <FormSection fields={budgetFields} onSubmit={actions.addBudget} submitLabel="Save budget" />
      </Card>
      <Card title="Budget status" subtitle="Live progress for the current month.">
        <BudgetList items={analytics.budgetStatus} currency={currency} />
      </Card>
    </div>
  );

  const analyticsPage = (
    <div className="page-grid two-columns">
      <Card title="Monthly income vs expenses" subtitle="A clearer view of your financial rhythm.">
        <MonthlyTrendChart data={analytics.monthlyTrend} currency={currency} />
      </Card>
      <Card title="Savings growth over time" subtitle="How your savings balance changes month to month.">
        <SavingsGrowthChart data={analytics.savingsGrowth} currency={currency} />
      </Card>
      <Card title="Top categories this month" subtitle="Largest expense areas right now.">
        <div className="list-stack">
          {analytics.topCategories.map((item) => (
            <div className="list-item" key={item.category}>
              <span>{item.category}</span>
              <strong>{formatCurrency(item.amount, currency)}</strong>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Monthly overview" subtitle="Fast summary for the current month.">
        <div className="list-stack">
          <div className="list-item"><span>Income</span><strong>{formatCurrency(analytics.incomeThisMonth, currency)}</strong></div>
          <div className="list-item"><span>Expenses</span><strong>{formatCurrency(analytics.expensesThisMonth, currency)}</strong></div>
          <div className="list-item"><span>Net</span><strong>{formatCurrency(analytics.netThisMonth, currency)}</strong></div>
          <div className="list-item"><span>Total savings</span><strong>{formatCurrency(analytics.totalSavings, currency)}</strong></div>
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
    settings: <SettingsPanel state={state} actions={actions} />,
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      {error ? <div className="status-banner error-banner">{error}</div> : null}
      {pages[activeTab]}
    </Layout>
  );
}

export default App;
