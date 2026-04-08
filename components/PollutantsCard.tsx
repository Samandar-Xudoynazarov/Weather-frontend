'use client';

import { Wind, AlertTriangle } from 'lucide-react';
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

export function PollutantsCard({ pollutants, dominantPollutant }: PollutantsCardProps) {
  const { t } = useLanguage();

  const pollutantList = [
    { key: 'pm25' as const, name: 'PM2.5', value: pollutants.pm25, unit: 'μg/m³', icon: <Wind size={20} />, color: 'from-blue-500 to-blue-600', desc: t.pollutants.pm25 },
    { key: 'pm10' as const, name: 'PM10',  value: pollutants.pm10, unit: 'μg/m³', icon: <Wind size={20} />, color: 'from-cyan-500 to-cyan-600', desc: t.pollutants.pm10 },
    { key: 'co'   as const, name: 'CO',    value: pollutants.co,   unit: 'μg/m³', icon: <AlertTriangle size={20} />, color: 'from-orange-500 to-orange-600', desc: t.pollutants.co },
    { key: 'no2'  as const, name: 'NO₂',   value: pollutants.no2,  unit: 'μg/m³', icon: <AlertTriangle size={20} />, color: 'from-red-500 to-red-600', desc: t.pollutants.no2 },
    { key: 'so2'  as const, name: 'SO₂',   value: pollutants.so2,  unit: 'μg/m³', icon: <AlertTriangle size={20} />, color: 'from-yellow-500 to-yellow-600', desc: t.pollutants.so2 },
    { key: 'o3'   as const, name: 'O₃',    value: pollutants.o3,   unit: 'μg/m³', icon: <Wind size={20} />, color: 'from-green-500 to-green-600', desc: t.pollutants.o3 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{t.pollutants.title}</h3>
        {dominantPollutant && (
          <div className="text-sm text-muted-foreground">
            {t.pollutants.dominant}:{' '}
            <span className="font-semibold text-foreground">{dominantPollutant}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pollutantList.map((p) => (
          <div
            key={p.name}
            className={`group relative rounded-xl border border-border/50 bg-gradient-to-br ${p.color} p-4 backdrop-blur-sm hover:border-border/80 transition-all duration-300 hover:shadow-lg overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white/90">{p.name}</span>
                <div className="text-white/70">{p.icon}</div>
              </div>

              <div className="space-y-1">
                {p.value !== null ? (
                  <>
                    <div className="text-2xl font-bold text-white">{p.value.toFixed(1)}</div>
                    <div className="text-xs text-white/70">{p.unit}</div>
                  </>
                ) : (
                  <div className="text-sm text-white/70">{t.pollutants.noData}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground mt-6 p-4 rounded-lg bg-accent/50 border border-border/50">
        {pollutantList.map((p) => (
          <div key={p.key}>
            <strong>{p.name}:</strong> {p.desc}
          </div>
        ))}
      </div>
    </div>
  );
}
