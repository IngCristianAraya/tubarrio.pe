/**
 * Componente ServiceCollapsibleDetails
 * 
 * Sección con información detallada del servicio en formato colapsable
 * Similar al diseño de Cuponidad con secciones de Especificaciones y Condiciones
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Info
} from 'lucide-react';
import { Service } from '@/types/service';

interface ServiceCollapsibleDetailsProps {
  service: Service;
}

const ServiceCollapsibleDetails: React.FC<ServiceCollapsibleDetailsProps> = ({ service }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Usar datos dinámicos del servicio o valores por defecto
  const specifications = service.specifications || [
    'Servicio profesional garantizado',
    'Atención personalizada',
    'Materiales de calidad',
    'Experiencia comprobada'
  ];

  const conditions = service.conditions || [
    'Servicio disponible en horario comercial',
    'Se requiere cita previa',
    'Aplican términos y condiciones',
    'Precios sujetos a cambios sin previo aviso'
  ];

  const sections = [
    {
      id: 'specifications',
      title: 'Especificaciones del Servicio',
      icon: FileText,
      content: specifications
    },
    {
      id: 'conditions',
      title: 'Condiciones del Servicio',
      icon: AlertCircle,
      content: conditions
    }
  ];

  return (
    <div className="py-8 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;

            return (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{section.title}</span>
                  </div>
                  {isActive ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-white border-t border-gray-100">
                        {section.id === 'specifications' ? (
                          <div className="space-y-3">
                            {(section.content as string[]).map((spec, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <p className="text-sm text-gray-600">{spec}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {(section.content as string[]).map((condition, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  <Info className="w-4 h-4 text-blue-600" />
                                </div>
                                <p className="text-sm text-gray-600">{condition}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceCollapsibleDetails;