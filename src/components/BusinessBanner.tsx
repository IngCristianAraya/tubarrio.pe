import Link from 'next/link';
import { Megaphone } from 'lucide-react';

export default function BusinessBanner() {
  return (
    <section className="w-full bg-[#fb8500] py-12 px-6 flex flex-col items-center justify-center text-center rounded-t-[2.5rem] shadow-3xl drop-shadow-xl mt-16 overflow-hidden min-h-[250px]">
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-white/60 rounded-full p-2 flex items-center justify-center animate-pulse shadow-md">
            <Megaphone className="w-9 h-9 text-[#fb8500] drop-shadow-lg" />
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white relative" style={{textShadow: '0 2px 6px #444, 0 0px 2px #888, 0 0 1px #888'}}>¿Tienes un negocio?</h2>
        </div>
        <p className="text-white text-xl sm:text-2xl mb-8 max-w-2xl font-medium" style={{textShadow: '0 2px 6px #444, 0 0px 2px #888, 0 0 1px #888'}}>Regístralo gratis en nuestra plataforma y llega a miles de personas en tu zona.<br />¡Haz crecer tu emprendimiento con <span className='font-bold text-orange-200'>TUBARRIO.PE</span>!</p>
        <Link href="/#registro">
          <button className="bg-white text-[#fb8500] font-extrabold tracking-wide px-10 py-4 rounded-2xl shadow-xl hover:bg-orange-50 border-2 border-orange-200 transition-all duration-200 text-xl flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-60 hover:-translate-y-0.5">
            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-[#fb8500]' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2M9 2h6a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2z' /></svg>
            Registrar mi negocio
          </button>
        </Link>
      </div>
    </section>
  );
}
