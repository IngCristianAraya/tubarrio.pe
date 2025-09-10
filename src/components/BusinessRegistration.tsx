'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { CheckCircle, Loader2, XCircle, Users, TrendingUp, Star } from 'lucide-react';
import useSound from '../hooks/useSound';

interface FormData {
  businessName: string;
  category: string;
  phone: string;
  email: string;
  description: string;
}

interface FormStatus {
  submitting: boolean;
  success: boolean;
  error: boolean;
  message: string;
}

interface BusinessRegistrationProps {
  className?: string;
  showTitle?: boolean;
  onSuccess?: () => void;
}

const BusinessRegistration: React.FC<BusinessRegistrationProps> = ({
  className = '',
  showTitle = true,
  onSuccess
}) => {
  const { play: playClickSound } = useSound('click', { volume: 0.5 });
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    category: '',
    phone: '',
    email: '',
    description: ''
  });
  
  const [status, setStatus] = useState<FormStatus>({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setFormData({
        businessName: '',
        category: '',
        phone: '',
        email: '',
        description: ''
      });
      setStatus({
        submitting: false,
        success: false,
        error: false,
        message: ''
      });
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    // Form validation
    if (!formData.businessName || !formData.category || !formData.phone) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor completa todos los campos requeridos.'
      });
      return;
    }
    
    // Phone number validation (only numbers, 9-15 digits)
    const phoneRegex = /^[0-9]{9,15}$/;
    const cleanPhone = formData.phone.replace(/\D/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor ingresa un número de teléfono válido (mínimo 9 dígitos).'
      });
      return;
    }
    
    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor ingresa un correo electrónico válido.'
      });
      return;
    }
    
    setStatus(prev => ({ ...prev, submitting: true, error: false }));
    
    try {
      const response = await fetch('/api/business-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.businessName.trim(),
          category: formData.category.trim(),
          phone: cleanPhone,
          email: formData.email ? formData.email.trim().toLowerCase() : '',
          description: formData.description ? formData.description.trim() : '',
          source: 'business-registration-page'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la respuesta del servidor');
      }
      
      if (data.success) {
        setStatus({
          submitting: false,
          success: true,
          error: false,
          message: '¡Gracias por registrarte! Nos pondremos en contacto contigo a la brevedad.'
        });
        
        // Reset form
        setFormData({
          businessName: '',
          category: '',
          phone: '',
          email: '',
          description: ''
        });
        
        // Call success callback if provided
        if (onSuccess) onSuccess();
        
      } else {
        throw new Error(data.message || 'Error al procesar el registro');
      }
      
    } catch (error: any) {
      console.error('Error al enviar el formulario:', error);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: error.message || 'Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.'
      });
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setStatus(prev => ({
          ...prev,
          error: false,
          message: ''
        }));
      }, 5000);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Más Clientes',
      description: 'Llega a miles de personas en tu zona'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Aumenta Ventas',
      description: 'Incrementa tus ingresos hasta un 40%'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Construye Reputación',
      description: 'Recibe reseñas y construye confianza'
    }
  ];

  const categories = [
    'Restaurante',
    'Abarrotes',
    'Lavandería',
    'Panadería',
    'Delivery',
    'Servicios',
    'Belleza',
    'Tecnología',
    'Otro'
  ];

  // Show success message if form was submitted successfully
  if (status.success) {
    return (
      <div className="text-center p-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">¡Registro exitoso!</h3>
        <p className="text-gray-600 mb-6">
          Hemos recibido tu información. Nos pondremos en contacto contigo a la brevedad.
        </p>
        <button
          onClick={() => {
            setStatus(prev => ({ ...prev, success: false }));
            setFormData({
              businessName: '',
              category: '',
              phone: '',
              email: '',
              description: ''
            });
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Registrar otro negocio
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          {showTitle && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
                Registra tu negocio
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Llega a más clientes en tu zona con TuBarrio.pe
              </p>
            </>
          )}
          
          {status.error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error al enviar el formulario</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{status.message || 'Por favor, inténtalo de nuevo más tarde.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Business Name */}
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Nombre del negocio <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Ej: Panadería El Molino"
                    disabled={status.submitting}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    disabled={status.submitting}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="alimentos">Alimentos y Bebidas</option>
                    <option value="servicios">Servicios</option>
                    <option value="comercio">Comercio</option>
                    <option value="salud">Salud y Belleza</option>
                    <option value="educacion">Educación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono / WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="+51 906 684 284"
                    disabled={status.submitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="tu@email.com"
                    disabled={status.submitting}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Cuéntanos sobre tu negocio..."
                    disabled={status.submitting}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status.submitting}
                className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  status.submitting 
                    ? 'bg-gray-500 cursor-not-allowed' 
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }`}
              >
                {status.submitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Procesando...
                  </>
                ) : (
                  'Registrar mi negocio'
                )}
              </button>
              
              <p className="mt-3 text-xs text-center text-gray-500">
                * Sin compromisos a largo plazo
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration;
