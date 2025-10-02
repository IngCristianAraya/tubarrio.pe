/**
 * Property type definition for Tubarrio.pe
 * Defines the structure of property objects for real estate listings
 */

export interface PropertyType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  emoji: string;
  propertyCount: number;
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  area?: number; // en m²
  furnished?: boolean;
  petFriendly?: boolean;
  balcony?: boolean;
  garden?: boolean;
  pool?: boolean;
  gym?: boolean;
  security?: boolean;
  elevator?: boolean;
}

export interface PropertyContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  agentName?: string;
  agencyName?: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string; // 'departamento', 'casa', 'local-comercial', 'oficina', etc.
  typeSlug: string;
  
  // Ubicación
  neighborhood?: string; // Barrio/urbanización
  address?: string; // Dirección específica
  reference?: string; // Referencia de ubicación
  district?: string; // Distrito
  zone?: string; // Zona geográfica
  
  // Precio y condiciones
  price: number;
  currency: string; // 'PEN', 'USD'
  priceType: 'sale' | 'rent'; // venta o alquiler
  pricePerM2?: number;
  
  // Características
  features: PropertyFeatures;
  
  // Multimedia
  image: string; // Imagen principal
  images: string[]; // Galería de imágenes
  virtualTour?: string; // URL del tour virtual
  
  // Contacto
  contact: PropertyContact;
  
  // Metadatos
  rating?: number;
  views?: number;
  featured?: boolean;
  available?: boolean;
  publishedDate: Date;
  updatedDate: Date;
  
  // SEO y URLs
  detailsUrl?: string;
  contactUrl?: string;
  
  // Etiquetas y categorización
  tags?: string[];
  amenities?: string[]; // Amenidades del edificio/conjunto
  
  // Coordenadas para mapas
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Campos adicionales flexibles
  [key: string]: any;
}

/**
 * Property category type for filtering and display
 */
export interface PropertyCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  count?: number;
}

/**
 * Props for property-related components
 */
export interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  error?: string | null;
  onPropertyClick?: (property: Property) => void;
}

/**
 * Property search filters
 */
export interface PropertyFilters {
  type?: string;
  priceType?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  district?: string;
  neighborhood?: string;
  features?: string[];
  sortBy?: 'price' | 'date' | 'area' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Property search result
 */
export interface PropertySearchResult {
  properties: Property[];
  total: number;
  hasMore: boolean;
  filters: PropertyFilters;
}