'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AirData } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';

const CITY_COORDS: Record<string, [number, number]> = {
  Tashkent:  [41.2995, 69.2401],
  Samarkand: [39.6547, 66.9758],
  Bukhara:   [39.7747, 64.4286],
  Andijan:   [40.7821, 72.3442],
  Namangan:  [41.0011, 71.6722],
  Fergana:   [40.3834, 71.7864],
  Nukus:     [42.4619, 59.6166],
  Karshi:    [38.8600, 65.7900],
};

function getAqiColor(aqi: number): string {
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#7c3aed';
  return '#6d28d9';
}

function getRadius(aqi: number): number {
  if (aqi <= 50)  return 18;
  if (aqi <= 100) return 22;
  if (aqi <= 150) return 26;
  if (aqi <= 200) return 30;
  return 34;
}

interface MapViewProps {
  allCitiesData: Record<string, AirData>;
  onCityClick?: (city: string) => void;
}

export default function MapView({ allCitiesData, onCityClick }: MapViewProps) {
  const { t } = useLanguage();

  // Fix Leaflet's default icon path issue (not needed with CircleMarker but kept for safety)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-border/50">
      <MapContainer
        center={[41.3, 63.5]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(CITY_COORDS).map(([city, coords]) => {
          const data = allCitiesData[city];
          const aqi = data?.aqi ?? null;
          const color = aqi !== null ? getAqiColor(aqi) : '#94a3b8';
          const radius = aqi !== null ? getRadius(aqi) : 16;

          return (
            <CircleMarker
              key={city}
              center={coords}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.85,
                color: '#fff',
                weight: 2,
              }}
              eventHandlers={{
                click: () => onCityClick?.(city),
              }}
            >
              {/* Always-visible city name tooltip */}
              <Tooltip permanent direction="top" offset={[0, -radius]} opacity={1}>
                <span className="font-semibold text-xs">{city}</span>
                {aqi !== null && <span className="ml-1 text-xs opacity-75">{aqi}</span>}
              </Tooltip>

              {/* Click popup with full details */}
              {data && (
                <Popup>
                  <div className="min-w-[200px] p-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-bold text-base">{city}</span>
                    </div>

                    {/* AQI */}
                    <div
                      className="text-center py-2 px-4 rounded-lg text-white font-bold text-xl mb-3"
                      style={{ backgroundColor: color }}
                    >
                      AQI: {data.aqi}
                      <div className="text-xs font-normal opacity-90 mt-0.5">
                        {t.levels[data.level] || data.level}
                      </div>
                    </div>

                    {/* Weather */}
                    <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                      {data.weather.temperature !== null && (
                        <div className="bg-orange-50 rounded p-1.5">
                          <div className="text-orange-600 font-semibold">🌡 {t.weather.temperature}</div>
                          <div className="font-bold">{data.weather.temperature.toFixed(1)}°C</div>
                          {data.weather.feelsLike != null && (
                            <div className="text-gray-400 text-[10px]">Feels {data.weather.feelsLike.toFixed(0)}°</div>
                          )}
                        </div>
                      )}
                      {data.weather.humidity !== null && (
                        <div className="bg-blue-50 rounded p-1.5">
                          <div className="text-blue-600 font-semibold">💧 {t.weather.humidity}</div>
                          <div className="font-bold">{data.weather.humidity}%</div>
                        </div>
                      )}
                      {data.weather.windSpeed !== null && (
                        <div className="bg-teal-50 rounded p-1.5">
                          <div className="text-teal-600 font-semibold">💨 {t.weather.windSpeed}</div>
                          <div className="font-bold">{data.weather.windSpeed.toFixed(1)} m/s</div>
                        </div>
                      )}
                      {data.weather.pressure !== null && (
                        <div className="bg-purple-50 rounded p-1.5">
                          <div className="text-purple-600 font-semibold">📊 {t.weather.pressure}</div>
                          <div className="font-bold">{data.weather.pressure} hPa</div>
                        </div>
                      )}
                    </div>

                    {/* Pollutants */}
                    {(data.pollutants.pm25 || data.pollutants.pm10) && (
                      <div className="text-xs text-gray-500 border-t pt-2 mt-1 flex gap-3">
                        {data.pollutants.pm25 !== null && (
                          <span>PM2.5: <strong>{data.pollutants.pm25.toFixed(1)}</strong></span>
                        )}
                        {data.pollutants.pm10 !== null && (
                          <span>PM10: <strong>{data.pollutants.pm10.toFixed(1)}</strong></span>
                        )}
                      </div>
                    )}

                    {data.weather.description && (
                      <div className="text-xs text-gray-400 mt-1 capitalize">{data.weather.description}</div>
                    )}

                    <div className="text-[10px] text-gray-300 mt-2 border-t pt-1">
                      {new Date(data.timestamp).toLocaleString()}
                    </div>
                  </div>
                </Popup>
              )}

              {/* No data popup */}
              {!data && (
                <Popup>
                  <div className="p-2 text-center">
                    <div className="font-bold">{city}</div>
                    <div className="text-sm text-gray-400 mt-1">{t.pollutants.noData}</div>
                  </div>
                </Popup>
              )}
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
