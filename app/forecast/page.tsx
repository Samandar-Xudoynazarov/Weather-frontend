'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ForecastCard, ForecastDay } from '@/components/ForecastCard';

const CITIES = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana', 'Nukus', 'Karshi'];

export default function ForecastPage() {
  const { selectedCity, setSelectedCity } = useAirQuality();
  const { t } = useLanguage();
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchForecast = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/api/air/forecast/${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error('Forecast not available');
      const data = await res.json();
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchForecast(selectedCity);
  }, [selectedCity, fetchForecast]);

  return (
    <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">{t.forecast.title}</h1>
            <p className="text-muted-foreground text-sm">{t.forecast.subtitle} {selectedCity}</p>
          </div>

          {/* City selector */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {CITIES.map((city) => (
              <Button
                key={city}
                size="sm"
                variant={city === selectedCity ? 'default' : 'outline'}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <Card className="mb-6 border-red-500/50 bg-red-500/10 p-4 text-red-600 text-sm">
              {error}
            </Card>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p className="text-muted-foreground">{t.forecast.loading}</p>
              </div>
            </div>
          ) : forecast ? (
            <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-6">
              <ForecastCard data={forecast} />
            </Card>
          ) : !error && (
            <div className="flex items-center justify-center py-24">
              <p className="text-muted-foreground">{t.forecast.noData}</p>
            </div>
          )}
        </div>
    </main>
  );
}
