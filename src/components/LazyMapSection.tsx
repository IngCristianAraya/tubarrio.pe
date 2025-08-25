import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Lazy load MapSection only when visible with no SSR
const MapSection = dynamic(
  () => import("./MapSection").then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse">Cargando mapa...</div>
      </div>
    )
  }
);

export default function LazyMapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    
    // Mostrar inmediatamente para debugging
    setShow(true);
    
    // Comentado temporalmente para debugging
    /*
    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShow(true);
            observer && observer.disconnect();
          }
        },
        { rootMargin: "100px" }
      );
      observer.observe(ref.current);
    } else {
      // Fallback: mostrar siempre si no hay soporte
      setShow(true);
    }
    return () => {
      if (observer) observer.disconnect();
    };
    */
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse">Cargando mapa...</div>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ minHeight: 320 }}>
      {show ? <MapSection /> : (
        <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse">Esperando intersección...</div>
        </div>
      )}
    </div>
  );
}
