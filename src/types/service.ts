/**
 * Service type definition for Tubarrio.pe
 * Defines the structure of service objects used throughout the application
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  emoji: string;
  serviceCount: number;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  website?: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  // Ubicación específica (barrio/urbanización)
  neighborhood?: string;
  // Dirección específica (opcional)
  address?: string;
  // Referencia de ubicación (opcional)
  reference?: string;
  // Ciudad o distrito (opcional, para búsquedas más amplias)
  district?: string;
  rating: number;
  image: string;
  images: string[];
  detailsUrl?: string;
  contactUrl?: string;
  whatsapp?: string;
  social?: string; // Mantenemos esto por compatibilidad
  socialMedia?: SocialMedia; // Nueva estructura para redes sociales
  horario?: string;
  hours?: string;
  available?: boolean;
  price?: string;
  // Add any other fields that might be present in your service objects
  [key: string]: any; // This allows for additional properties
}

/**
 * Service category type for filtering and display
 */
export interface ServiceCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

/**
 * Props for service-related components
 */

export interface ServiceListProps {
  services: Service[];
  loading?: boolean;
  error?: string | null;
  onServiceClick?: (service: Service) => void;
}
