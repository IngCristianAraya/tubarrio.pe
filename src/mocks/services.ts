import { Service } from '@/types/service';


export const sampleServices: Record<string, Service[]> = {
  'desarrollo-web': [
    {
      id: 'test-service-1',
      slug: 'desarrollo-web-profesional',
      name: 'Desarrollo Web Profesional',
      category: 'Desarrollo Web',
      categorySlug: 'desarrollo-web',
      description: 'Creamos sitios web modernos y responsivos para tu negocio',
      image: '/images/services/web-development.jpg',
      images: ['/images/services/web-development.jpg'],
      rating: 4.8,
      reviewCount: 25,
      featured: true,
      location: 'Lima, Perú',
      address: 'Av. Javier Prado 123',
      phone: '+51 999 888 777',
      whatsapp: '+51 999 888 777',
      contactUrl: 'https://wa.me/51999888777',
      detailsUrl: '/servicio/test-service-1',
      hours: 'Lun-Vie 9:00-18:00',
      tags: ['web', 'desarrollo', 'responsive', 'diseño', 'programación', 'sitios web'],
      plan: 'premium',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  'restaurantes-y-menus': [
    {
      id: 'rest-1',
      slug: 'anticuchos-bran',
      name: 'Anticuchos Bran',
      description: 'Comida típica peruana con los mejores sabores de la costa, sierra y selva.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: '/Anticuchos.webp',
      images: ['/Anticuchos.webp'],
      rating: 4.5,
      reviewCount: 128,
      featured: true,
      tags: ['anticuchos', 'comida peruana', 'parrilla', 'carne', 'típico', 'tradicional']
    },
    {
      id: 'rest-2',
      slug: 'caldo-de-gallina',
      name: 'Caldo de gallina',
      description: 'Comida típica peruana con los mejores sabores de la costa, sierra y selva.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: '/images/caldo_gallina.webp',
      images: ['/images/caldo_gallina.webp'],
      rating: 4.5,
      reviewCount: 128,
      featured: true,
      tags: ['caldo', 'gallina', 'sopa', 'comida peruana', 'tradicional', 'casero']
    },
    {
      id: 'rest-3',
      slug: 'iro-sushi',
      name: 'Iro Sushi',
      description: 'Sushi fresco y rollos especiales.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: ['https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'],
      rating: 4.5,
      reviewCount: 128,
      featured: true,
      tags: ['sushi', 'japonés', 'pescado', 'rollos', 'fresco', 'asiático']
    },
    {
      id: 'rest-4',
      slug: 'pizzeria-toscana',
      name: 'Pizzeria Toscana',
      description: 'Te invitamos a un viaje culinario a Italia con nuestras exquisitas pizzas a la piedra estilo toscano.',
      category: 'Restaurantes y menús',  // Nombre legible para mostrar
      categorySlug: 'restaurantes-y-menus',  // Para URLs y código interno
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: ['https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400'],
      rating: 4.5,
      reviewCount: 128,
      featured: true,
      tags: ['pizza', 'italiano', 'toscano', 'piedra', 'masa artesanal', 'queso']
    },
  ],
  'comida-rapida': [
    {
      id: 'fast-1',
      slug: 'superburger',
      name: 'Superburger',
      description: 'Las mejores hamburguesas artesanales.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800'],
      rating: 4.7,
      reviewCount: 89,
      featured: true,
      tags: ['hamburguesas', 'artesanal', 'carne', 'papas', 'comida rápida', 'gourmet']
    },  
    {
      id: 'fast-2',
      slug: 'rey-del-shawarma',
      name: 'Rey del Shawarma',
      description: 'Las mejores Shawarma artesanales.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: ['https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400'],
      rating: 4.7,
      reviewCount: 89,
      featured: true,
      tags: ['shawarma', 'árabe', 'medio oriente', 'carne', 'pollo', 'pan pita']
    },  
    {
      id: 'fast-3',
      slug: 'shawarma-el-faraon',
      name: 'Shawarma El Faraon',
      description: 'Disfruta del sabor tradicional del Medio Oriente con nuestro shawarma artesanal.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: ['https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800'],
      rating: 4.7,
      reviewCount: 89,
      featured: true,
      tags: ['shawarma', 'faraón', 'tradicional', 'medio oriente', 'especias', 'artesanal']
    },  
    {
      id: 'fast-4',
      slug: 'anticucheria-angie-corazon',
      name: 'Anticuchería Angie Corazón',
      description: 'Nuestros anticuchos son preparados con cariño, aderezo casero y la frescura de los mejores ingredientes.',
      category: 'Comida rápida',
      categorySlug: 'comida-rapida',
      image: 'https://res.cloudinary.com/do2rpqupm/image/upload/v1759465696/WhatsApp_Image_2025-10-02_at_10.52.05_PM_aaghbd.jpg',
      images: ['https://res.cloudinary.com/do2rpqupm/image/upload/v1759465696/WhatsApp_Image_2025-10-02_at_10.52.05_PM_aaghbd.jpg'],
      rating: 5,
      reviewCount: 89,
      featured: true,
      tags: ['anticuchos', 'corazón', 'parrilla', 'aderezo casero', 'peruano', 'cariño']
    },  
  ],
  'abarrotes': [
    {
      id: 'abr-1',
      slug: 'lacteos-y-embutidos-ayc',
      name: 'Lácteos y Embutidos A&C ',
      description: 'Todo lo que necesitas para tu hogar en un solo lugar.',
      category: 'Abarrotes',
      categorySlug: 'abarrotes',
      image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: ['https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400'],
      rating: 4.2,
      reviewCount: 64,
      featured: true,
      tags: ['lácteos', 'embutidos', 'queso', 'jamón', 'yogurt', 'leche']
    },
    {
      id: 'abr-2',
      slug: 'mercado-don-pedrito',
      name: 'Mercado Don Pedrito',
      description: 'La calidad y el sabor se encuentran en cada producto. ¡Compre fresco, compre cerca! Variedad de productos de alta calidad para su hogar."',
      category: 'Abarrotes',
      categorySlug: 'abarrotes',
      image: 'https://res.cloudinary.com/do2rpqupm/image/upload/v1759031874/almacen_pedrito_ixgdpb.png',
      images: ['https://res.cloudinary.com/do2rpqupm/image/upload/v1759031874/almacen_pedrito_ixgdpb.png'],
      rating: 4.0,
      reviewCount: 42,
      featured: false,
      tags: ['mercado', 'abarrotes', 'fresco', 'calidad', 'productos', 'hogar']
    },
  ],
  'lavanderias': [
    {
      id: 'lav-1',
      slug: 'lavanderia-antares',
      name: 'Lavandería Antares',
      description: 'Servicio de lavado y planchado con los mejores productos.',
      category: 'Lavanderías',
      categorySlug: 'lavanderias',
      image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
      images: ['https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg'],
      rating: 4.7,
      reviewCount: 89,
      featured: true,
      tags: ['lavandería', 'lavado', 'planchado', 'ropa', 'limpieza', 'servicio']
    },
  ],
  'servicios-generales': [
    {
      id: 'gym-1',
      slug: 'power-gym',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['gimnasio', 'fitness', 'ejercicio', 'entrenamiento', 'pesas', 'cardio']
    },
    {
      id: 'gym-2',
      slug: 'power-gym-2',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['gimnasio', 'fitness', 'ejercicio', 'entrenamiento', 'pesas', 'cardio']
    },
    {
      id: 'gym-3',
      slug: 'power-gym-3',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['gimnasio', 'fitness', 'ejercicio', 'entrenamiento', 'pesas', 'cardio']
    },
    {
      id: 'gym-4',
      slug: 'power-gym-4',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/gym1.jpg',
      images: ['/images/gym1.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['gimnasio', 'fitness', 'ejercicio', 'entrenamiento', 'pesas', 'cardio']
    },
  ],
  'tecnologia': [
    {
      id: 'creciendo-digital',
      slug: 'creciendo-digital',
      name: 'Creciendo Digital Cursos',
      description: 'Cursos de programación para principiantes y avanzados. Aprende las tecnologías más demandadas del mercado.',
      category: 'Tecnología',
      categorySlug: 'tecnologia',
      image: '/images/cursos_de_programacion.png',
      images: ['/images/cursos_de_programacion.png'],
      rating: 4.8,
      reviewCount: 45,
      featured: true,
      tags: ['programación', 'cursos', 'tecnología', 'desarrollo', 'digital', 'aprendizaje']
    },
  ],
  'servicios-profesionales': [
    {
      id: 'serv-1',
      slug: 'sannaterapia',
      name: 'SannaTerapia',
      description: 'Servicio de psicología integral que ofrece apoyo emocional y herramientas para mejorar.',
      category: 'Servicios',
      categorySlug: 'servicios',
      image: '/images/sannaterapia.webp',
      images: ['/images/sannaterapia.webp'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['psicología', 'terapia', 'salud mental', 'apoyo emocional', 'bienestar', 'consulta']
    },
    {
      id: 'serv-2',
      slug: 'imana-tu-vida',
      name: 'Imana Tu Vida',
      description: 'Utilizamos la técnica de pares biomagnéticos para restaurar el equilibrio energético ',
      category: 'Servicios',
      categorySlug: 'servicios',
      image: '/images/biomagnetismo.webp',
      images: ['/images/biomagnetismo.webp'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['biomagnetismo', 'pares biomagnéticos', 'equilibrio energético', 'terapia alternativa', 'salud', 'bienestar']
    },
    {
      id: 'serv-3',
      slug: 'mgc-dental-health',
      name: 'MGC Dental Health',
      description: 'Centro de odontologia integral, estética & funcional.',
      category: 'Servicios',
      categorySlug: 'servicios',
      image: '/images/mgc.webp',
      images: ['/images/mgc.webp'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['odontología', 'dental', 'estética dental', 'funcional', 'dientes', 'salud bucal']
    },
      {
      id: 'serv-3',
      slug: 'mgc-dental-health',
      name: 'Dra. Fiorella Herrera',
      description: 'Dedicado a ofrecer atención integral y personalizada',
      category: 'Servicios',
      categorySlug: 'servicios',
      image: 'https://res.cloudinary.com/do2rpqupm/image/upload/v1759529827/WhatsApp_Image_2025-10-03_at_4.52.51_PM_u1bhu4.jpg',
      images: ['https://res.cloudinary.com/do2rpqupm/image/upload/v1759529827/WhatsApp_Image_2025-10-03_at_4.52.51_PM_u1bhu4.jpg'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['odontología', 'dental', 'estética dental', 'funcional', 'dientes', 'salud bucal']
    },
  ],
  'peluquerias': [
    {
      id: 'hair-1',
      slug: 'peluqueria-salon',
      name: 'Peluqueria salon',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Peluquerias',
      categorySlug: 'peluquerias',
      image: '/images/peluqueria_salon.webp',
      images: ['/images/peluqueria_salon.webp'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['peluquería', 'corte', 'peinado', 'belleza', 'estilo', 'cabello']
    },
    {
      id: 'hair-2',
      slug: 'power-gym-hair',
      name: 'Power Gym',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/prueba_prueba.webp',
      images: ['/images/prueba_prueba.webp'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['gimnasio', 'fitness', 'ejercicio', 'entrenamiento', 'pesas', 'cardio']
    },
    {
      id: 'hair-3',
      slug: 'barbudos',
      name: 'Barbudos',
      description: 'Tu mejor versión comienza aquí. Equipos modernos y entrenadores certificados.',
      category: 'Gimnasios',
      categorySlug: 'gimnasios',
      image: '/images/barbudos.webp',
      images: ['/images/barbudos.webp'],
      rating: 4.8,
      reviewCount: 156,
      featured: true,
      tags: ['barbería', 'barba', 'corte masculino', 'afeitado', 'estilo', 'hombre']
    },
  ]
};


export default sampleServices;
