import { useRef } from 'react';
import { Card } from './Card';

export const SettingsPanel = ({ state, actions }) => {
  const fileRef = useRef(null);

  const handleExport = () => {
    const blob = new Blob([actions.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-flow-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        actions.importData(parsed);
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    const confirmed = window.confirm('This will permanently clear your saved data in MongoDB and start you from a blank workspace. Continue?');
    if (confirmed) {
      actions.resetData();
    }
  };

  return (
    <div className="page-grid two-columns">
      <Card title="Preferences" subtitle="Personalize the app and update your savings baseline.">
        <div className="stack-row">
          <label className="field">
            <span>Starting savings balance</span>
            <input
              type="number"
              value={state.savings.startingBalance}
              onChange={(e) => actions.updateStartingSavings(e.target.value)}
            />
          </label>
        </div>
      </Card>

      <Card title="Data management" subtitle="Your tracker now persists to MongoDB, and you can still back it up locally whenever you want.">
        <div className="action-group">
          <button className="primary-button" type="button" onClick={handleExport}>Export JSON</button>
          <button className="secondary-button" type="button" onClick={() => fileRef.current?.click()}>Import JSON</button>
          <button className="ghost-action danger-text" type="button" onClick={handleClear}>Clear all saved data</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
        </div>
      </Card>
    </div>
  );
};
