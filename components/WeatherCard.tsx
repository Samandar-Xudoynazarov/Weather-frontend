'use client';

import { Cloud, Droplets, Wind, Gauge } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherCardProps {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  pressure: number | null;
}

export function WeatherCard({ temperature, humidity, windSpeed, pressure }: WeatherCardProps) {
  const { t } = useLanguage();

  const weatherItems = [
    { label: t.weather.temperature, value: temperature, unit: '°C',  icon: Cloud,    color: 'from-orange-400 to-orange-600' },
    { label: t.weather.humidity,    value: humidity,    unit: '%',    icon: Droplets, color: 'from-blue-400 to-blue-600' },
    { label: t.weather.windSpeed,   value: windSpeed,   unit: 'm/s',  icon: Wind,     color: 'from-teal-400 to-teal-600' },
    { label: t.weather.pressure,    value: pressure,    unit: 'hPa',  icon: Gauge,    color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{t.weather.title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {weatherItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.label}
              className={`group relative rounded-xl border border-border/50 bg-gradient-to-br ${item.color} p-4 backdrop-blur-sm hover:border-border/80 transition-all duration-300 hover:shadow-lg overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/90 line-clamp-1">{item.label}</span>
                  <div className="text-white/70 flex-shrink-0">
                    <IconComponent size={18} />
                  </div>
                </div>

                {item.value !== null ? (
                  <>
                    <div className="text-2xl font-bold text-white">{item.value.toFixed(1)}</div>
                    <div className="text-xs text-white/70">{item.unit}</div>
                  </>
                ) : (
                  <div className="text-sm text-white/70">{t.weather.noData}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
