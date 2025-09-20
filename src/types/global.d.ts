/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

// Declaraciones para módulos que no tienen tipos
// @ts-ignore
declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useContext<T>(context: React.Context<T>): T;
  // Agrega aquí otros hooks que necesites
}

// Extender la interfaz Window para incluir mapboxgl
declare global {
  interface Window {
    mapboxgl: typeof import('mapbox-gl');
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_FIREBASE_API_KEY: string
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
    NEXT_PUBLIC_FIREBASE_APP_ID: string
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string
  }
}

// Definir módulo para mapbox-gl
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module 'mapbox-gl' {
  // Aquí puedes agregar las definiciones de tipos específicas si es necesario
  export * from 'mapbox-gl/dist/mapbox-gl';
}

// Add type declarations for modules without types
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.svg' {
  import React from 'react'
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default content
}
