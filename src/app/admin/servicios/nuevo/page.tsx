'use client';

import { useState } from 'react';
// Removed Firebase Client SDK imports - now using API endpoints
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateSlug, generateUniqueSlug } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ServiceForm {
  name: string;
  category: string;
  description: string;
  phone: string;
  whatsapp: string;
  address: string;
  reference: string;
  images: string[];
  active: boolean;
  rating: number;
  contactUrl: string;
  detailsUrl: string;
  horario: string;
  location: string;
  tags: string;
  plan: string;
}

const CATEGORIES = [
  'Restaurantes',
  'Abarrotes',
  'Panaderías',
  'Servicios',
  'Cafeteria',
  'Carnicería',
  'Salud',
  'Lavanderías',
  'Delivery',
  'Agentes bancarios',
  'Otros'
];

export default function NewServicePage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<ServiceForm>({
    name: '',
    category: '',
    description: '',
    phone: '',
    whatsapp: '',
    address: '',
    reference: '',
    images: [],
    active: true,
    rating: 0,
    contactUrl: '',
    detailsUrl: '',
    horario: '',
    location: '',
    tags: '',
    plan: 'básico'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    console.log('Archivos seleccionados:', files.length);

    // Validar que no se excedan 5 imágenes en total
    if (formData.images.length + files.length > 5) {
      setError('Máximo 5 imágenes permitidas');
      return;
    }

    setError(null);
    setLoading(true);
    const successfulUploads: string[] = [];
    const failedUploads: string[] = [];

    // Subir imágenes una por una para mejor control de errores
    for (const file of Array.from(files)) {
      try {
        console.log(`Procesando archivo: ${file.name}, tipo: ${file.type}, tamaño: ${file.size}`);
        
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          failedUploads.push(`${file.name}: Tipo de archivo no válido`);
          continue;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          failedUploads.push(`${file.name}: Archivo muy grande (máx. 5MB)`);
          continue;
        }

        // Crear FormData para enviar la imagen
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        console.log('Enviando imagen al servidor...');
        
        // Subir imagen al endpoint
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadFormData
        });

        console.log('Respuesta del servidor:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
          failedUploads.push(`${file.name}: ${errorData.error || 'Error al subir'}`);
          continue;
        }

        const result = await response.json();
        console.log('Resultado:', result);
        
        if (result.success && result.imageUrl) {
          successfulUploads.push(result.imageUrl);
          console.log('Imagen subida exitosamente:', result.imageUrl);
        } else {
          failedUploads.push(`${file.name}: Respuesta inválida del servidor`);
        }
      } catch (err) {
        console.error(`Error subiendo ${file.name}:`, err);
        failedUploads.push(`${file.name}: Error de conexión`);
      }
    }

    console.log('Imágenes exitosas:', successfulUploads);
    console.log('Imágenes fallidas:', failedUploads);

    // Actualizar formulario con las imágenes exitosas
    if (successfulUploads.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...successfulUploads] 
      }));
      setImagePreviews(prev => {
        const newPreviews = [...prev, ...successfulUploads];
        console.log('Nuevas vistas previas:', newPreviews);
        return newPreviews;
      });
    }

    // Mostrar errores si los hay
    if (failedUploads.length > 0) {
      setError(`Errores en la subida:\n${failedUploads.join('\n')}`);
    }

    setLoading(false);
    
    // Limpiar el input
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre del servicio es requerido');
      return;
    }
    
    if (!formData.category) {
      setError('La categoría es requerida');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generar slug único basado en el nombre
      const baseSlug = generateSlug(formData.name);
      
      // Obtener todos los servicios existentes para verificar slugs únicos
      const servicesResponse = await fetch('/api/services');
      if (!servicesResponse.ok) {
        throw new Error('Error al obtener servicios existentes');
      }
      const existingServices = await servicesResponse.json();
      const existingSlugs = existingServices.map((service: any) => service.id);
      
      // Generar slug único
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
      
      // Preparar datos del servicio
      const serviceData = {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim(),
        address: formData.address.trim(),
        reference: formData.reference.trim(),
        contactUrl: formData.contactUrl.trim(),
        detailsUrl: formData.detailsUrl.trim(),
        horario: formData.horario.trim(),
        location: formData.location.trim(),
        tags: formData.tags.trim().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        rating: Number(formData.rating),
        plan: formData.plan,
        images: formData.images,
        image: formData.images.length > 0 ? formData.images[0] : '', // Primera imagen como imagen principal
        active: formData.active,
        id: uniqueSlug
      };

      // Crear servicio usando la API
      const createResponse = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });
      
      if (!createResponse.ok) {
        throw new Error('Error al crear el servicio');
      }
      
      console.log('Servicio creado con ID:', uniqueSlug);
      
      // Redirigir a la lista de servicios
      router.push('/admin/servicios');
      
    } catch (err) {
      console.error('Error creando servicio:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticación
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Verificando permisos...</span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Acceso Denegado</h3>
          <p className="text-red-600 text-sm mt-1">No tienes permisos para crear servicios. Debes ser administrador.</p>
          <div className="mt-4">
            <Link
              href="/admin/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Iniciar Sesión como Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Link
            href="/admin/servicios"
            className="text-gray-600 hover:text-gray-900"
          >
            ← Volver
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Servicio</h1>
        <p className="text-gray-600 mt-1">Completa la información del servicio</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Información Básica */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Servicio *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Restaurante El Buen Sabor"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe el servicio, especialidades, horarios, etc."
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: +51 999 888 777"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: +51 999 888 777"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Principal
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Santa Paula 470"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Cerca de parroquia El Buen Remedio"
              />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Imágenes del Servicio</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subir Imágenes (máximo 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.images.length >= 5 || loading}
              />
              {loading && (
                <div className="mt-2 text-sm text-blue-600 flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Subiendo imágenes...
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Formatos soportados: JPG, PNG, GIF. Máximo 5MB por imagen. {formData.images.length}/5 imágenes subidas.
              </p>
            </div>
            
            {imagePreviews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa de imágenes:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Vista previa ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          Principal
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información Adicional */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 4.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="básico">Básico</option>
                <option value="premium">Premium</option>
                <option value="destacado">Destacado</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Contacto
              </label>
              <input
                type="url"
                name="contactUrl"
                value={formData.contactUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com/contacto"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Detalles/Landing
              </label>
              <input
                type="url"
                name="detailsUrl"
                value={formData.detailsUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horario de Atención
              </label>
              <input
                type="text"
                name="horario"
                value={formData.horario}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lunes a Viernes: 9:00 - 18:00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación/Referencia
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cerca del mercado central"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="delivery, comida rápida, hamburguesas, papas"
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Estado</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Servicio activo (visible en el sitio público)
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Link
            href="/admin/servicios"
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-center hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Servicio'}
          </button>
        </div>
      </form>
    </div>
  );
}