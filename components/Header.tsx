'use client';

import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n';
import { AlertCircle, Wifi, WifiOff, Moon, Sun, Map } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const { socketConnected, alerts } = useAirQuality();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const unseenAlerts = alerts.filter(a => !a.seen).length;

  // Avoid hydration mismatch for theme icon
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const languages: Language[] = ['uz', 'ru', 'en'];

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">
              {t.appName}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm">
              {t.nav.dashboard}
            </Link>
            <Link href="/history" className="px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm">
              {t.nav.history}
            </Link>
            <Link href="/alerts" className="relative px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {t.nav.alerts}
              {unseenAlerts > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unseenAlerts > 99 ? '99+' : unseenAlerts}
                </span>
              )}
            </Link>
            <Link href="/map" className="px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm flex items-center gap-1.5">
              <Map size={16} />
              {t.nav.map}
            </Link>
            <Link href="/snake" className="px-4 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm">
              {t.nav.snake}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Connection status */}
            {socketConnected ? (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <Wifi size={16} />
                <span className="hidden sm:inline">{t.status.connected}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <WifiOff size={16} />
                <span className="hidden sm:inline">{t.status.offline}</span>
              </div>
            )}

            {/* Language selector */}
            <div className="flex items-center rounded-lg border border-border/50 overflow-hidden text-xs">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 transition-colors uppercase font-semibold ${
                    language === lang
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Dark/Light mode toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden flex gap-2 mt-4 overflow-x-auto pb-2">
          <Link href="/" className="px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm whitespace-nowrap">
            {t.nav.dashboard}
          </Link>
          <Link href="/history" className="px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm whitespace-nowrap">
            {t.nav.history}
          </Link>
          <Link href="/alerts" className="relative px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm whitespace-nowrap flex items-center gap-2">
            <AlertCircle size={16} />
            {t.nav.alerts}
            {unseenAlerts > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                {unseenAlerts > 99 ? '9+' : unseenAlerts}
              </span>
            )}
          </Link>
          <Link href="/map" className="px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm whitespace-nowrap flex items-center gap-1.5">
            <Map size={15} />
            {t.nav.map}
          </Link>
          <Link href="/snake" className="px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-sm whitespace-nowrap">
            {t.nav.snake}
          </Link>
        </nav>
      </div>
    </header>
  );
}
