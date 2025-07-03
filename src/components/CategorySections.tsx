'use client';

import Link from 'next/link';
import { Utensils, ShoppingCart, Shirt, Cake, Truck, Home, Book, PawPrint, HeartPulse, User2 } from 'lucide-react';
import React, { useState } from "react";

const CATEGORIES = [
  {
    icon: <Utensils className="w-8 h-8 text-orange-500" />, // Alimentos y Gastronomía
    image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Alimentos y Gastronomía',
    subcategories: [
      'Restaurantes',
      'Comida Rápida',
      'Cafeterías',
      'Juguerías',
    ],
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-orange-500" />, // Abarrotes y Tiendas
    image: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Abarrotes y Tiendas',
    subcategories: [
      'Abarrotes',
      'Lácteos',
      'Fruterías',
      'Bodegas',
    ],
  },
  {
    icon: <Shirt className="w-8 h-8 text-orange-500" />, // Ventas y Productos
    image: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Ventas y Productos',
    subcategories: [
      'Catálogo (ropa, maquillaje)',
      'Ecommerce Local',
      'Tecnología',
      'Ferretería',
    ],
  },
  {
    icon: <Cake className="w-8 h-8 text-orange-500" />, // Belleza y Cuidado Personal
    image: 'https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Belleza y Cuidado Personal',
    subcategories: [
      'Peluquería',
      'Spa',
      'Maquillaje',
      'Cosméticos',
    ],
  },
  {
    icon: <Truck className="w-8 h-8 text-orange-500" />, // Servicios Técnicos y Profesionales
    image: 'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Servicios Técnicos y Profesionales',
    subcategories: [
      'Gasfitería',
      'Técnicos',
      'Reparaciones',
      'Fletes',
    ],
  },
  {
    icon: <Home className="w-8 h-8 text-orange-500" />, // Hogar y Decoración
    image: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Hogar y Decoración',
    subcategories: [
      'Hogar',
      'Decoración',
      'Muebles',
    ],
  },
  {
    icon: <Book className="w-8 h-8 text-orange-500" />, // Educación y Desarrollo
    image: 'https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Educación y Desarrollo',
    subcategories: [
      'Clases',
      'Psicología',
      'Talleres',
      'Copias',
    ],
  },
  {
    icon: <PawPrint className="w-8 h-8 text-orange-500" />, // Mascotas
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Mascotas',
    subcategories: [
      'Veterinaria',
      'Peluquería Canina',
      'Accesorios',
    ],
  },
  {
    icon: <HeartPulse className="w-8 h-8 text-orange-500" />, // Salud y Bienestar
    image: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Salud y Bienestar',
    subcategories: [
      'Medicina Natural',
      'Nutrición',
      'Farmacia',
    ],
  },
  {
    icon: <User2 className="w-8 h-8 text-orange-500" />, // Emprendimientos Personales
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=400&h=400&fit=crop',
    title: 'Emprendimientos Personales',
    subcategories: [
      'Consultores',
      'Negocio en Casa',
      'Emprendedoras',
    ],
  },
];

import Image from 'next/image';

interface CategoryCardProps {
  icon: React.ReactNode;
  image: string;
  title: string;
  subcategories: string[];
  idx: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, image, title, subcategories, idx }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="flip-card group w-full aspect-square min-w-[140px] max-w-xs mx-auto relative select-none mb-8 min-h-[210px]"
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      onClick={() => setIsFlipped((f) => !f)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsFlipped((f) => !f)}
    >
      <div className={`flip-card-inner w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Frente */}
        <div className="flip-card-front absolute w-full h-full bg-white rounded-2xl shadow-lg flex flex-col backface-hidden border-2 border-orange-100 cursor-pointer p-0">
          {/* Imagen cubre la mitad superior */}
          <div className="w-full h-[90%] rounded-t-2xl overflow-hidden flex-shrink-0 relative">
            <Image
              src={image}
              alt={title}
              fill
              style={{objectFit:'cover'}}
              className="w-full h-full object-cover"
              priority={idx < 4}
            />
            {/* Título sobre la imagen */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] bg-white/70 backdrop-blur-md rounded-xl px-2 py-1 shadow-md flex items-center justify-center">
              <h3 className="text-base sm:text-lg font-bold text-orange-500 text-center select-none line-clamp-2 w-full">
                {title}
              </h3>
            </div>
          </div>
          {/* Contenido inferior */}
          <div className="flex flex-col items-center justify-end h-[10%] w-full pb-1">
            <span className="text-xs text-gray-400 select-none">Haz clic para ver más</span>
          </div>
        </div>
        {/* Reverso */}
        <div className="flip-card-back absolute w-full h-full bg-orange-50 rounded-2xl shadow-lg flex flex-col items-center justify-start pt-8 pb-6 px-4 backface-hidden border-2 border-orange-400 rotate-y-180 cursor-pointer">
          <span className="text-4xl text-orange-500 mt-1 mb-2">{icon}</span>
          <ul className="w-full flex-1 flex flex-col gap-1 items-start justify-center text-gray-700 text-xs sm:text-sm">
            {subcategories.map((sub, i) => (
              <li key={i} className="w-full flex items-start gap-2 border-b border-orange-100 last:border-b-0 pb-0.5">
                <span className="mt-1 text-orange-400">•</span>
                <span>{sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .flip-card {
          perspective: 1200px;
          position: relative;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.4,0.2,0.2,1);
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

const CategorySections = () => {
  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-white border-b-4 border-orange-400/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center relative">
          <span className="inline-block text-3xl align-middle mr-2">🗂️</span>
          <h2 className="inline-block text-2xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm align-middle mb-1">
            <span className="text-orange-500">Categorías </span>
            <span className="text-black">principales</span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-32 md:w-48 rounded-full bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 opacity-90" />
        </div>
        <p className="text-center text-gray-600 mb-8 text-base md:text-lg max-w-2xl mx-auto">
          Explora los servicios y productos más populares de la zona
        </p>
        <div className="grid gap-10 px-1 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 mb-4">
          {CATEGORIES.map((cat, idx) => (
            <CategoryCard
              key={idx}
              icon={cat.icon}
              image={cat.image}
              title={cat.title}
              subcategories={cat.subcategories}
              idx={idx}
            />
          ))}
        </div>
        <div className="text-center mb-8">
          <Link href="/todos-los-servicios">
            <span className="inline-block bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-semibold py-4 px-10 rounded-2xl text-lg md:text-xl shadow-lg transition-all duration-200 transform hover:scale-105">
              Ver todos los servicios
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySections;
