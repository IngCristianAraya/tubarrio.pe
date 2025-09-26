"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

type Magazine = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  url: string;
};

// Datos de ejemplo para la sección de revistas
const magazines: Magazine[] = [
  {
    id: '1',
    title: 'Edición de Verano 2023',
    description: 'Descubre las últimas tendencias y noticias en nuestra edición de verano.',
    image: '/images/magazine-summer-2023.jpg',
    date: 'Junio 2023',
    url: '/revistas/verano-2023'
  },
  {
    id: '2',
    title: 'Edición de Primavera 2023',
    description: 'Explora las novedades de la temporada en nuestra edición de primavera.',
    image: '/images/magazine-spring-2023.jpg',
    date: 'Marzo 2023',
    url: '/revistas/primavera-2023'
  },
  {
    id: '3',
    title: 'Edición Especial Aniversario',
    description: 'Celebra con nosotros nuestro aniversario con contenido exclusivo.',
    image: '/images/magazine-anniversary.jpg',
    date: 'Diciembre 2022',
    url: '/revistas/aniversario-2022'
  }
];

export default function MagazineSection() {
  const router = useRouter();

  const handleReadMore = (url: string) => {
    router.push(url);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nuestras Revistas</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras últimas ediciones y mantente actualizado con el mejor contenido.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magazines.map((magazine) => (
            <Card key={magazine.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={magazine.image} 
                  alt={magazine.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{magazine.title}</CardTitle>
                <p className="text-sm text-gray-500">{magazine.date}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700">{magazine.description}</p>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/90"
                  onClick={() => handleReadMore(magazine.url)}
                >
                  Leer más <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
            onClick={() => router.push('/revistas')}
          >
            Ver todas las revistas
          </Button>
        </div>
      </div>
    </section>
  );
}
