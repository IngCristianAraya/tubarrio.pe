"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const GoToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={handleClick}
      aria-label="Volver al inicio"
      title="Ir arriba"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-orange-500 to-orange-600 text-white rounded-full shadow-xl p-3 hover:scale-110 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-60 animate-fadeIn"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  ) : null;
};

export default GoToTopButton;
