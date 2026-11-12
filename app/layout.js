import './globals.css';
import ReduxProvider from '@/store/ReduxProvider';

export const metadata = {
  title: 'Doctor Tracker — Healthcare Admin Portal',
  description: 'High-performance healthcare administrator portal for managing doctors and patients.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
