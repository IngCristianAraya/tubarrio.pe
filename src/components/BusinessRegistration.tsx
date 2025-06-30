'use client';

import { useState } from 'react';
import { Plus, Star, Users, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import useSound from '../hooks/useSound';

const BusinessRegistration = () => {
  const { play: playClickSound } = useSound('click', { volume: 0.5 });
  
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    phone: '',
    email: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(); // Reproducir sonido al enviar el formulario
    
    // Validar formulario
    if (!formData.businessName || !formData.category || !formData.phone) {
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Por favor completa todos los campos requeridos.'
      });
      return;
    }
    
    setStatus({
      submitting: true,
      success: false,
      error: false,
      message: 'Enviando información...'
    });
    
    try {
      // URL del script de Google Apps Script desplegado como web app
      // NOTA: Reemplazar con la URL real del script desplegado
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwy-zxjRZ-jwCb-EIT8ujXXKC6ALDbdQVFTJZuvQFoA3iM8pwI72Kr6sWqvQU_pHeXQ/exec';
      // Crear objeto con los datos para enviar como URL params (más compatible con Apps Script)
      const params = new URLSearchParams();
      params.append('businessName', formData.businessName);
      params.append('category', formData.category);
      params.append('phone', formData.phone);
      params.append('email', formData.email || 'No proporcionado');
      params.append('timestamp', new Date().toISOString());
      
      // Construir URL con parámetros
      const urlWithParams = `${scriptURL}?${params.toString()}`;
      
      console.log('Enviando datos a:', urlWithParams);
      
      // Enviar datos a Google Sheets usando GET (más compatible con Apps Script)
      const response = await fetch(urlWithParams, {
        method: 'GET',
        mode: 'no-cors', // Importante para evitar errores CORS
        cache: 'no-cache'
      });
      
      // Limpiar formulario y mostrar mensaje de éxito
      setFormData({
        businessName: '',
        category: '',
        phone: '',
        email: ''
      });
      
      setStatus({
        submitting: false,
        success: true,
        error: false,
        message: '¡Gracias! Tu negocio ha sido registrado exitosamente.'
      });
      
      // Resetear mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false, message: '' }));
      }, 5000);
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Hubo un error al registrar tu negocio. Por favor intenta nuevamente.'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  return (
    <section id="registro" className="py-8 md:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-400 text-white mb-4 md:mb-6">
            <Plus className="w-7 h-7 md:w-8 md:h-8" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900">
            Registra tu <span className="text-orange-500">Negocio</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Forma parte de nuestra comunidad y llega a miles de clientes potenciales en tu zona.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Columna izquierda: Beneficios */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 order-2 md:order-1">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">¿Por qué registrar tu negocio?</h3>
            
            <div className="space-y-4 md:space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{benefit.title}</h4>
                    <p className="text-sm md:text-base text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Estadísticas */}
            <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4 md:gap-6">
              <div className="bg-orange-50 rounded-xl p-4 md:p-6 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1 md:mb-2">500+</div>
                <div className="text-sm md:text-base text-gray-600">Negocios registrados</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 md:p-6 shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1 md:mb-2">15k+</div>
                <div className="text-sm md:text-base text-gray-600">Clientes mensuales</div>
              </div>
            </div>
          </div>
          
          {/* Columna derecha: Formulario */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 order-1 md:order-2">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">Registra tu negocio</h3>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
                <div className="text-gray-600">Negocios registrados</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="text-3xl font-bold text-blue-500 mb-2">10K+</div>
                <div className="text-gray-600">Usuarios activos</div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">Registra tu negocio</h3>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: Hamburguesas El Rey"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Categoría *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Teléfono WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+51 906 684 284"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className={`w-full bg-gradient-to-r ${status.submitting ? 'from-gray-400 to-gray-500 cursor-not-allowed' : 'from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500'} text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl transition-all duration-200 transform ${!status.submitting && 'hover:scale-105'} shadow-lg mt-2`}
                onClick={() => !status.submitting && playClickSound()} // Reproducir sonido al hacer clic
              >
                {status.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 inline-block mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 inline-block mr-2" />
                    Registrar mi Negocio
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-gray-500 text-center mt-4">
              * Sin compromisos a largo plazo
            </p>
            
            {/* Mensajes de estado */}
            {status.success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg text-center">
                {status.message}
              </div>
            )}
            
            {status.error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-center">
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessRegistration;
