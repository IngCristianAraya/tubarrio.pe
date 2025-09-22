// src/app/blog/page.tsx
export const metadata = {
    title: 'Blog de TuBarrio.pe | Noticias y tips de tu barrio',
    description: 'Entérate de las últimas noticias, eventos y consejos para tu comunidad local.',
  };
  
  export default function BlogPage() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📰 Blog de TuBarrio.pe</h1>
          <p className="text-lg text-gray-600 mb-8">
            Noticias, eventos y consejos útiles para tu barrio.
          </p>
          
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <article key={i} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Título de la noticia {i}</h2>
                  <p className="text-gray-600 mb-4">Publicado el 20 de setiembre de 2025</p>
                  <p className="text-gray-700 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                    Leer más →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }