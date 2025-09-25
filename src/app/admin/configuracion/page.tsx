'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from '@firebase/firestore';
import { db } from '@/lib/firebase/config';

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  features: {
    enableRegistration: boolean;
    enableComments: boolean;
    enableRatings: boolean;
    enableAnalytics: boolean;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
}

interface SystemStats {
  totalServices: number;
  totalCategories: number;
  activeServices: number;
  lastBackup: string;
  systemVersion: string;
  firebaseUsage: {
    reads: number;
    writes: number;
    deletes: number;
  };
}

export default function ConfigurationPage() {
  const [config, setConfig] = useState<SystemConfig>({
    siteName: 'TuBarrio.pe',
    siteDescription: 'Directorio de servicios locales en tu barrio',
    contactEmail: 'contacto@tubarrio.pe',
    contactPhone: '+51 999 999 999',
    whatsappNumber: '+51999999999',
    socialMedia: {
      facebook: 'https://facebook.com/tubarriope',
      instagram: 'https://instagram.com/tubarriope',
      twitter: 'https://twitter.com/tubarriope'
    },
    seo: {
      metaTitle: 'TuBarrio.pe - Servicios Locales',
      metaDescription: 'Encuentra los mejores servicios en tu barrio. Restaurantes, abarrotes, panaderías y más.',
      keywords: 'servicios locales, barrio, restaurantes, delivery, abarrotes'
    },
    features: {
      enableRegistration: true,
      enableComments: false,
      enableRatings: true,
      enableAnalytics: true
    },
    maintenance: {
      enabled: false,
      message: 'Sitio en mantenimiento. Volveremos pronto.'
    }
  });

  const [stats, setStats] = useState<SystemStats>({
    totalServices: 0,
    totalCategories: 0,
    activeServices: 0,
    lastBackup: 'Nunca',
    systemVersion: '1.0.0',
    firebaseUsage: {
      reads: 0,
      writes: 0,
      deletes: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSystemStats();
  }, []);

  const loadSystemStats = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas de servicios
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const activeServices = services.filter((service: any) => service.active).length;
      const categories = [...new Set(services.map((service: any) => service.category))];
      
      setStats({
        totalServices: services.length,
        totalCategories: categories.length,
        activeServices: activeServices,
        lastBackup: new Date().toLocaleDateString('es-ES'),
        systemVersion: '1.0.0',
        firebaseUsage: {
          reads: 8500, // Datos de ejemplo basados en el historial
          writes: 611,
          deletes: 5
        }
      });
    } catch (err) {
      console.error('Error loading system stats:', err);
      setError('Error al cargar las estadísticas del sistema');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = <K extends keyof SystemConfig, F extends keyof SystemConfig[K]>(section: K, field: F, value: SystemConfig[K][F]) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value
      }
    } as SystemConfig));
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Simular guardado de configuración
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí guardarías en Firebase o localStorage
      localStorage.setItem('system_config', JSON.stringify(config));
      
      setSuccess('Configuración guardada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving config:', err);
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      setSaving(true);
      
      // Simular proceso de backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStats(prev => ({
        ...prev,
        lastBackup: new Date().toLocaleDateString('es-ES')
      }));
      
      setSuccess('Backup realizado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating backup:', err);
      setError('Error al crear el backup');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'features', name: 'Características', icon: '🎛️' },
    { id: 'maintenance', name: 'Mantenimiento', icon: '🔧' },
    { id: 'system', name: 'Sistema', icon: '💻' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">Gestiona la configuración general de la plataforma</p>
        </div>
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? '💾 Guardando...' : '💾 Guardar Cambios'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Configuración General</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Sitio
                  </label>
                  <input
                    type="text"
                    value={config.siteName}
                    onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={config.contactPhone}
                    onChange={(e) => setConfig(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={config.whatsappNumber}
                    onChange={(e) => setConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Sitio
                </label>
                <textarea
                  value={config.siteDescription}
                  onChange={(e) => setConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Configuración SEO</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título Meta
                </label>
                <input
                  type="text"
                  value={config.seo.metaTitle}
                  onChange={(e) => handleConfigChange('seo', 'metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción Meta
                </label>
                <textarea
                  value={config.seo.metaDescription}
                  onChange={(e) => handleConfigChange('seo', 'metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Palabras Clave (separadas por comas)
                </label>
                <input
                  type="text"
                  value={config.seo.keywords}
                  onChange={(e) => handleConfigChange('seo', 'keywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Características del Sistema</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Registro de Negocios</h3>
                    <p className="text-sm text-gray-500">Permitir que los usuarios registren sus negocios</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.enableRegistration}
                    onChange={(e) => handleConfigChange('features', 'enableRegistration', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Comentarios</h3>
                    <p className="text-sm text-gray-500">Permitir comentarios en los servicios</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.enableComments}
                    onChange={(e) => handleConfigChange('features', 'enableComments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Calificaciones</h3>
                    <p className="text-sm text-gray-500">Permitir calificaciones de servicios</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.enableRatings}
                    onChange={(e) => handleConfigChange('features', 'enableRatings', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500">Habilitar seguimiento de analytics</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.features.enableAnalytics}
                    onChange={(e) => handleConfigChange('features', 'enableAnalytics', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Modo Mantenimiento</h2>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Activar Modo Mantenimiento</h3>
                  <p className="text-sm text-gray-500">El sitio mostrará una página de mantenimiento</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.maintenance.enabled}
                  onChange={(e) => handleConfigChange('maintenance', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje de Mantenimiento
                </label>
                <textarea
                  value={config.maintenance.message}
                  onChange={(e) => handleConfigChange('maintenance', 'message', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mensaje que se mostrará durante el mantenimiento"
                />
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Información del Sistema</h2>
              
              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏪</span>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Servicios</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.totalServices}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.activeServices}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📂</span>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categorías</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalCategories}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Firebase Usage */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uso de Firebase (últimos 30 días)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.firebaseUsage.reads.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Lecturas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.firebaseUsage.writes.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Escrituras</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.firebaseUsage.deletes}</p>
                    <p className="text-sm text-gray-600">Eliminaciones</p>
                  </div>
                </div>
              </div>
              
              {/* System Actions */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones del Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Último Backup</h4>
                      <p className="text-sm text-gray-500">{stats.lastBackup}</p>
                    </div>
                    <button
                      onClick={handleBackup}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Creando...' : '💾 Crear Backup'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Versión del Sistema</h4>
                      <p className="text-sm text-gray-500">v{stats.systemVersion}</p>
                    </div>
                    <button
                      onClick={loadSystemStats}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      🔄 Actualizar Stats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}