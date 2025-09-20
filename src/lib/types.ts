export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  // Add other service properties as needed
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  serviceCount: number;
  // Add other category properties as needed
}

export interface HomePageProps {
  categories: Category[];
  servicesByCategory: Record<string, Service[]>;
}
