'use client';

import App from './App';
import { FinanceProvider } from './context/FinanceContext';

export default function FinanceClientApp() {
  return (
    <FinanceProvider>
      <App />
    </FinanceProvider>
  );
}
