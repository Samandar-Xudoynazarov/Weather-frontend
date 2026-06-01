'use client';

import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n';
import { AlertCircle, LayoutDashboard, History, Map, CloudSun, Wind, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', icon: LayoutDashboard, labelKey: 'dashboard' as const },
  { href: '/history', icon: History, labelKey: 'history' as const },
  { href: '/alerts', icon: AlertCircle, labelKey: 'alerts' as const },
  { href: '/map', icon: Map, labelKey: 'map' as const },
  { href: '/forecast', icon: CloudSun, labelKey: 'forecast' as const },
];

export function Header() {
  const { socketConnected, alerts } = useAirQuality();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const unseenAlerts = alerts.filter(a => !a.seen).length;
  const languages: Language[] = ['uz', 'ru', 'en'];

  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 shrink-0 border-r transition-all duration-300 z-40`}
        style={{
          width: collapsed ? 68 : 220,
          background: 'var(--sidebar-bg)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', minHeight: 68 }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }}
          >
            <Wind size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>
              {t.appName}
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              {collapsed
                ? <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                : <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                style={{
                  background: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: active ? '#60a5fa' : 'var(--text-secondary)',
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: '#3b82f6' }}
                  />
                )}
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {t.nav[labelKey]}
                  </span>
                )}
                {labelKey === 'alerts' && unseenAlerts > 0 && !collapsed && (
                  <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {unseenAlerts > 9 ? '9+' : unseenAlerts}
                  </span>
                )}
                {labelKey === 'alerts' && unseenAlerts > 0 && collapsed && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Connection status */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium`}
            style={{
              background: socketConnected ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: socketConnected ? '#22c55e' : '#ef4444',
            }}
          >
            {socketConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            {!collapsed && <span>{socketConnected ? t.status.connected : t.status.offline}</span>}
          </div>

          {/* Language */}
          {!collapsed && (
            <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="flex-1 py-1.5 text-xs font-bold uppercase transition-all"
                  style={{
                    background: language === lang ? '#3b82f6' : 'transparent',
                    color: language === lang ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-xs"
              style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)' }}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {!collapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #22c55e, #3b82f6)' }}
          >
            <Wind size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{t.appName}</span>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <div className="flex rounded-lg overflow-hidden border text-[10px]" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className="px-2 py-1 font-bold uppercase"
                style={{
                  background: language === lang ? '#3b82f6' : 'transparent',
                  color: language === lang ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 border-t"
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        {NAV_ITEMS.map(({ href, icon: Icon, labelKey }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl"
              style={{ color: active ? '#60a5fa' : 'var(--text-secondary)' }}
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium">{t.nav[labelKey]}</span>
              {labelKey === 'alerts' && unseenAlerts > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
