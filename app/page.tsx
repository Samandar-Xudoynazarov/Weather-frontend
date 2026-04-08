'use client';

import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { AQIGauge } from '@/components/AQIGauge';
import { PollutantsCard } from '@/components/PollutantsCard';
import { WeatherCard } from '@/components/WeatherCard';
import { AQIChart } from '@/components/AQIChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const CITIES = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana', 'Nukus', 'Karshi'];

export default function Dashboard() {
  const { currentData, historicalData, loading, error, selectedCity, setSelectedCity } = useAirQuality();
  const { t } = useLanguage();
  const [showCitySelector, setShowCitySelector] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* City Selector */}
          <div className="mb-8">
            <div className="relative inline-block">
              <Button
                onClick={() => setShowCitySelector(!showCitySelector)}
                className="flex items-center gap-2"
                variant="outline"
              >
                {selectedCity}
                <ChevronDown size={18} />
              </Button>

              {showCitySelector && (
                <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-10">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCitySelector(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-accent transition-colors ${
                        city === selectedCity ? 'bg-accent font-semibold' : ''
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mb-8 border-red-500/50 bg-red-500/10 p-4 text-red-600">
              <p className="text-sm">Error: {error}</p>
            </Card>
          )}

          {/* Loading State */}
          {loading && !currentData ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">{t.dashboard.loading}</p>
              </div>
            </div>
          ) : currentData ? (
            <div className="space-y-8">
              <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm overflow-hidden">
                <AQIGauge aqi={currentData.aqi} level={currentData.level} city={currentData.city} />
              </Card>

              <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-6">
                <PollutantsCard
                  pollutants={currentData.pollutants}
                  dominantPollutant={currentData.dominantPollutant}
                />
              </Card>

              <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-6">
                <WeatherCard
                  temperature={currentData.weather.temperature}
                  humidity={currentData.weather.humidity}
                  windSpeed={currentData.weather.windSpeed}
                  pressure={currentData.weather.pressure}
                />
              </Card>

              <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-6">
                <AQIChart data={historicalData} />
              </Card>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  {t.dashboard.lastUpdated}:{' '}
                  {currentData?.timestamp
                    ? new Date(currentData.timestamp).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {t.dashboard.noData} {selectedCity}
                </p>
                <Button onClick={() => window.location.reload()}>{t.dashboard.refresh}</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
