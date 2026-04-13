import '../src/styles/global.css';

export const metadata = {
  title: 'Finance Flow',
  description: 'Track income, spending, budgets, and savings with permanent MongoDB-backed storage.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
