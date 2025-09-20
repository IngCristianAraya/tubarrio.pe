// Type definitions for missing modules
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'next/dynamic' {
  import { ComponentType } from 'react';
  
  interface DynamicOptions {
    ssr?: boolean;
    loading?: () => React.ReactNode;
  }
  
  function dynamic<P = {}>(
    loader: () => Promise<{ default: ComponentType<P> }>,
    options?: DynamicOptions
  ): ComponentType<P>;
  
  export default dynamic;
}

declare module 'next/head' {
  import { Component } from 'react';
  
  interface HeadProps {
    children?: React.ReactNode;
  }
  
  export default class Head extends Component<HeadProps> {}
}

// Add other missing module declarations here if needed
