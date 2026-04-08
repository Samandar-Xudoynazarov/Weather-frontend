'use client';

import dynamic from 'next/dynamic';
import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl border border-border/50 flex items-center justify-center bg-accent/20">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
        <p className="text-muted-foreground text-sm">Xarita yuklanmoqda...</p>
      </div>
    </div>
  ),
});

const AQI_LEGEND = [
  { label: 'Good',     labelUz: 'Yaxshi',         color: '#22c55e', range: '0–50' },
  { label: 'Moderate', labelUz: "O'rtacha",        color: '#eab308', range: '51–100' },
  { label: 'Unhealthy (Sensitive)', labelUz: 'Sezgirlar uchun', color: '#f97316', range: '101–150' },
  { label: 'Unhealthy', labelUz: 'Zararli',        color: '#ef4444', range: '151–200' },
  { label: 'Very Unhealthy', labelUz: 'Juda zararli', color: '#7c3aed', range: '201–300' },
  { label: 'Hazardous', labelUz: 'Xavfli',         color: '#6d28d9', range: '300+' },
];

export default function MapPage() {
  const { allCitiesData, setSelectedCity } = useAirQuality();
  const { t } = useLanguage();

  const cityList = Object.values(allCitiesData).sort((a, b) => b.aqi - a.aqi);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">{t.nav.map}</h1>
            <p className="text-muted-foreground text-sm">Real-time • O'zbekiston shaharlari</p>
          </div>

          {/* Map */}
          <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 p-4 mb-6">
            <MapView
              allCitiesData={allCitiesData}
              onCityClick={(city) => setSelectedCity(city)}
            />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AQI Legend */}
            <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 p-5">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                AQI Legend
              </h3>
              <div className="space-y-2">
                {AQI_LEGEND.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{t.levels[item.label] || item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{item.range}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* City Rankings */}
            <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 p-5 lg:col-span-2">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                {t.history.recentReadings}
              </h3>
              {cityList.length === 0 ? (
                <p className="text-muted-foreground text-sm">{t.pollutants.noData}</p>
              ) : (
                <div className="space-y-2">
                  {cityList.map((data) => {
                    const color = data.aqi <= 50 ? '#22c55e'
                      : data.aqi <= 100 ? '#eab308'
                      : data.aqi <= 150 ? '#f97316'
                      : data.aqi <= 200 ? '#ef4444'
                      : data.aqi <= 300 ? '#7c3aed' : '#6d28d9';

                    return (
                      <button
                        key={data.city}
                        onClick={() => setSelectedCity(data.city)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors text-left"
                      >
                        {/* AQI badge */}
                        <div
                          className="w-12 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {data.aqi}
                        </div>

                        {/* City info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{data.city}</div>
                          <div className="text-xs text-muted-foreground">{t.levels[data.level] || data.level}</div>
                        </div>

                        {/* Weather quick view */}
                        <div className="text-right text-xs text-muted-foreground flex-shrink-0 space-y-0.5">
                          {data.weather.temperature !== null && (
                            <div>🌡 {data.weather.temperature.toFixed(0)}°C</div>
                          )}
                          {data.weather.humidity !== null && (
                            <div>💧 {data.weather.humidity}%</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
