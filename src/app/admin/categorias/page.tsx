'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Category {
  id: string;
  name: string;
  description?: string;
  serviceCount: number;
  active: boolean;
  createdAt?: any;
}

const DEFAULT_CATEGORIES = [
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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      
      // Cargar servicios para contar por categoría
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Contar servicios por categoría
      const categoryCounts: { [key: string]: number } = {};
      services.forEach((service: any) => {
        const category = service.category || 'Sin categoría';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      // Crear lista de categorías con conteos
      const categoryList: Category[] = DEFAULT_CATEGORIES.map(categoryName => ({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        description: `Servicios de ${categoryName.toLowerCase()}`,
        serviceCount: categoryCounts[categoryName] || 0,
        active: true
      }));

      // Agregar categorías que no están en la lista por defecto
      Object.keys(categoryCounts).forEach(categoryName => {
        if (!DEFAULT_CATEGORIES.includes(categoryName) && categoryName !== 'Sin categoría') {
          categoryList.push({
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            description: `Servicios de ${categoryName.toLowerCase()}`,
            serviceCount: categoryCounts[categoryName],
            active: true
          });
        }
      });

      setCategories(categoryList);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;

    try {
      // En este caso, solo agregamos a la lista local ya que las categorías
      // se manejan como valores fijos en los servicios
      const newCat: Category = {
        id: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        name: newCategory.name,
        description: newCategory.description || `Servicios de ${newCategory.name.toLowerCase()}`,
        serviceCount: 0,
        active: true
      };

      setCategories([...categories, newCat]);
      setNewCategory({ name: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Error al agregar la categoría');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Error al actualizar la categoría');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-1">{categories.length} categorías disponibles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ Agregar Categoría
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Categoría</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Tecnología"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción de la categoría"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Agregar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategory({ name: '', description: '' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar Categoría</h2>
          <form onSubmit={handleUpdateCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Categorías</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📂</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">ID: {category.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.serviceCount} servicios
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => loadCategories()}
                      className="text-green-600 hover:text-green-900"
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Categorías</p>
              <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías Activas</p>
              <p className="text-2xl font-bold text-green-600">
                {categories.filter(cat => cat.active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🏪</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-bold text-purple-600">
                {categories.reduce((total, cat) => total + cat.serviceCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}