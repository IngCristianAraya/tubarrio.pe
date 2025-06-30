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
    <section id="registro" className="py-8 md:py-12 lg:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            <span className="text-orange-500">Registra tu negocio</span> en nuestra plataforma
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-1">
            Únete a nuestra comunidad de emprendedores y haz crecer tu negocio con nosotros. 
            Completa el formulario y nos pondremos en contacto contigo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 items-start">
          {/* Columna izquierda: Beneficios */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 order-2 md:order-1">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 md:mb-6 text-gray-800 text-center md:text-left">¿Por qué registrar tu negocio?</h3>
            
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Estadísticas */}
            <div className="mt-5 sm:mt-6 md:mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 mb-0.5 sm:mb-1 md:mb-2">500+</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600">Negocios registrados</div>
              </div>
              <div className="bg-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-500 mb-0.5 sm:mb-1 md:mb-2">15k+</div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600">Clientes mensuales</div>
              </div>
            </div>
          </div>
          
          {/* Columna derecha: Formulario */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 order-1 md:order-2">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-800 text-center md:text-left">Registra tu negocio</h3>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <label htmlFor="businessName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 md:mb-2">
                  Nombre del Negocio *
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 md:px-4 py-2.5 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Ej: Hamburguesas El Rey"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 md:mb-2">
                  Categoría *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 md:px-4 py-2.5 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 md:mb-2">
                  Teléfono WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 md:px-4 py-2.5 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                  placeholder="+51 906 684 284"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 md:mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 md:px-4 py-2.5 sm:py-2.5 md:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 placeholder-gray-500"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={status.submitting}
                className={`w-full bg-gradient-to-r ${status.submitting ? 'from-gray-400 to-gray-500 cursor-not-allowed' : 'from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500'} text-white font-bold py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform ${!status.submitting && 'hover:scale-102 sm:hover:scale-105'} shadow-md sm:shadow-lg mt-2 text-sm sm:text-base`}
                onClick={() => !status.submitting && playClickSound()}
              >
                {status.submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1.5 sm:mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 inline-block mr-1.5 sm:mr-2" />
                    Registrar mi Negocio
                  </>
                )}
              </button>
            </form>

            <p className="text-xs sm:text-sm text-gray-500 text-center mt-3 sm:mt-4">
              * Sin compromisos a largo plazo
            </p>
            
            {/* Mensajes de estado */}
            {status.success && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-green-100 border border-green-200 text-green-700 rounded-md sm:rounded-lg text-center text-xs sm:text-sm animate-fadeIn">
                {status.message}
              </div>
            )}
            
            {status.error && (
              <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-100 border border-red-200 text-red-700 rounded-md sm:rounded-lg text-center text-xs sm:text-sm animate-fadeIn">
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
