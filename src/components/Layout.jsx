import { BarChart3, PiggyBank, Receipt, Wallet, Target, Settings, Landmark, Menu, Moon, Sun } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'income', label: 'Income', icon: Wallet },
  { key: 'expenses', label: 'Expenses', icon: Receipt },
  { key: 'savings', label: 'Savings', icon: PiggyBank },
  { key: 'goals', label: 'Saving Goals', icon: Target },
  { key: 'budgets', label: 'Budgets', icon: Landmark },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export const Layout = ({ activeTab, setActiveTab, children, sidebarOpen, setSidebarOpen }) => {
  const { state, actions, saving, error } = useFinance();
  const activeItem = navItems.find((item) => item.key === activeTab);

  return (
    <div className={`app-shell ${state.settings.darkMode ? 'theme-dark' : 'theme-light'}`}>
      <div className="app-ambient" aria-hidden="true" />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-badge">F</div>
          <div>
            <span className="brand-kicker">Finance OS</span>
            <h1>Finance Flow</h1>
            <p>Personal wealth cockpit</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`nav-item ${activeTab === key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(key);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-item-indicator" />
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-only" onClick={() => setSidebarOpen((prev) => !prev)}>
              <Menu size={18} />
            </button>
            <div className="page-intro">
              <span className="eyebrow">Overview</span>
              <h2>{activeItem?.label}</h2>
              <p>Track money clearly, plan smarter, and stay ahead every month.</p>
            </div>
          </div>

          <div className="topbar-right">
            <span className={`sync-pill ${error ? 'error' : saving ? 'saving' : 'saved'}`}>
              {error ? 'MongoDB sync failed' : saving ? 'Saving...' : 'MongoDB synced'}
            </span>
            <button className="icon-button" onClick={actions.updateDarkMode}>
              {state.settings.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <div className="content-stage">{children}</div>
      </main>
      <div className={`sidebar-scrim ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />
    </div>
  );
};
