'use client';

import { useAirQuality } from '@/context/AirQualityContext';
import { useLanguage } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function AlertsPage() {
  const { alerts, markAlertAsSeen, loading } = useAirQuality();
  const { t } = useLanguage();
  const [filterUnseen, setFilterUnseen] = useState(false);

  const filteredAlerts = filterUnseen ? alerts.filter((a) => !a.seen) : alerts;
  const unseenCount = alerts.filter((a) => !a.seen).length;

  const getLevelColor = (level: string) => {
    if (level === 'Good') return '#22c55e';
    if (level === 'Moderate') return '#eab308';
    if (level === 'Unhealthy for Sensitive Groups') return '#f97316';
    if (level === 'Unhealthy') return '#ef4444';
    if (level === 'Very Unhealthy') return '#7c3aed';
    return '#6d28d9';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t.alerts.title}</h1>
            <p className="text-muted-foreground">
              {unseenCount > 0
                ? t.alerts.unseenCount.replace('{n}', String(unseenCount))
                : t.alerts.noUnseen}
            </p>
          </div>

          <div className="mb-8 flex gap-2">
            <Button variant={filterUnseen ? 'default' : 'outline'} onClick={() => setFilterUnseen(true)}>
              <Bell size={18} className="mr-2" />
              {t.alerts.unseen} ({unseenCount})
            </Button>
            <Button variant={!filterUnseen ? 'default' : 'outline'} onClick={() => setFilterUnseen(false)}>
              <AlertTriangle size={18} className="mr-2" />
              {t.alerts.all} ({alerts.length})
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">{t.alerts.loading}</p>
              </div>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <Card className="border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm p-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t.alerts.allCaughtUp}</h3>
                <p className="text-muted-foreground">
                  {filterUnseen ? t.alerts.noUnseenDesc : t.alerts.noAlertsDesc}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <Card
                  key={alert._id}
                  className={`border-border/40 bg-gradient-to-br from-background via-background to-accent/20 backdrop-blur-sm overflow-hidden transition-opacity ${
                    alert.seen ? 'opacity-75' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: getLevelColor(alert.level) }}
                          >
                            <AlertTriangle size={24} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{alert.city}</h3>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ backgroundColor: getLevelColor(alert.level) }}
                            >
                              {t.levels[alert.level] || alert.level}
                            </span>
                            {!alert.seen && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>

                          <p className="text-muted-foreground mb-2">{alert.message}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-semibold text-foreground">{t.alerts.aqi}:</span> {alert.aqi}
                            </div>
                            <div>{new Date(alert.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {!alert.seen && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAlertAsSeen(alert._id)}
                          className="flex-shrink-0"
                        >
                          {t.alerts.markAsSeen}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
