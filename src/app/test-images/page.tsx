'use client';

import { useState } from 'react';
import Image from 'next/image';
import OptimizedImage from '@/components/OptimizedImage';

const TestImagesPage = () => {
  const [imageStatus, setImageStatus] = useState<Record<string, string>>({});

  const testImages = [
    {
      id: 'pexels-pizza',
      url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
      name: 'Pizza de Pexels'
    },
    {
      id: 'pexels-shawarma',
      url: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400',
      name: 'Shawarma de Pexels'
    },
    {
      id: 'local-hero',
      url: '/images/hero_001.webp',
      name: 'Imagen local hero'
    }
  ];

  const updateStatus = (id: string, status: string) => {
    setImageStatus(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test de Carga de Imágenes</h1>
      
      <div className="grid gap-8">
        {testImages.map((img) => (
          <div key={img.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{img.name}</h2>
            
            {/* Test con next/image */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Con next/image:</h3>
              <div className="relative w-96 h-48 border">
                <Image
                  src={img.url}
                  alt={img.name}
                  fill
                  className="object-cover"
                  onLoad={() => updateStatus(`${img.id}-next`, '✅ Cargada')}
                  onError={() => updateStatus(`${img.id}-next`, '❌ Error')}
                />
              </div>
              <p className="mt-2 text-sm">
                Estado: {imageStatus[`${img.id}-next`] || '⏳ Cargando...'}
              </p>
            </div>
            
            {/* Test con OptimizedImage */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Con OptimizedImage:</h3>
              <div className="w-96 h-48 border">
                <OptimizedImage
                  src={img.url}
                  alt={img.name}
                  width={384}
                  height={192}
                  className="w-full h-full"
                  onLoad={() => updateStatus(`${img.id}-optimized`, '✅ Cargada')}
                  fallbackSrc="/images/hero_001.webp"
                />
              </div>
              <p className="mt-2 text-sm">
                Estado: {imageStatus[`${img.id}-optimized`] || '⏳ Cargando...'}
              </p>
            </div>
            
            {/* Test con img HTML */}
            <div>
              <h3 className="text-lg font-medium mb-2">Con img HTML:</h3>
              <img
                src={img.url}
                alt={img.name}
                className="w-96 h-48 object-cover border"
                onLoad={() => updateStatus(`${img.id}-html`, '✅ Cargada')}
                onError={() => updateStatus(`${img.id}-html`, '❌ Error')}
              />
              <p className="mt-2 text-sm">
                Estado: {imageStatus[`${img.id}-html`] || '⏳ Cargando...'}
              </p>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <p className="text-sm font-mono">{img.url}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Información del navegador:</h3>
        <p className="text-sm">User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</p>
        <p className="text-sm">URL actual: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
      </div>
    </div>
  );
};

export default TestImagesPage;