"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Lazy load MagazineSection only when visible
const MagazineSection = dynamic(() => import("./MagazineSection"), { ssr: false });

export default function LazyMagazineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new window.IntersectionObserver(
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
      // Fallback: always show if no support
      setShow(true);
    }
    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} style={{ minHeight: 480 }}>
      {show ? <MagazineSection /> : null}
    </div>
  );
}
