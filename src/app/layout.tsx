import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'פולי-בורדל | שוק הניחושים',
  description: 'הניחו על אירועים עולמיים עם כסף וירטואלי. התחל עם $1,000.',
  manifest: '/manifest.json',
  themeColor: '#0066ff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl">
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
