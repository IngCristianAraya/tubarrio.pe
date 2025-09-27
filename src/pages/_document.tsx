import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { ReactElement } from 'react';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    // Define self for server-side rendering
    if (typeof global.self === 'undefined') {
      (global as any).self = global;
    }
    
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => <App {...props} />,
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: [initialProps.styles],
      };
    } finally {
      // Clean up
    }
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Define self for client-side rendering
                if (typeof self === 'undefined') {
                  window.self = window;
                }
                // Ensure global.self is defined
                if (typeof global !== 'undefined' && typeof global.self === 'undefined') {
                  global.self = global;
                }
                // Ensure global.self is defined for all environments
                (function() {
                  if (typeof globalThis !== 'undefined') {
                    globalThis.self = globalThis.self || globalThis;
                  }
                  if (typeof self !== 'undefined') {
                    self.self = self.self || self;
                  }
                  if (typeof window !== 'undefined') {
                    window.self = window.self || window;
                  }
                  if (typeof global !== 'undefined') {
                    global.self = global.self || global;
                  }
                })();
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
