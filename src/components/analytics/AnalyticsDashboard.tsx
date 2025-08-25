'use client';

import React, { useEffect, useState } from 'react';
import { useAnalytics } from '@/context/AnalyticsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  days?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard({ days = 30 }: AnalyticsDashboardProps) {
  const { state, getMetrics } = useAnalytics();
  const { metrics, isLoading } = state;
  const [selectedPeriod, setSelectedPeriod] = useState(days);

  useEffect(() => {
    getMetrics(selectedPeriod);
  }, [selectedPeriod, getMetrics]);

  const handlePeriodChange = (newPeriod: number) => {
    setSelectedPeriod(newPeriod);
  };

  if (isLoading) {
    return <AnalyticsLoadingSkeleton />;
  }

  const contactMethodsData = [
    { name: 'WhatsApp', value: metrics.contactMethods.whatsapp, color: '#25D366' },
    { name: 'Teléfono', value: metrics.contactMethods.phone, color: '#007BFF' }
  ];

  const conversionRate = metrics.totalPageViews > 0 
    ? ((metrics.totalContactClicks / metrics.totalPageViews) * 100).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header con filtros de período */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Métricas de rendimiento de la plataforma</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {period} días
            </button>
          ))}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Vistas de Página"
          value={metrics.totalPageViews.toLocaleString()}
          icon="👁️"
          color="blue"
        />
        <MetricCard
          title="Clics en Servicios"
          value={metrics.totalServiceClicks.toLocaleString()}
          icon="🎯"
          color="green"
        />
        <MetricCard
          title="Contactos Generados"
          value={metrics.totalContactClicks.toLocaleString()}
          icon="📞"
          color="purple"
        />
        <MetricCard
          title="Tasa de Conversión"
          value={`${conversionRate}%`}
          icon="📈"
          color="orange"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de vistas diarias */}
        <Card>
          <CardHeader>
            <CardTitle>Vistas Diarias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                    formatter={(value) => [value, 'Vistas']}
                  />
                  <Bar dataKey="views" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de contacto */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contactMethodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contactMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Clics']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios Más Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.topServices.length > 0 ? (
              metrics.topServices.map((service, index) => (
                <div key={service.serviceId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{service.serviceName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">ID: {service.serviceId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{service.clicks}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">clics</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No hay datos de servicios disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-20" />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
      
      <Skeleton className="h-64" />
    </div>
  );
}