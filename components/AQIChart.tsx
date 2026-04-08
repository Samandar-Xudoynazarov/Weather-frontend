'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar
} from 'recharts';
import { AirData } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';

interface AQIChartProps {
  data: AirData[];
  type?: 'line' | 'bar';
}

export function AQIChart({ data, type = 'line' }: AQIChartProps) {
  const { t } = useLanguage();

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 rounded-xl border border-border/50 bg-accent/50">
        <div className="text-center text-muted-foreground">
          <div className="text-lg font-semibold mb-1">{t.chart.noData}</div>
          <div className="text-sm">{t.chart.noDataDesc}</div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }),
    aqi: item.aqi,
    timestamp: new Date(item.timestamp).getTime()
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold">{t.chart.aqi}: {value}</p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{t.chart.title}</h3>

      <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-accent/50 p-6 backdrop-blur-sm">
        <ResponsiveContainer width="100%" height={300}>
          {type === 'line' ? (
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="25%" stopColor="#eab308" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.2} />
              <XAxis dataKey="time" stroke="var(--muted-foreground-color)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground-color)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="url(#aqiGradient)"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          ) : (
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.2} />
              <XAxis dataKey="time" stroke="var(--muted-foreground-color)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground-color)" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="aqi" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
