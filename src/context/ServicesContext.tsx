'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definición de tipos
export interface Service {
  id: string; // Cambiado de number a string para slugs amigables con URL
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  contactUrl?: string;
  detailsUrl?: string;
  horario?: string;
  tags?: string[]; // Nuevo: palabras clave para búsqueda avanzada
  hours?: string; // Horario de atención
  social?: string; // Enlace a red social
  whatsapp?: string; // Número de WhatsApp
}

interface ServicesContextType {
  services: Service[];
  filteredServices: Service[];
  searchServices: (query: string, category: string) => void;
  resetSearch: () => void;
  isSearching: boolean;
}

// Firebase
import { db } from '../firebaseConfig';
import { collection, getDocs, QueryDocumentSnapshot, query, orderBy } from 'firebase/firestore';

// Crear el contexto
const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

// Provider del contexto
export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar servicios desde Firestore solo una vez
  React.useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        console.log("Consultando servicios en Firestore...");
        const servicesQuery = query(collection(db, 'services'), orderBy('rating', 'desc'));
        const querySnapshot = await getDocs(servicesQuery);
        console.log("Resultado de Firestore:", querySnapshot.docs.length, querySnapshot.docs);
        const servicesData: Service[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(servicesData);
      } catch (error) {
        console.error('Error al cargar servicios desde Firestore:', error);
      } finally {
        setLoading(false);
      }
    }; // <-- ESTA LLAVE FALTABA AQUÍ
    fetchServices();
  }, []);

  const searchServices = (query: string, category: string) => {
    let results = [...services];
    if (category !== 'Todos los servicios') {
      results = results.filter(service => service.category === category);
    }
    if (query.trim() !== '') {
      const searchTerms = query.toLowerCase().trim().split(' ');
      results = results.filter(service => {
        const nameMatch = searchTerms.some(term => service.name.toLowerCase().includes(term));
        const descriptionMatch = searchTerms.some(term => service.description.toLowerCase().includes(term));
        const tagsMatch = service.tags
          ? searchTerms.some(term => service.tags!.some(tag => tag.toLowerCase().includes(term)))
          : false;
        return nameMatch || descriptionMatch || tagsMatch;
      });
    }
    setFilteredServices(results);
    setIsSearching(true);
  };

  const resetSearch = () => {
    setFilteredServices([]);
    setIsSearching(false);
  };

  return (
    <ServicesContext.Provider value={{
      services,
      filteredServices,
      searchServices,
      resetSearch,
      isSearching
    }}>
      {children}
      {loading && <div>Cargando servicios...</div>}
    </ServicesContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices debe ser usado dentro de un ServicesProvider');
  }
  return context;
};

