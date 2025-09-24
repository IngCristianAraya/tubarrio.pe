import { Service } from '@/types/service';


export const sampleServices: Record<string, Service[]> = {

  'restaurantes-y-menus': [
    {
      id: '1',
      slug: 'sabor-peruano',
      name: 'Sabor Peruano',
      description: 'Comida típica peruana con los mejores sabores de la costa, sierra y selva.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: '/Anticuchos.webp',
      images: ['/Anticuchos.webp'],
      rating: 4.5,
      reviewCount: 128,
      featured: true
    },
    {
      id: '1',
      slug: 'sabor-peruano',
      name: 'Sabor Peruano',
      description: 'Comida típica peruana con los mejores sabores de la costa, sierra y selva.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: '/Anticuchos.webp',
      images: ['/Anticuchos.webp'],
      rating: 4.5,
      reviewCount: 128,
      featured: true
    },
    {
      id: '1',
      slug: 'sabor-peruano',
      name: 'Sabor Peruano',
      description: 'Comida típica peruana con los mejores sabores de la costa, sierra y selva.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: '/Anticuchos.webp',
      images: ['/Anticuchos.webp'],
      rating: 4.5,
      reviewCount: 128,
      featured: true
    },
    {
      id: '1',
      slug: 'sabor-peruano',
      name: 'Sabor Peruano',
      description: 'Comida típica peruana con los mejores sabores de la costa, sierra y selva.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: '/Anticuchos.webp',
      images: ['/Anticuchos.webp'],
      rating: 4.5,
      reviewCount: 128,
      featured: true
    },
  ],
  'comida-rapida': [
    {
      id: '9',
      slug: 'superburger',
      name: 'Superburger',
      description: 'Las mejores hamburguesas artesanales.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800'],
      rating: 4.7,
      reviewCount: 89,
      featured: true
    },  
    {
      id: '9',
      slug: 'rey-del-shawarma',
      name: 'Rey del Shawarma',
      description: 'Las mejores Shawarma artesanales.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: ['https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400'],
      rating: 4.7,
      reviewCount: 89,
      featured: true
    },  
    {
      id: '9',
      slug: 'shawarma-el-faraon',
      name: 'Shawarma El Faraon',
      description: 'Disfruta del sabor tradicional del Medio Oriente con nuestro shawarma artesanal.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800'],
      rating: 4.7,
      reviewCount: 89,
      featured: true
    },  
    {
      id: '9',
      slug: 'superburger',
      name: 'Superburger',
      description: 'Las mejores hamburguesas artesanales.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800'],
      rating: 4.7,
      reviewCount: 89,
      featured: true
    },  
  ],
  'abarrotes': [
    {
      id: '5',
      slug: 'lacteos-y-embutidos-ayc',
      name: 'Lácteos y Embutidos A&C ',
      description: 'Todo lo que necesitas para tu hogar en un solo lugar.',
      category: 'Abarrotes',
      categorySlug: 'abarrotes',
      image: '/images/cursos_de_programacion.png',
      images: ['/images/cursos_de_programacion.png'],
      rating: 4.2,
      reviewCount: 64,
      featured: true
    },
    {
      id: '6',
      slug: 'mini-market-la-esquina',
      name: 'Mini Market La Esquina',
      description: 'Productos de primera necesidad a un paso de tu hogar.',
      category: 'Abarrotes',
      categorySlug: 'abarrotes',
      image: '/images/abarrotes2.jpg',
      images: ['/images/abarrotes2.jpg'],
      rating: 4.0,
      reviewCount: 42,
      featured: false
    },
    {
      id: '7',
      slug: 'lacteos-y-embutidos-ac',
      name: 'Lácteos y Embutidos A&C ',
      description: 'Todo lo que necesitas para tu hogar en un solo lugar.',
      category: 'Abarrotes',
      categorySlug: 'abarrotes',
      image: '/images/cursos_de_programacion.png',
      images: ['/images/cursos_de_programacion.png'],
      rating: 4.2,
      reviewCount: 64,
      featured: true
    },
    {
      id: '8',
      slug: 'lacteos-y-embutidos-ac',
      name: 'Lácteos y Embutidos A&C ',
      description: 'Todo lo que necesitas para tu hogar en un solo lugar.',
      category: 'Abarrotes',
      categorySlug: 'abarrotes',
      image: '/images/cursos_de_programacion.png',
      images: ['/images/cursos_de_programacion.png'],
      rating: 4.2,
      reviewCount: 64,
      featured: true
    },
  ],
  'lavanderias': [
    {
      id: '9',
      slug: 'lavanderia-antares',
      name: 'Lavandería Antares',
      description: 'Servicio de lavado y planchado con los mejores productos.',
      category: 'Lavanderías',
      categorySlug: 'lavanderias',
      image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
      images: ['https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg'],
      rating: 4.7,
      reviewCount: 89,
      featured: true
    },
  ],
  'gimnasios': [
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
  ],
  'servicios': [
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
  ],
  'peluquerias': [
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
    {
      id: '10',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true
    },
  ]
};


export default sampleServices;
