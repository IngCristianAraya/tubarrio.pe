import Link from 'next/link';
import { Megaphone } from 'lucide-react';

export default function BusinessBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-orange-400 to-yellow-300 py-8 px-4 flex flex-col items-center justify-center text-center rounded-t-3xl shadow-2xl mt-16 overflow-hidden min-h-[220px]">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center gap-3 mb-3">
          <Megaphone className="w-8 h-8 text-white drop-shadow-md" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.60)] outline outline-2 outline-white/60">¿Tienes un negocio?</h2>
        </div>
        <p className="text-white text-lg mb-6 max-w-xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.60)] outline outline-1 outline-white/40">Regístralo gratis en nuestra plataforma y llega a miles de personas en tu zona. ¡Haz crecer tu emprendimiento con Revista Pando!</p>
        <Link href="/#registro">
          <button className="bg-white/90 text-orange-500 font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-orange-50 transition-all text-lg backdrop-blur-sm">
            Registrar mi negocio
          </button>
        </Link>
      </div>
    </section>
  );
}
