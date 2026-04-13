import '../src/styles/global.css';

export const metadata = {
  title: 'Finance Flow',
  description: 'Track income, spending, budgets, and savings with permanent MongoDB-backed storage.',
  applicationName: 'Finance Flow',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Finance Flow',
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
    shortcut: '/icon',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
