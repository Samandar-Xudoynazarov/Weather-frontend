'use client';

import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { AQIChart } from '@/components/AQIChart';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

export default function HistoryPage() {
  const { historicalData, selectedCity, setSelectedCity, loading, error } = useAirQuality();
  const { t } = useLanguage();
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const CITIES = ['Tashkent', 'Samarkand', 'Bukhara', 'Andijan', 'Namangan', 'Fergana', 'Nukus', 'Karshi'];

  const dailyData = historicalData.reduce((acc: any[], item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const existing = acc.find((d) => d.date === date);

    if (existing) {
      existing.aqiValues.push(item.aqi);
      existing.avg = (existing.aqiValues.reduce((a: number, b: number) => a + b, 0) / existing.aqiValues.length).toFixed(1);
      existing.min = Math.min(existing.min, item.aqi);
      existing.max = Math.max(existing.max, item.aqi);
    } else {
      acc.push({ date, avg: item.aqi, min: item.aqi, max: item.aqi, aqiValues: [item.aqi] });
    }

    return acc;
  }, []);

  const tableData = historicalData.slice(0, 24).reverse();

  return (
    <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.history.title}</h1>
            <p className="text-muted-foreground">{t.history.subtitle} {selectedCity}</p>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {CITIES.map((city) => (
              <Button
                key={city}
                onClick={() => setSelectedCity(city)}
                variant={city === selectedCity ? 'default' : 'outline'}
              >
                {city}
              </Button>
            ))}
          </div>

          {error && (
            <Card className="mb-8 border-red-500/50 bg-red-500/10 p-4 text-red-600">
              <p className="text-sm">Error: {error}</p>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">{t.history.loading}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{t.history.trend48h}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant={chartType === 'line' ? 'default' : 'outline'} onClick={() => setChartType('line')}>
                      {t.history.line}
                    </Button>
                    <Button size="sm" variant={chartType === 'bar' ? 'default' : 'outline'} onClick={() => setChartType('bar')}>
                      {t.history.bar}
                    </Button>
                  </div>
                </div>
                <AQIChart data={historicalData} type={chartType} />
              </Card>

              {dailyData.length > 0 && (
                <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-6">
                  <h3 className="text-xl font-semibold mb-4">{t.history.dailyAvg}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1e40af" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.2} />
                      <XAxis dataKey="date" stroke="var(--muted-foreground-color)" style={{ fontSize: '12px' }} />
                      <YAxis stroke="var(--muted-foreground-color)" style={{ fontSize: '12px' }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                                <p className="text-sm font-semibold">
                                  {t.history.avg}: {payload[0].payload.avg}
                                </p>
                                <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="avg" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">{t.history.recentReadings}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 font-semibold">{t.history.time}</th>
                          <th className="text-left py-3 px-4 font-semibold">{t.history.aqi}</th>
                          <th className="text-left py-3 px-4 font-semibold">{t.history.level}</th>
                          <th className="text-left py-3 px-4 font-semibold">PM2.5</th>
                          <th className="text-left py-3 px-4 font-semibold">PM10</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((item, idx) => (
                          <tr key={idx} className="border-b border-border/30 hover:bg-accent/50 transition-colors">
                            <td className="py-3 px-4">{new Date(item.timestamp).toLocaleString()}</td>
                            <td className="py-3 px-4 font-semibold">{item.aqi}</td>
                            <td className="py-3 px-4">
                              <span
                                className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                                style={{
                                  backgroundColor:
                                    item.aqi <= 50 ? '#22c55e'
                                    : item.aqi <= 100 ? '#eab308'
                                    : item.aqi <= 150 ? '#f97316'
                                    : item.aqi <= 200 ? '#ef4444'
                                    : item.aqi <= 300 ? '#7c3aed'
                                    : '#6d28d9'
                                }}
                              >
                                {t.levels[item.level] || item.level}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {item.pollutants.pm25 ? item.pollutants.pm25.toFixed(1) : '-'}
                            </td>
                            <td className="py-3 px-4">
                              {item.pollutants.pm10 ? item.pollutants.pm10.toFixed(1) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
    </main>
  );
}
