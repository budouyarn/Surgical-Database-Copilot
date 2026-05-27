import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/ui/Nav';

export const metadata: Metadata = {
  title: 'Surgical Database Copilot',
  description: 'Surgical preference cards, case management, and AI copilot for medical staff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50">
        <Nav />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
