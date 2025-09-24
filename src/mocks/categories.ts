import { Category } from '@/types/service';

export const sampleCategories: Category[] = [
  { id: '1', name: 'Restaurantes y menús', slug: 'restaurantes-y-menus', icon: '🍽️', emoji: '🍽️', serviceCount: 5 },
  { id: '2', name: 'Comida rápida', slug: 'comida-rapida', icon: '🍔', emoji: '🍔', serviceCount: 5 },
  { id: '3', name: 'Abarrotes', slug: 'abarrotes', icon: '🛒', emoji: '🛒', serviceCount: 18 },
  { id: '4', name: 'Lavanderías', slug: 'lavanderias', icon: '👕', emoji: '👕', serviceCount: 12 },
  { id: '5', name: 'Gimnasios', slug: 'gimnasios', icon: '💪', emoji: '💪', serviceCount: 8 },
  { id: '6', name: 'Servicios', slug: 'servicios', icon: '🤝', emoji: '🤝', serviceCount: 6 },
  { id: '9', name: 'Peluquerías', slug: 'peluquerias', icon: '✂️', emoji: '✂️', serviceCount: 9 },
];

export default sampleCategories;
