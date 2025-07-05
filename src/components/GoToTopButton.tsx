"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const GoToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return visible ? (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg p-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="Ir arriba"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  ) : null;
};

export default GoToTopButton;
