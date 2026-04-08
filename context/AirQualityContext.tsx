'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/hooks/use-socket';

export interface AirData {
  _id: string;
  city: string;
  aqi: number;
  level: string;
  dominantPollutant: string | null;
  pollutants: {
    pm25: number | null;
    pm10: number | null;
    co: number | null;
    no2: number | null;
    so2: number | null;
    o3: number | null;
  };
  weather: {
    temperature: number | null;
    humidity: number | null;
    windSpeed: number | null;
    windDirection: number | null;
    pressure: number | null;
    feelsLike: number | null;
    description: string | null;
    icon: string | null;
  };
  timestamp: string;
}

export interface Alert {
  _id: string;
  city: string;
  aqi: number;
  level: string;
  message: string;
  seen: boolean;
  timestamp: string;
}

interface AirQualityContextType {
  currentData: AirData | null;
  allCitiesData: Record<string, AirData>;
  alerts: Alert[];
  historicalData: AirData[];
  loading: boolean;
  error: string | null;
  socketConnected: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  fetchCurrentData: (city: string) => Promise<void>;
  fetchHistoricalData: (city: string, limit?: number) => Promise<void>;
  fetchAlerts: (limit?: number) => Promise<void>;
  markAlertAsSeen: (alertId: string) => Promise<void>;
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(undefined);

export function AirQualityProvider({ children }: { children: React.ReactNode }) {
  const { connected: socketConnected, on, off } = useSocket();
  const [currentData, setCurrentData] = useState<AirData | null>(null);
  const [allCitiesData, setAllCitiesData] = useState<Record<string, AirData>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [historicalData, setHistoricalData] = useState<AirData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Tashkent');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const fetchCurrentData = useCallback(async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/air/current/${city}`);
      if (!response.ok) throw new Error('Failed to fetch current data');
      const data = await response.json();
      setCurrentData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const fetchHistoricalData = useCallback(async (city: string, limit = 48) => {
    try {
      const response = await fetch(`${apiUrl}/api/air/history/${city}?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch historical data');
      const data = await response.json();
      setHistoricalData(data);
    } catch (err) {
      console.error('[AirQuality] Error fetching historical data:', err);
    }
  }, [apiUrl]);

  const fetchAlerts = useCallback(async (limit = 50) => {
    try {
      const response = await fetch(`${apiUrl}/api/air/alerts?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error('[AirQuality] Error fetching alerts:', err);
    }
  }, [apiUrl]);

  const fetchAllCitiesData = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/air/cities`);
      if (!response.ok) return;
      const data: AirData[] = await response.json();
      const map: Record<string, AirData> = {};
      data.forEach(d => { map[d.city] = d; });
      setAllCitiesData(map);
    } catch (err) {
      console.error('[AirQuality] Error fetching all cities data:', err);
    }
  }, [apiUrl]);

  const markAlertAsSeen = useCallback(async (alertId: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/air/alerts/${alertId}/seen`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to mark alert as seen');
      const updatedAlert = await response.json();
      setAlerts(prev => prev.map(a => a._id === alertId ? updatedAlert : a));
    } catch (err) {
      console.error('[AirQuality] Error marking alert as seen:', err);
    }
  }, [apiUrl]);

  // Real-time updates via WebSocket
  useEffect(() => {
    const handleAirUpdate = (data: AirData) => {
      if (data.city === selectedCity) setCurrentData(data);
      setHistoricalData(prev => [data, ...prev.slice(0, -1)]);
      // Update all cities map in real-time
      setAllCitiesData(prev => ({ ...prev, [data.city]: data }));
    };

    const handleNewAlert = (alert: Alert) => {
      setAlerts(prev => [alert, ...prev]);
    };

    on('air-update', handleAirUpdate);
    on('new-alert', handleNewAlert);

    return () => {
      off('air-update', handleAirUpdate);
      off('new-alert', handleNewAlert);
    };
  }, [selectedCity, on, off]);

  // Initial data fetch
  useEffect(() => {
    fetchCurrentData(selectedCity);
    fetchHistoricalData(selectedCity);
    fetchAlerts();
    fetchAllCitiesData();
  }, [selectedCity, fetchCurrentData, fetchHistoricalData, fetchAlerts, fetchAllCitiesData]);

  return (
    <AirQualityContext.Provider
      value={{
        currentData,
        allCitiesData,
        alerts,
        historicalData,
        loading,
        error,
        socketConnected,
        selectedCity,
        setSelectedCity,
        fetchCurrentData,
        fetchHistoricalData,
        fetchAlerts,
        markAlertAsSeen,
      }}
    >
      {children}
    </AirQualityContext.Provider>
  );
}

export function useAirQuality() {
  const context = useContext(AirQualityContext);
  if (!context) throw new Error('useAirQuality must be used within AirQualityProvider');
  return context;
}
