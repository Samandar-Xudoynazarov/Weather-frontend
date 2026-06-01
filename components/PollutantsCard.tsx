'use client';

import { useLanguage } from '@/context/LanguageContext';

interface PollutantsCardProps {
  pollutants: {
    pm25: number | null;
    pm10: number | null;
    co: number | null;
    no2: number | null;
    so2: number | null;
    o3: number | null;
  };
  dominantPollutant: string | null;
}

const WHO_LIMITS: Record<string, number> = {
  pm25: 75,
  pm10: 150,
  co: 30000,
  no2: 200,
  so2: 500,
  o3: 180,
};

const POLLUTANT_COLORS = [
  '#3b82f6',
  '#06b6d4',
  '#f97316',
  '#ef4444',
  '#eab308',
  '#22c55e',
];

export function PollutantsCard({ pollutants, dominantPollutant }: PollutantsCardProps) {
  const { t } = useLanguage();

  const list = [
    { key: 'pm25', label: 'PM2.5', value: pollutants.pm25 },
    { key: 'pm10', label: 'PM10',  value: pollutants.pm10 },
    { key: 'co',   label: 'CO',    value: pollutants.co   },
    { key: 'no2',  label: 'NO₂',   value: pollutants.no2  },
    { key: 'so2',  label: 'SO₂',   value: pollutants.so2  },
    { key: 'o3',   label: 'O₃',    value: pollutants.o3   },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold opacity-60 uppercase tracking-widest">{t.pollutants.title}</h3>
        {dominantPollutant && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            ↑ {dominantPollutant}
          </span>
        )}
      </div>

      {list.map((p, i) => {
        const color = POLLUTANT_COLORS[i];
        const limit = WHO_LIMITS[p.key] ?? 100;
        const pct = p.value != null ? Math.min((p.value / limit) * 100, 100) : 0;
        const danger = p.value != null && p.value > limit;

        return (
          <div key={p.key} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-xs font-semibold" style={{ color }}>{p.label}</span>
              </div>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: danger ? '#ef4444' : 'var(--text-primary)' }}
              >
                {p.value != null ? p.value.toFixed(1) : '—'}
                <span className="opacity-40 font-normal ml-0.5">µg/m³</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: danger
                    ? `linear-gradient(90deg, ${color}, #ef4444)`
                    : color,
                  boxShadow: pct > 10 ? `0 0 6px ${color}60` : undefined,
                }}
              />
            </div>
          </div>
        );
      })}

      <p className="text-[10px] opacity-25 pt-1">{t.pollutants.pm25} · {t.pollutants.pm10}</p>
    </div>
  );
}
