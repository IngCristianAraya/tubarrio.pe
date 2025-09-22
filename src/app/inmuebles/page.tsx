// src/app/inmuebles/page.tsx
export const metadata = {
  title: 'Inmuebles en tu barrio | Tubarrio.pe',
  description: 'Alquileres y ventas de departamentos, casas y locales comerciales en tu zona.',
};

export default function InmueblesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🏠 Inmuebles en tu barrio</h1>
        <p className="text-lg text-gray-600 mb-8">
          Descubre departamentos, casas y locales comerciales en alquiler o venta cerca de ti.
        </p>
        
        {/* Aquí colocarás tu grid o carrusel de inmuebles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mockup de inmuebles */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">Departamento {i}</h3>
                <p className="text-gray-600">S/ 2,500 mensuales</p>
                <p className="text-sm text-gray-500">San Isidro, Lima</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}