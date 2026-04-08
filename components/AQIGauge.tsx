'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AQIGaugeProps {
  aqi: number;
  level: string;
  city: string;
}

export function AQIGauge({ aqi, level, city }: AQIGaugeProps) {
  const { t } = useLanguage();

  const gaugeData = useMemo(() => {
    let color = '#22c55e';
    if (aqi > 50 && aqi <= 100) color = '#eab308';
    else if (aqi > 100 && aqi <= 150) color = '#f97316';
    else if (aqi > 150 && aqi <= 200) color = '#ef4444';
    else if (aqi > 200 && aqi <= 300) color = '#7c3aed';
    else if (aqi > 300) color = '#6d28d9';

    const rotation = (Math.min(aqi, 500) / 500) * 180;
    return { color, rotation };
  }, [aqi]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-32">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}
        >
          <defs>
            <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="25%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          <path
            d="M 20 90 A 70 70 0 0 1 180 90"
            fill="none"
            stroke="url(#aqiGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <g transform={`translate(100, 90) rotate(${gaugeData.rotation - 90})`}>
            <line x1="0" y1="0" x2="0" y2="-60" stroke={gaugeData.color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="0" cy="0" r="4" fill={gaugeData.color} />
          </g>

          <text x="20" y="105" fontSize="12" textAnchor="middle" fill="currentColor" opacity="0.6">0</text>
          <text x="100" y="115" fontSize="12" textAnchor="middle" fill="currentColor" opacity="0.6">250</text>
          <text x="180" y="105" fontSize="12" textAnchor="middle" fill="currentColor" opacity="0.6">500</text>
        </svg>
      </div>

      <div className="text-center mt-6">
        <div className="text-4xl font-bold text-foreground mb-2">{aqi}</div>
        <div
          className="text-lg font-semibold mb-1 px-4 py-1 rounded-full w-fit mx-auto text-white"
          style={{ backgroundColor: gaugeData.color, opacity: 0.9 }}
        >
          {t.levels[level] || level}
        </div>
        <div className="text-sm text-muted-foreground mt-3">{city}</div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-center">
        <div>
          <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-1"></div>
          <div className="text-muted-foreground">{t.gauge.good}</div>
        </div>
        <div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1"></div>
          <div className="text-muted-foreground">{t.gauge.moderate}</div>
        </div>
        <div>
          <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"></div>
          <div className="text-muted-foreground">{t.gauge.unhealthy}</div>
        </div>
      </div>
    </div>
  );
}
