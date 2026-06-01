'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AQIGaugeProps {
  aqi: number;
  level: string;
  city: string;
}

const AQI_LEVELS = [
  { max: 50,  color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   label: 'Good' },
  { max: 100, color: '#eab308', bg: 'rgba(234,179,8,0.12)',   label: 'Moderate' },
  { max: 150, color: '#f97316', bg: 'rgba(249,115,22,0.12)',  label: 'Unhealthy SG' },
  { max: 200, color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Unhealthy' },
  { max: 300, color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  label: 'Very Unhealthy' },
  { max: 500, color: '#6d28d9', bg: 'rgba(109,40,217,0.12)',  label: 'Hazardous' },
];

function getLevel(aqi: number) {
  return AQI_LEVELS.find(l => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];
}

export function AQIGauge({ aqi, level, city }: AQIGaugeProps) {
  const { t } = useLanguage();

  const { color, bg } = useMemo(() => getLevel(aqi), [aqi]);

  const R = 80;
  const circumference = 2 * Math.PI * R;
  const progress = Math.min(aqi, 500) / 500;
  const dashOffset = circumference * (1 - progress);

  const SCALE_LABELS = [
    { aqi: 0,   angle: -135 },
    { aqi: 100, angle: -67.5 },
    { aqi: 200, angle: 0 },
    { aqi: 300, angle: 67.5 },
    { aqi: 500, angle: 135 },
  ];

  return (
    <div
      className="relative flex flex-col items-center justify-center py-10 px-6 rounded-2xl overflow-hidden transition-all duration-500"
      style={{ background: bg }}
    >
      {/* Glow blob */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        }}
      />

      <div className="relative">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {/* Track ring */}
          <circle
            cx="110" cy="110" r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="14"
          />

          {/* Colored segments (background arc) */}
          {AQI_LEVELS.map((lvl, i) => {
            const start = i === 0 ? 0 : AQI_LEVELS[i - 1].max / 500;
            const end = lvl.max / 500;
            const sOff = circumference * (1 - end);
            const eOff = circumference * (1 - start);
            return (
              <circle
                key={lvl.label}
                cx="110" cy="110" r={R}
                fill="none"
                stroke={lvl.color}
                strokeWidth="14"
                strokeDasharray={`${circumference * (end - start)} ${circumference * (1 - (end - start))}`}
                strokeDashoffset={sOff}
                strokeLinecap="butt"
                opacity="0.18"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '110px 110px' }}
              />
            );
          })}

          {/* Active progress arc */}
          <circle
            cx="110" cy="110" r={R}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '110px 110px',
              transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease',
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />

          {/* Center content */}
          <text
            x="110" y="100"
            textAnchor="middle"
            fontSize="48"
            fontWeight="800"
            fill={color}
            style={{ fontFamily: 'inherit' }}
          >
            {aqi}
          </text>
          <text
            x="110" y="128"
            textAnchor="middle"
            fontSize="13"
            fill="currentColor"
            opacity="0.5"
          >
            AQI
          </text>
        </svg>

        {/* Pulse ring animation */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: `2px solid ${color}`,
            opacity: 0.15,
            animationDuration: '2.5s',
            margin: 12,
          }}
        />
      </div>

      {/* Level badge */}
      <div
        className="mt-2 px-5 py-1.5 rounded-full text-sm font-bold"
        style={{ background: color, color: '#fff' }}
      >
        {t.levels[level] || level}
      </div>

      <div className="mt-2 text-base font-semibold opacity-70">{city}</div>

      {/* Mini scale */}
      <div className="mt-6 flex items-center gap-1">
        {AQI_LEVELS.map((lvl) => (
          <div key={lvl.label} className="flex flex-col items-center gap-1">
            <div
              className="h-1.5 rounded-full"
              style={{
                width: 28,
                background: lvl.color,
                opacity: aqi <= lvl.max && (AQI_LEVELS.indexOf(lvl) === 0 || aqi > AQI_LEVELS[AQI_LEVELS.indexOf(lvl) - 1].max) ? 1 : 0.3,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-xs opacity-40">
        <span>{t.gauge.good} (0–50)</span>
        <span>{t.gauge.moderate} (51–100)</span>
        <span>{t.gauge.unhealthy} (150+)</span>
      </div>
    </div>
  );
}
