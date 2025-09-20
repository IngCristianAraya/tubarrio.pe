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

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  location?: string;
  address?: string;
  reference?: string;
  rating: number;
  image: string;
  images: string[];
  detailsUrl?: string; // Made optional to match context
  contactUrl?: string; // Made optional to match context
  whatsapp?: string;
  social?: string;
  horario?: string;
  hours?: string;
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
