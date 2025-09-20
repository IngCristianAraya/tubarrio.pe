// Niveles de log
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  NONE: 'none'
} as const;

type LogLevel = typeof LOG_LEVELS[keyof typeof LOG_LEVELS];

// Nivel de log actual (cambiar a 'none' en producción para deshabilitar logs)
const CURRENT_LEVEL: LogLevel = 
  process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel || 
  (process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG);

// Verifica si se debe mostrar el log según el nivel
const shouldLog = (level: LogLevel): boolean => {
  const levels = Object.values(LOG_LEVELS);
  const currentLevelIndex = levels.indexOf(CURRENT_LEVEL);
  const messageLevelIndex = levels.indexOf(level);
  return messageLevelIndex >= currentLevelIndex;
};

// Función para formatear mensajes
const formatMessage = (message: string, level: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

// Logger principal
export const logger = {
  debug: (message: string, ...args: any[]) => {
    if (shouldLog(LOG_LEVELS.DEBUG)) {
      console.debug(formatMessage(message, 'debug'), ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    if (shouldLog(LOG_LEVELS.INFO)) {
      console.info(formatMessage(message, 'info'), ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (shouldLog(LOG_LEVELS.WARN)) {
      console.warn(formatMessage(message, 'warn'), ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (shouldLog(LOG_LEVELS.ERROR)) {
      console.error(formatMessage(message, 'error'), ...args);
    }
  },
  
  // Solo para errores críticos que siempre deben mostrarse
  critical: (message: string, ...args: any[]) => {
    console.error(`[CRITICAL] ${message}`, ...args);
  }
};

// Configuración global
declare global {
  interface Window {
    __ENABLE_LOGS__: boolean;
  }
}

// Habilitar/deshabilitar logs en tiempo de ejecución
if (typeof window !== 'undefined') {
  window.__ENABLE_LOGS__ = CURRENT_LEVEL !== LOG_LEVELS.NONE;
  
  // Opción para forzar logs en desarrollo
  if (process.env.NODE_ENV === 'development' && window.location.search.includes('debug=1')) {
    window.__ENABLE_LOGS__ = true;
  }
}

export default logger;
