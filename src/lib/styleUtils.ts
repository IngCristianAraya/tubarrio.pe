import { designTokens, type ColorPalette, type ColorShade, type TypographySize, type SpacingScale } from './designSystem';

/**
 * Get a color from the design system
 * @param color The color name from the palette (e.g., 'primary', 'gray')
 * @param shade The shade/variant (e.g., '500', '700')
 * @returns The color value
 */
export function getColor(color: ColorPalette, shade: ColorShade = '500'): string {
  const colorGroup = designTokens.colors[color];
  if (typeof colorGroup === 'object' && colorGroup !== null) {
    // Safely access the color shade using a type assertion
    const colorShades = colorGroup as Record<ColorShade, string>;
    return colorShades[shade] || '';
  }
  return '';
}

/**
 * Get a responsive font size class
 * @param size The typography size key (e.g., 'sm', 'lg', 'xl')
 * @returns A string with responsive font size classes
 */
export function getFontSize(size: TypographySize): string {
  return `text-${size}`;
}

/**
 * Get a spacing utility class
 * @param size The spacing scale (e.g., '2', '4', '6')
 * @param direction The direction (e.g., 'm' for margin, 'p' for padding)
 * @param sides The sides to apply spacing (e.g., 'x' for left/right, 'y' for top/bottom, 't' for top, etc.)
 * @returns A Tailwind-like spacing class
 */
export function getSpacing(
  size: SpacingScale,
  direction: 'm' | 'p' = 'm',
  sides?: 'x' | 'y' | 't' | 'r' | 'b' | 'l'
): string {
  const prefix = direction === 'm' ? 'm' : 'p';
  const sidePrefix = sides ? sides : '';
  return `${prefix}${sidePrefix}-${size}`;
}

/**
 * Get a consistent box shadow
 * @param size The shadow size (e.g., 'sm', 'md', 'lg')
 * @returns A Tailwind-like shadow class
 */
export function getShadow(size: keyof typeof designTokens.boxShadow = 'DEFAULT'): string {
  return `shadow-${size}`;
}

/**
 * Get a consistent border radius
 * @param size The border radius size (e.g., 'sm', 'md', 'lg')
 * @returns A Tailwind-like border radius class
 */
export function getBorderRadius(size: keyof typeof designTokens.borderRadius = 'DEFAULT'): string {
  return `rounded-${size}`;
}

/**
 * Get a consistent transition
 * @param property The CSS property to transition (e.g., 'colors', 'opacity')
 * @returns A transition utility class
 */
export function getTransition(
  property: keyof typeof designTokens.animation.transition = 'DEFAULT'
): string {
  return `transition-${property}`;
}

/**
 * Get a consistent button style
 * @param variant The button variant (e.g., 'primary', 'secondary', 'outline')
 * @param size The button size (e.g., 'sm', 'md', 'lg')
 * @returns A string of Tailwind classes for the button
 */
export function getButtonStyle(
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md'
): string {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-orange-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-orange-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return `${baseStyles} ${variants[variant]} ${sizes[size]}`;
}

/**
 * Get a consistent card style
 * @param variant The card variant (e.g., 'elevated', 'outline', 'filled')
 * @returns A string of Tailwind classes for the card
 */
export function getCardStyle(variant: 'elevated' | 'outline' | 'filled' = 'elevated'): string {
  const baseStyles = 'rounded-lg overflow-hidden';
  
  const variants = {
    elevated: 'bg-white shadow-md',
    outline: 'border border-gray-200',
    filled: 'bg-gray-50',
  };
  
  return `${baseStyles} ${variants[variant]}`;
}

/**
 * Get a consistent heading style
 * @param level The heading level (1-6)
 * @returns A string of Tailwind classes for the heading
 */
export function getHeadingStyle(level: 1 | 2 | 3 | 4 | 5 | 6 = 2): string {
  const styles = {
    1: 'text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl',
    2: 'text-3xl font-bold text-gray-900',
    3: 'text-2xl font-semibold text-gray-900',
    4: 'text-xl font-semibold text-gray-900',
    5: 'text-lg font-medium text-gray-900',
    6: 'text-base font-medium text-gray-900',
  };
  
  return styles[level];
}

/**
 * Get a consistent text style
 * @param variant The text variant (e.g., 'body', 'small', 'caption')
 * @returns A string of Tailwind classes for the text
 */
export function getTextStyle(variant: 'body' | 'small' | 'caption' = 'body'): string {
  const styles = {
    body: 'text-base text-gray-700',
    small: 'text-sm text-gray-600',
    caption: 'text-xs text-gray-500',
  };
  
  return styles[variant];
}
