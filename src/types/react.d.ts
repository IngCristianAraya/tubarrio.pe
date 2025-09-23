// Declaraciones de tipos para React

// Permitir importación por defecto
import React from 'react';

declare module 'react' {
  // Extender los atributos HTML
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Define any custom attributes here if needed
  }
  
  // Asegurar que los hooks estén disponibles
  export function useState<S>(initialState: S | (() => S)): [S, (newState: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<R extends React.Reducer<any, any>>(
    reducer: R,
    initialState: React.ReducerState<R>,
    initializer?: undefined
  ): [React.ReducerState<R>, React.Dispatch<React.ReducerAction<R>>];
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Asegurar que la importación por defecto funcione
export = React;
export as namespace React;
