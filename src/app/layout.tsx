import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Open_Sans } from 'next/font/google';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-open-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Polybordel',
  description: 'הניחו על אירועים עולמיים עם כסף וירטואלי. התחל עם $1,000.',
  manifest: '/manifest.json',
  themeColor: '#0066ff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl" className={openSans.variable}>
        <body>
          <Header />
          <CategoryNav />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
