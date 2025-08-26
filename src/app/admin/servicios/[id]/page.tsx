'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp, setDoc, getDocs, collection, query, deleteDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateSlug, generateUniqueSlug } from '@/lib/utils';

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

interface EditServicePageProps {
  params: {
    id: string;
  };
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [originalName, setOriginalName] = useState<string>('');
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

  useEffect(() => {
    loadService();
  }, [params.id]);

  const loadService = async () => {
    try {
      setLoadingData(true);
      setError(null);

      if (!db) {
        throw new Error('Firebase no está configurado');
      }

      const serviceRef = doc(db, 'services', params.id);
      const serviceSnap = await getDoc(serviceRef);

      if (!serviceSnap.exists()) {
        throw new Error('Servicio no encontrado');
      }

      const serviceData = serviceSnap.data();
      
      // Guardar el nombre original para detectar cambios
      setOriginalName(serviceData.name || '');
      
      // Cargar imágenes existentes
      const existingImages = serviceData.images || (serviceData.image ? [serviceData.image] : []);
      
      setFormData({
        name: serviceData.name || '',
        category: serviceData.category || '',
        description: serviceData.description || '',
        phone: serviceData.phone || '',
        whatsapp: serviceData.whatsapp || '',
        address: serviceData.address || '',
        reference: serviceData.reference || '',
        images: existingImages,
        active: serviceData.active !== false,
        rating: serviceData.rating || 0,
        contactUrl: serviceData.contactUrl || '',
        detailsUrl: serviceData.detailsUrl || '',
        horario: serviceData.horario || '',
        location: serviceData.location || '',
        tags: Array.isArray(serviceData.tags) ? serviceData.tags.join(', ') : (serviceData.tags || ''),
        plan: serviceData.plan || 'básico'
      });

      setImagePreviews(existingImages);

    } catch (err) {
      console.error('Error cargando servicio:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingData(false);
    }
  };

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

    // Validar que no se excedan 5 imágenes en total
    if (formData.images.length + files.length > 5) {
      setError('Máximo 5 imágenes permitidas');
      return;
    }

    const uploadPromises = Array.from(files).map(async (file) => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name}: Por favor selecciona un archivo de imagen válido`);
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${file.name}: La imagen debe ser menor a 5MB`);
      }

      // Crear FormData para enviar la imagen
      const formData = new FormData();
      formData.append('image', file);

      // Subir imagen al endpoint local
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`${file.name}: Error al subir la imagen`);
      }

      const result = await response.json();
      return result.imageUrl;
    });

    try {
      setError(null);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Actualizar formulario con las nuevas URLs
      const newImages = [...formData.images, ...uploadedUrls];
      setFormData(prev => ({ 
        ...prev, 
        images: newImages
      }));
      setImagePreviews(newImages);
      
      // Limpiar el input
      e.target.value = '';
      
    } catch (err) {
      console.error('Error subiendo imágenes:', err);
      setError(err instanceof Error ? err.message : 'Error al subir las imágenes. Intenta nuevamente.');
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = formData.images.filter((_, index) => index !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    setImagePreviews(newImages);
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

      if (!db) {
        throw new Error('Firebase no está configurado');
      }

      // Preparar datos del servicio
      const serviceData: any = {
        name: formData.name.trim(),
        category: formData.category || '',
        description: formData.description.trim(),
        phone: formData.phone.trim() || '',
        whatsapp: formData.whatsapp.trim() || '',
        address: formData.address.trim() || '',
        reference: formData.reference.trim() || '',
        contactUrl: formData.contactUrl.trim() || '',
        detailsUrl: formData.detailsUrl.trim() || '',
        horario: formData.horario.trim() || '',
        location: formData.location.trim() || '',
        tags: formData.tags.trim().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        rating: Number(formData.rating) || 0,
        plan: formData.plan || 'básico',
        images: formData.images || [],
        image: formData.images && formData.images.length > 0 ? formData.images[0] : '',
        active: Boolean(formData.active),
        updatedAt: serverTimestamp()
      };

      // Filtrar campos undefined, null y valores inválidos para evitar errores en Firestore
      Object.keys(serviceData).forEach(key => {
        const value = serviceData[key];
        if (value === undefined || value === null) {
          delete serviceData[key];
        } else if (Array.isArray(value)) {
          // Filtrar elementos undefined/null de arrays
          serviceData[key] = value.filter(item => item !== undefined && item !== null);
        }
      });

      // Verificar si el nombre ha cambiado
      const nameChanged = formData.name.trim() !== originalName;
      
      if (nameChanged) {
        // Generar nuevo slug basado en el nuevo nombre
        const baseSlug = generateSlug(formData.name.trim());
        
        // Obtener todos los servicios existentes para verificar unicidad
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const existingIds = servicesSnapshot.docs.map(doc => doc.id).filter(id => id !== params.id);
        
        // Generar slug único
        const newSlug = generateUniqueSlug(baseSlug, existingIds);
        
        // Crear nuevo documento con el nuevo slug
        const newServiceRef = doc(db, 'services', newSlug);
        await setDoc(newServiceRef, serviceData);
        
        // Eliminar el documento anterior
         const oldServiceRef = doc(db, 'services', params.id);
         await deleteDoc(oldServiceRef);
        
        console.log('Servicio movido de', params.id, 'a', newSlug);
        
        // Redirigir a la nueva URL
        router.push('/admin/servicios');
      } else {
        // Solo actualizar el documento existente
        const serviceRef = doc(db, 'services', params.id);
        await updateDoc(serviceRef, serviceData);
        
        console.log('Servicio actualizado:', params.id);
        
        // Redirigir a la lista de servicios
         router.push('/admin/servicios');
       }
      
    } catch (err) {
      console.error('Error actualizando servicio:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando servicio...</span>
      </div>
    );
  }

  if (error && loadingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error al cargar el servicio</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={loadService}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
            >
              Reintentar
            </button>
            <Link
              href="/admin/servicios"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-400"
            >
              Volver a Servicios
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Servicio</h1>
        <p className="text-gray-600 mt-1">Modifica la información del servicio</p>
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
            {imagePreviews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((imageUrl, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {imagePreviews.length > 0 ? 'Agregar más imágenes' : 'Subir imágenes'}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={formData.images.length >= 5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Formatos soportados: JPG, PNG, GIF. Máximo 5MB por imagen. Máximo 5 imágenes.
                {formData.images.length >= 5 && (
                  <span className="text-red-500 block">Límite de imágenes alcanzado.</span>
                )}
              </p>
            </div>
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
            {loading ? 'Guardando...' : 'Actualizar Servicio'}
          </button>
        </div>
      </form>
    </div>
  );
}