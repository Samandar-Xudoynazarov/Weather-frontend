'use client';

import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { AQIGauge } from '@/components/AQIGauge';
import { PollutantsCard } from '@/components/PollutantsCard';
import { AQIChart } from '@/components/AQIChart';
import { Thermometer, Droplets, Wind, Gauge, ArrowUp, Clock } from 'lucide-react';

const CITIES = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana', 'Nukus', 'Karshi'];

function WeatherStat({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string | number | null; unit: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-2xl"
      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
    >
      <div className="flex items-center gap-2 opacity-50">
        {icon}
        <span className="text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {value ?? '—'}
        </span>
        <span className="text-xs opacity-40 pb-0.5">{unit}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { currentData, historicalData, loading, selectedCity, setSelectedCity } = useAirQuality();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-5">
      {/* City selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs opacity-40 uppercase tracking-widest font-semibold mr-1">{t.dashboard.city}</span>
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: city === selectedCity ? '#3b82f6' : 'var(--card-bg)',
              color: city === selectedCity ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${city === selectedCity ? '#3b82f6' : 'var(--card-border)'}`,
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {loading && !currentData ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-sm opacity-40">{t.dashboard.loading}</p>
          </div>
        </div>
      ) : currentData ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left column: AQI + Chart */}
          <div className="lg:col-span-3 space-y-5">
            <AQIGauge aqi={currentData.aqi} level={currentData.level} city={currentData.city} />

            {/* Chart */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <AQIChart data={historicalData} />
            </div>
          </div>

          {/* Right column: Weather + Pollutants */}
          <div className="lg:col-span-2 space-y-5">
            {/* Weather grid */}
            <div>
              <p className="text-xs opacity-40 uppercase tracking-widest font-semibold mb-3">{t.weather.title}</p>
              <div className="grid grid-cols-2 gap-3">
                <WeatherStat
                  icon={<Thermometer size={14} />}
                  label={t.weather.temperature}
                  value={currentData.weather.temperature != null ? Number(currentData.weather.temperature).toFixed(1) : null}
                  unit="°C"
                />
                <WeatherStat
                  icon={<Droplets size={14} />}
                  label={t.weather.humidity}
                  value={currentData.weather.humidity != null ? Math.round(Number(currentData.weather.humidity)) : null}
                  unit="%"
                />
                <WeatherStat
                  icon={<Wind size={14} />}
                  label={t.weather.wind}
                  value={currentData.weather.windSpeed != null ? Number(currentData.weather.windSpeed).toFixed(1) : null}
                  unit="m/s"
                />
                <WeatherStat
                  icon={<Gauge size={14} />}
                  label={t.weather.pressure}
                  value={currentData.weather.pressure != null ? Math.round(Number(currentData.weather.pressure)) : null}
                  unit="hPa"
                />
              </div>
              {currentData.weather.feelsLike != null && (
                <div
                  className="mt-3 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                >
                  <ArrowUp size={14} className="opacity-50" />
                  <span className="opacity-50">{t.weather.feelsLike}:</span>
                  <span className="font-semibold">{Number(currentData.weather.feelsLike).toFixed(0)}°C</span>
                  {currentData.weather.description && (
                    <span className="ml-auto opacity-40 text-xs capitalize">{currentData.weather.description}</span>
                  )}
                </div>
              )}
            </div>

            {/* Pollutants */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <PollutantsCard
                pollutants={currentData.pollutants}
                dominantPollutant={currentData.dominantPollutant}
              />
            </div>

            {/* Last updated */}
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs opacity-40"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            >
              <Clock size={12} />
              <span>{t.dashboard.lastUpdated}: {currentData.timestamp ? new Date(currentData.timestamp).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-32">
          <div className="text-center space-y-3">
            <p className="opacity-40">{t.dashboard.noData} {selectedCity}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: '#3b82f6', color: '#fff' }}
            >
              {t.dashboard.refresh}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
