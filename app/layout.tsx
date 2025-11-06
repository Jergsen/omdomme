import type { Metadata } from 'next';
import './globals.css';
import '@/lib/bootstrap';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'OmdømmeLand',
  description: 'Nøkkelorddrevet feed av norske nyhetssaker'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider>
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
