import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A simple utility function to conditionally join class names together.
 * @param classes - Class names to be combined
 * @returns A single className string
 */
function classNames(...classes: Array<string | undefined | null | boolean>): string {
  return classes.filter(Boolean).join(' ');
}

// Re-export for backward compatibility
export { classNames as clsx };

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names to be combined
 * @returns A single className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID
 * @returns A unique string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 50 characters
    .substring(0, 50)
    // Remove trailing hyphen if created by substring
    .replace(/-+$/, '');
}

/**
 * Generates a unique slug by checking against existing slugs
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Formats a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'PEN')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Truncates text to a specified length
 * @param text - The text to truncate
 * @param length - Maximum length before truncation
 * @param ellipsis - Whether to add '...' at the end (default: true)
 * @returns The truncated text
 */
export function truncateText(text: string, length: number, ellipsis: boolean = true): string {
  if (text.length <= length) return text;
  return ellipsis ? `${text.substring(0, length)}...` : text.substring(0, length);
}

/**
 * Adds proper ARIA attributes to an element based on its loading state
 * @param isLoading - Whether the element is in a loading state
 * @returns An object with appropriate ARIA attributes
 */
export function getAriaLoadingProps(isLoading: boolean) {
  return {
    'aria-busy': isLoading,
    'aria-live': isLoading ? 'polite' : 'off',
    ...(isLoading && { 'aria-label': 'Cargando...' }),
  };
}

/**
 * Validates if a color has sufficient contrast for accessibility
 * @param bgColor - Background color in hex format
 * @param textColor - Text color in hex format (default: '#FFFFFF' or '#000000')
 * @returns Object with contrast ratio and WCAG compliance
 */
export function checkColorContrast(
  bgColor: string,
  textColor: string = bgColor > '#888888' ? '#000000' : '#FFFFFF'
) {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const [r1, g1, b1] = hexToRgb(bgColor);
  const [r2, g2, b2] = hexToRgb(textColor);

  const lum1 = getLuminance(r1, g1, b1);
  const lum2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const contrast = (lighter + 0.05) / (darker + 0.05);

  return {
    contrastRatio: contrast.toFixed(2),
    aa: contrast >= 4.5,
    aaLarge: contrast >= 3,
    aaa: contrast >= 7,
    aaaLarge: contrast >= 4.5,
  };
}

/**
 * Debounce a function call
 * @param func - The function to debounce
 * @param wait - Time to wait in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
