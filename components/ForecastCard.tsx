'use client';

import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart, Area,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

export interface ForecastDay {
  date: string;
  weather: {
    tempMax: number;
    tempMin: number;
    precipitationSum: number;
    precipitationProbability: number;
    windSpeedMax: number;
    weatherCode: number;
  };
  airQuality: {
    pm25: number | null;
    pm10: number | null;
    aqi: number | null;
  } | null;
}

// WMO weather code → emoji + label
function weatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2)  return '🌤';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫';
  if (code <= 55) return '🌦';
  if (code <= 65) return '🌧';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦';
  if (code <= 86) return '🌨';
  return '⛈';
}

function getAqiColor(aqi: number): string {
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#7c3aed';
  return '#6d28d9';
}

function shortDate(dateStr: string, idx: number, todayLabel: string): string {
  if (idx === 0) return todayLabel;
  const d = new Date(dateStr);
  return d.toLocaleDateString('default', { weekday: 'short', month: 'numeric', day: 'numeric' });
}

interface Props {
  data: ForecastDay[];
}

export function ForecastCard({ data }: Props) {
  const { t } = useLanguage();

  const chartData = data.map((d, i) => ({
    day: shortDate(d.date, i, t.forecast.today),
    aqi: d.airQuality?.aqi ?? null,
    pm25: d.airQuality?.pm25 ?? null,
    rain: d.weather.precipitationProbability,
    tempMax: d.weather.tempMax,
    tempMin: d.weather.tempMin,
    precip: d.weather.precipitationSum,
  }));

  return (
    <div className="space-y-6">
      {/* 7-day daily cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {data.map((day, i) => {
          const aqi = day.airQuality?.aqi;
          const aqiColor = aqi != null ? getAqiColor(aqi) : '#94a3b8';

          return (
            <div
              key={day.date}
              className={`rounded-xl border border-border/50 p-3 text-center space-y-1.5 transition-all hover:shadow-md ${
                i === 0 ? 'border-primary/50 bg-primary/5' : 'bg-background'
              }`}
            >
              <div className="text-xs font-semibold text-muted-foreground">
                {shortDate(day.date, i, t.forecast.today)}
              </div>

              <div className="text-2xl">{weatherIcon(day.weather.weatherCode)}</div>

              {/* Temp */}
              <div className="text-xs space-y-0.5">
                <div className="font-bold text-foreground">{day.weather.tempMax.toFixed(0)}°</div>
                <div className="text-muted-foreground">{day.weather.tempMin.toFixed(0)}°</div>
              </div>

              {/* Rain */}
              <div className="text-xs text-blue-500 font-medium">
                💧 {day.weather.precipitationProbability}%
              </div>

              {/* Wind */}
              <div className="text-xs text-muted-foreground">
                💨 {day.weather.windSpeedMax.toFixed(0)} m/s
              </div>

              {/* AQI */}
              {aqi != null && (
                <div
                  className="text-xs font-bold text-white rounded-full px-1.5 py-0.5 mx-auto w-fit"
                  style={{ backgroundColor: aqiColor }}
                >
                  {aqi}
                </div>
              )}

              {/* Precipitation mm */}
              {day.weather.precipitationSum > 0 && (
                <div className="text-[10px] text-blue-400">
                  {day.weather.precipitationSum.toFixed(1)} mm
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AQI Forecast Chart */}
      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-accent/30 p-5">
        <h4 className="font-semibold mb-4 text-sm">{t.forecast.aqiChart}</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="day" style={{ fontSize: '11px' }} tick={{ fill: 'var(--muted-foreground)' }} />
            <YAxis style={{ fontSize: '11px' }} tick={{ fill: 'var(--muted-foreground)' }} />
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                    <div className="font-bold">{payload[0]?.payload?.day}</div>
                    {payload[0]?.value != null && <div>AQI: <strong>{payload[0].value}</strong></div>}
                    {payload[1]?.value != null && <div>PM2.5: <strong>{payload[1].value}</strong></div>}
                  </div>
                ) : null
              }
            />
            <Area type="monotone" dataKey="aqi" stroke="#3b82f6" fill="url(#aqiFill)" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="pm25" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span><span className="inline-block w-3 h-0.5 bg-blue-500 mr-1 align-middle" />AQI</span>
          <span><span className="inline-block w-3 h-0.5 bg-orange-400 mr-1 align-middle border-dashed border-t" />PM2.5</span>
        </div>
      </div>

      {/* Rain + Temp Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rain probability */}
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-accent/30 p-5">
          <h4 className="font-semibold mb-4 text-sm">{t.forecast.rainChart}</h4>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" style={{ fontSize: '10px' }} tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis domain={[0, 100]} style={{ fontSize: '10px' }} tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                      <div>{payload[0]?.payload?.day}</div>
                      <div>💧 {payload[0]?.value}%</div>
                      <div>💦 {payload[0]?.payload?.precip?.toFixed(1)} mm</div>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="rain" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Temperature range */}
        <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-accent/30 p-5">
          <h4 className="font-semibold mb-4 text-sm">{t.forecast.tempChart}</h4>
          <ResponsiveContainer width="100%" height={160}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" style={{ fontSize: '10px' }} tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis style={{ fontSize: '10px' }} tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="bg-background border border-border rounded-lg p-2 text-xs shadow-lg">
                      <div>{payload[0]?.payload?.day}</div>
                      <div>🌡 {t.forecast.high}: {payload[0]?.value}°C</div>
                      <div>🌡 {t.forecast.low}: {payload[1]?.value}°C</div>
                    </div>
                  ) : null
                }
              />
              <Line type="monotone" dataKey="tempMax" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name={t.forecast.high} />
              <Line type="monotone" dataKey="tempMin" stroke="#60a5fa" strokeWidth={2} dot={{ r: 3 }} name={t.forecast.low} />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span><span className="inline-block w-3 h-0.5 bg-orange-400 mr-1 align-middle" />{t.forecast.high}</span>
            <span><span className="inline-block w-3 h-0.5 bg-blue-400 mr-1 align-middle" />{t.forecast.low}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
