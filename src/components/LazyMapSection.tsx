import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Lazy load MapSection only when visible
const MapSection = dynamic(() => import("./MapSection"), { ssr: false });

export default function LazyMapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
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

  }, []);

  return (
    <div ref={ref} style={{ minHeight: 320 }}>
      {show ? <MapSection /> : null}
    </div>
  );
}
