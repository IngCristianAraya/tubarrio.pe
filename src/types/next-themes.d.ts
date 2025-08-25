import 'next-themes';

declare module 'next-themes' {
  interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    attribute?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export function useTheme(): { theme: string; setTheme: (theme: string) => void };
}
