import { useRef } from 'react';
import { Card } from './Card';

export const SettingsPanel = ({ state, actions, copy, language, languageOptions }) => {
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
        alert(copy.invalidJson);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    const confirmed = window.confirm(copy.confirmClear);
    if (confirmed) {
      actions.resetData();
    }
  };

  return (
    <div className="page-grid two-columns">
      <Card title={copy.preferences} subtitle={copy.preferencesSubtitle}>
        <div className="stack-row">
          <label className="field">
            <span>{copy.startSavingBalance}</span>
            <input
              type="number"
              value={state.savings.startingBalance}
              onChange={(e) => actions.updateStartingSavings(e.target.value)}
            />
          </label>
          <label className="field">
            <span>{copy.language}</span>
            <select value={language} onChange={(e) => actions.updateLanguage(e.target.value)}>
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label[language]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card title={copy.dataManagement} subtitle={copy.dataManagementSubtitle}>
        <div className="action-group">
          <button className="primary-button" type="button" onClick={handleExport}>{copy.exportJson}</button>
          <button className="secondary-button" type="button" onClick={() => fileRef.current?.click()}>{copy.importJson}</button>
          <button className="ghost-action danger-text" type="button" onClick={handleClear}>{copy.clearSavedData}</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleImport} />
        </div>
      </Card>
    </div>
  );
};
