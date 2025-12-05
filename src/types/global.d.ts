/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

// Extender la interfaz Window para incluir propiedades globales
declare global {
  interface Window {
    // Agregar propiedades globales aquí si es necesario
  }
}

// Extender la interfaz NodeJS.ProcessEnv para incluir variables de entorno
declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_URL: string
    SUPABASE_SERVICE_ROLE_KEY: string
  }
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
