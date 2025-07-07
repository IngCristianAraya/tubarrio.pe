'use client';

import { notFound, useParams } from 'next/navigation';
import { useServices } from '@/context/ServicesContext';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ServicioDetallePage() {
  // Obtener todos los servicios del contexto (esto solo funciona en Client Components)
  // Para Server Components, normalmente cargarías los datos desde una fuente persistente (DB/API).
  // Aquí, por simplicidad, se hace una búsqueda dummy. Puedes migrar a fetch real si lo necesitas.
  // Si usas datos estáticos, puedes importar el array aquí.

  // Ejemplo de importación directa (ajusta la ruta si es necesario):
  // import { allServices } from '@/context/ServicesContext';

  // Obtener el id dinámico de la URL
  const { id } = useParams() as { id: string };

  // Obtener servicios del contexto global
  const { services: allServices } = useServices();


  const service = allServices.find(s => s.id === id);

  if (!service) return notFound();

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center py-10 px-2">
      <div className="w-full max-w-2xl bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-2xl border border-orange-200 p-0 sm:p-1 md:p-2 relative overflow-hidden">
        <div className="bg-white/90 rounded-3xl shadow-lg p-6 sm:p-10 flex flex-col items-center text-center relative z-10">
          <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-4 border-orange-300 shadow-lg -mt-20 mb-6 bg-white">
            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-md">{service.name}</h1>
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200 shadow-sm">{service.category}</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-200 shadow-sm">{service.location}</span>
          </div>
          <div className="flex items-center justify-center mb-3">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-6 h-6 ${i < Math.round(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.176 0l-3.386 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>
            ))}
            <span className="ml-2 text-lg font-semibold text-yellow-700">{service.rating.toFixed(1)}</span>
          </div>
          <p className="mb-6 text-gray-700 text-base sm:text-lg leading-relaxed">{service.description}</p>

          {/* Inclusiones del negocio */}
          <div className="w-full bg-orange-100 rounded-xl p-4 mb-6 flex flex-col gap-2 shadow-inner border border-orange-200">
            <div className="flex items-center gap-2 text-orange-700 font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4l9 5-9 5-9-5 9-5z"/></svg>
              Ficha en la revista digital
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-800">
              <span className="flex items-center gap-1"><b>Nombre:</b> {service.name}</span>
              <span className="flex items-center gap-1"><b>Rubro:</b> {service.category}</span>
              
              {(service.horario || service.hours) && (
                <span className="flex items-center gap-1">
                    <span className="flex items-center gap-1"><b>Dirección:</b> {service.location}</span>
                
                 
                  {/* Si existen ambos, mostrar ambos */}
                  {service.horario && service.hours && service.horario !== service.hours && (
                    <span className="ml-2 text-xs text-gray-500">({service.hours})</span>
                  )}
                </span>
              )}
              <span className="flex items-center gap-1"><b>Contacto:</b> <a href={service.contactUrl} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">Ver contacto</a></span>
            </div>
            <div className="flex items-center gap-2 text-orange-700 font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              {service.horario || service.hours ? (
                <span>
                  <b>Horario:</b> {service.horario ? service.horario : service.hours}
                  {service.horario && service.hours && service.horario !== service.hours && (
                    <span className="ml-2 text-xs text-gray-500">({service.hours})</span>
                  )}
                </span>
              ) : null}
              {service.social && (
                <span className="ml-3">|
                  <a href={service.social} target="_blank" rel="noopener noreferrer" className="text-orange-600 underline ml-1">Red social</a>
                </span>
              )}
              {service.whatsapp && (
                <span className="ml-3">|
                  <a href={`https://wa.me/${service.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 underline ml-1">WhatsApp</a>
                </span>
              )}
            </div>
            
          </div>

          <a href={service.contactUrl} target="_blank" rel="noopener noreferrer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200">
            Contactar negocio
          </a>
        </div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-orange-400/70 to-orange-300/40 rounded-t-3xl blur-xl opacity-70 z-0" />
        <div className="absolute bottom-0 right-0 w-44 h-44 bg-yellow-300/30 rounded-full blur-2xl opacity-60 z-0" />
      </div>

      {/* Recomendados */}
      {/* SwiperJS Slider para recomendados */}
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-2xl font-bold text-orange-700 mb-6">Recomendados en {service.category}</h2>
        <div>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="!pb-10"
          >
            {allServices.filter(s => s.category === service.category && s.id !== service.id).map(recomendado => (
              <SwiperSlide key={recomendado.id}>
                <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center border border-orange-100">
                  <img src={recomendado.image} alt={recomendado.name} className="w-28 h-28 object-cover rounded-xl mb-3 border-2 border-orange-200" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{recomendado.name}</h3>
                  <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full mb-2">{recomendado.location}</span>
                  <a href={`/servicio/${recomendado.id}`} className="mt-2 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-lg text-sm font-bold shadow transition-all">Ver detalle</a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

