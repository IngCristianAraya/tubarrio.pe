'use client';

import { notFound, useParams } from 'next/navigation';
import { useServices } from '@/context/ServicesContext';
import React from 'react';

export default function ServicioDetallePage() {
  // Obtener todos los servicios del contexto (esto solo funciona en Client Components)
  // Para Server Components, normalmente cargarías los datos desde una fuente persistente (DB/API).
  // Aquí, por simplicidad, se hace una búsqueda dummy. Puedes migrar a fetch real si lo necesitas.
  // Si usas datos estáticos, puedes importar el array aquí.

  // Ejemplo de importación directa (ajusta la ruta si es necesario):
  // import { allServices } from '@/context/ServicesContext';

  // Obtener el id dinámico de la URL
  const { id } = useParams() as { id: string };

  // Simulación de datos (reemplaza por fetch real si tienes backend)
  const allServices = [
    {
      id: 'superburger',
      name: 'Superburger',
      category: 'Restaurantes',
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      location: 'Sta. Teodosia 573',
      description: 'Las mejores hamburguesas artesanales.',
      contactUrl: 'https://www.hamburguesaselrey.com',
    },
    {
      id: 'pizzeria-toscana',
      name: 'Pizzería Toscana',
      category: 'Restaurantes',
      image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      location: 'Av. Universitaria 1697',
      description: 'Pizzas a la piedra',
      contactUrl: 'https://www.pizzaitaliana.com',
    },
    {
      id: 'rey-del-shawarma',
      name: 'Rey del Shawarma',
      category: 'Restaurantes',
      image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      location: 'jr. Santa Nicerata 334',
      description: 'Tacos tradicionales y quesadillas',
      contactUrl: 'https://www.tacoselguero.com',
    },
    {
      id: 'iro-sushi',
      name: 'IRO Sushi',
      category: 'Restaurantes',
      image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      location: 'Av. Universitaria 1743',
      description: 'Sushi fresco y rollos especiales',
      contactUrl: 'https://www.sushiexpress.com',
    },
    {
      id: 'bobocha-bubble-tea-shop',
      name: 'Bobocha Bubble Tea Shop',
      category: 'Cafeteria',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      location: 'Av. Universitaria 1795',
      description: 'Tienda de bubble té',
      contactUrl: 'https://www.cafecentral.com',
    },
    {
      id: 'shawarma-el-faraon',
      name: 'Shawarma El Faraón',
      category: 'Restaurantes',
      image: 'https://images.pexels.com/photos/4394613/pexels-photo-4394613.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      location: 'Av. Universitaria 1687',
      description: 'Auténticos shawarmas y comida árabe preparada con recetas tradicionales',
      contactUrl: 'https://www.shawarmpalace.com',
    },
    {
      id: 'abarrotes-don-richard',
      name: 'Abarrotes Don Richard',
      category: 'Abarrotes',
      image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      location: 'Jirón Sáenz Peña 392',
      description: 'Venta de abarrotes, frutas y verduras ',
      contactUrl: 'https://www.abarrotesdonrichard.com',
    },
    {
      id: 'lacteos-y-embutidos-ayc',
      name: 'Lácteos y Embutidos A&C',
      category: 'Abarrotes',
      image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      location: 'Calle Sta Nicerata 354',
      description: 'Lácteos y embutidos',
      contactUrl: 'https://www.supervisorfamiliar.com',
    },
    {
      id: 'bodega-mercedes',
      name: 'Bodega Mercedes',
      category: 'Abarrotes',
      image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      location: 'Calle Sta Nicerata 152',
      description: 'Productos frescos del campo',
      contactUrl: 'https://www.frutasyverdurasmaria.com',
    },
    {
      id: 'carniceria-el-buen-corte',
      name: 'Carnicería El Buen Corte',
      category: 'Carnicería',
      image: 'https://images.pexels.com/photos/128401/pexels-photo-128401.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      location: 'Calle Sta Nicerata 120',
      description: 'Carnes frescas y embutidos',
      contactUrl: 'https://www.carniceriabuenacorte.com',
    },
    {
      id: 'panaderia-el-molino',
      name: 'Panadería El Molino',
      category: 'Panaderías',
      image: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      location: 'Calle Santa Teodosia 580',
      description: 'Pan fresco horneado diariamente',
      contactUrl: 'https://www.panaderiasanmiguel.com',
    },
    {
      id: 'd-landa-alfajores',
      name: 'D Landa Alfajores',
      category: 'Pastelería',
      image: 'https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      location: 'Calle Santa Teodosia 580',
      description: 'Pasteles artesanales para toda ocasión',
      contactUrl: 'https://www.pasteleriadulcehogar.com',
    },
    {
      id: 'lavanderia-antares',
      name: 'Lavandería Antares',
      category: 'Lavanderías',
      image: 'https://cdn.pixabay.com/photo/2017/09/14/19/34/laundry-2750158_1280.jpg',
      rating: 4.5,
      location: 'Sta. Teodosia 593',
      description: 'Lavado y planchado profesional',
      contactUrl: 'https://www.lavanderiasantares.com',
    },
    {
      id: 'lavanderia-floiki',
      name: 'Lavandería Floiki',
      category: 'Lavanderías',
      image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      location: 'Sta. Teodosia 593',
      description: 'Servicio de lavado y secado en 1 hora',
      contactUrl: 'https://www.lavanderiayfloyki.com',
    },
    {
      id: 'clock-box',
      name: 'CLOCK BOX',
      category: 'Delivery',
      image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.3,
      location: 'Julio Rodavero 971',
      description: 'Envíos rápidos a toda la ciudad',
      contactUrl: 'https://www.deliveryrapido.com',
    },
    {
      id: 'agente-bcp',
      name: 'Agente BCP',
      category: 'Agentes bancarios',
      image: 'https://images.pexels.com/photos/7706434/pexels-photo-7706434.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.4,
      location: 'Calle Sta Nicerata 334',
      description: 'Entregas en menos de 30 minutos',
      contactUrl: 'https://www.mensajeriaveloz.com',
    },
    {
      id: 'trino-tech-solution',
      name: 'Trino Tech Solution',
      category: 'Servicios',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      location: 'Av. Universitaria 1581',
      description: 'Reparación de celulares y computadoras',
      contactUrl: 'https://www.reparaciones.tech',
    },
    {
      id: 'peluqueria-estilo',
      name: 'Peluquería Estilo',
      category: 'Servicios',
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      location: 'Sta. Paula 567',
      description: 'Cortes y peinados modernos',
      contactUrl: 'https://www.peluqueriaestilo.com',
    },
    {
      id: 'salsa-bachatera',
      name: 'Salsa Bachatera',
      category: 'Servicios',
      image: 'https://images.pexels.com/photos/8957662/pexels-photo-8957662.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      location: 'Parque Santa Teodosia',
      description: 'Clases de bailes Salsa y bachata',
      contactUrl: 'https://www.salsabachatera.com',
    }
  ];

  const service = allServices.find(s => s.id === id);

  if (!service) return notFound();

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{service.name}</h1>
      <img src={service.image} alt={service.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <div className="mb-2 text-sm text-gray-600">Categoría: {service.category}</div>
      <div className="mb-2 text-sm text-gray-600">Ubicación: {service.location}</div>
      <div className="mb-2 text-yellow-500 font-bold">Calificación: {service.rating} ⭐</div>
      <p className="mb-4 text-gray-800">{service.description}</p>
      <a href={service.contactUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition">Contactar</a>
    </section>
  );
}
