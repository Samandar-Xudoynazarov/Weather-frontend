import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AirQualityProvider } from '@/context/AirQualityContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/Header'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Air Quality Monitor',
  description: 'Real-time air quality monitoring system with live updates',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className="font-sans antialiased" style={{ margin: 0 }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            <AirQualityProvider>
              <div className="flex min-h-screen" style={{ background: 'var(--page-bg)' }}>
                <Header />
                <main className="flex-1 md:overflow-y-auto" style={{ paddingTop: '0' }}>
                  <div className="pt-14 pb-20 md:pt-0 md:pb-0">
                    {children}
                  </div>
                </main>
              </div>
              <Analytics />
            </AirQualityProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
