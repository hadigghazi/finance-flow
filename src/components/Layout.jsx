import { BarChart3, PiggyBank, Receipt, Wallet, Target, Settings, Landmark, Menu, Moon, Sun } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { getLocaleConfig } from '../utils/i18n';

const navItems = [
  { key: 'dashboard', icon: BarChart3 },
  { key: 'income', icon: Wallet },
  { key: 'expenses', icon: Receipt },
  { key: 'savings', icon: PiggyBank },
  { key: 'goals', icon: Target },
  { key: 'budgets', icon: Landmark },
  { key: 'analytics', icon: BarChart3 },
  { key: 'settings', icon: Settings },
];

export const Layout = ({ activeTab, setActiveTab, children, sidebarOpen, setSidebarOpen }) => {
  const { state, actions, saving, error } = useFinance();
  const language = state.settings.language || 'en';
  const localeConfig = getLocaleConfig(language);
  const activeItem = navItems.find((item) => item.key === activeTab);

  return (
    <div className={`app-shell ${state.settings.darkMode ? 'theme-dark' : 'theme-light'}`} dir={localeConfig.dir}>
      <div className="app-ambient" aria-hidden="true" />
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-badge">F</div>
          <div>
            <span className="brand-kicker">{localeConfig.common.brandKicker}</span>
            <h1>Finance Flow</h1>
            <p>{localeConfig.common.brandSubtitle}</p>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ key, icon: Icon }) => (
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
              <span>{localeConfig.common[key]}</span>
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
              <span className="eyebrow">{localeConfig.common.overview}</span>
              <h2>{activeItem ? localeConfig.common[activeItem.key] : ''}</h2>
              <p>{localeConfig.common.pageSubtitle}</p>
            </div>
          </div>

          <div className="topbar-right">
            <span className={`sync-pill ${error ? 'error' : saving ? 'saving' : 'saved'}`}>
              {error ? localeConfig.common.mongodbSyncFailed : saving ? localeConfig.common.saving : localeConfig.common.synced}
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
