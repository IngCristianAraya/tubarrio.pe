'use client';

import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  // Referencias para acceso directo al DOM (evita re-renders innecesarios)
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorInteractiveRef = useRef<HTMLDivElement>(null);
  
  // Estados para controlar la visibilidad y comportamiento
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Referencias para el sistema de seguimiento fluido
  const mousePosition = useRef({ x: 0, y: 0 });
  const cursorPosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  
  // Configuración de la fluidez
  const cursorSpeed = 0.2; // Velocidad de seguimiento del cursor principal (0-1)
  const dotSpeed = 0.02;   // Velocidad de seguimiento del punto (0-1) - Reducido significativamente para mayor retraso
  
  useEffect(() => {
    // Verificar que estamos en el navegador
    if (typeof window === 'undefined') return;
    
    // Ocultar el cursor nativo
    document.body.style.cursor = 'none';
    
    // Función para manejar el movimiento del mouse
    const onMouseMove = (e: MouseEvent) => {
      // Actualizar la posición del mouse en tiempo real
      mousePosition.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };
    
    const onMouseLeave = () => {
      setIsVisible(false);
    };
    
    const onMouseEnter = () => {
      setIsVisible(true);
    };
    
    const onMouseDown = () => {
      setIsClicking(true);
    };
    
    const onMouseUp = () => {
      setIsClicking(false);
    };
    
    // Detectar cuando el cursor está sobre elementos interactivos
    const checkInteractiveElements = () => {
      const hoveredElement = document.elementFromPoint(mousePosition.current.x, mousePosition.current.y);
      const isInteractive = hoveredElement?.matches('a, button, input, select, textarea, [role="button"]');
      setIsHovering(!!isInteractive);
    };
    
    // Sistema de animación fluida usando requestAnimationFrame
    const animateCursor = () => {
      // Calcular la diferencia entre la posición del mouse y la posición actual del cursor
      const dx = mousePosition.current.x - cursorPosition.current.x;
      const dy = mousePosition.current.y - cursorPosition.current.y;
      
      // Aplicar interpolación suave para el cursor principal
      cursorPosition.current.x += dx * cursorSpeed;
      cursorPosition.current.y += dy * cursorSpeed;
      
      // Aplicar interpolación más lenta para el punto (efecto de seguimiento)
      const dotDx = mousePosition.current.x - dotPosition.current.x;
      const dotDy = mousePosition.current.y - dotPosition.current.y;
      dotPosition.current.x += dotDx * dotSpeed;
      dotPosition.current.y += dotDy * dotSpeed;
      
      // Actualizar posiciones en el DOM directamente (sin re-renders)
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px) translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`;
      }
      
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotPosition.current.x}px, ${dotPosition.current.y}px) translate(-50%, -50%) scale(${isClicking ? 1.2 : 1})`;
      }
      
      if (cursorInteractiveRef.current && isHovering) {
        cursorInteractiveRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px) translate(-50%, -50%)`;
        cursorInteractiveRef.current.style.opacity = '0.6';
      } else if (cursorInteractiveRef.current) {
        cursorInteractiveRef.current.style.opacity = '0';
      }
      
      // Continuar la animación
      requestAnimationFrame(animateCursor);
    };
    
    // Iniciar la animación
    const animationFrame = requestAnimationFrame(animateCursor);
    
    // Crear un intervalo para verificar elementos interactivos
    const hoverCheckInterval = setInterval(checkInteractiveElements, 100);
    
    // Añadir event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    // Limpiar event listeners al desmontar
    return () => {
      document.body.style.cursor = 'auto';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      clearInterval(hoverCheckInterval);
      cancelAnimationFrame(animationFrame);
    };
  }, [isClicking, isHovering]); // Dependencias actualizadas

  return (
    <>
      {/* Cursor principal - anillo naranja */}
      <div 
        ref={cursorRingRef}
        className="custom-cursor-ring"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid #f97316',
          transform: 'translate(0px, 0px) translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: isVisible ? 0.8 : 0,
          willChange: 'transform', // Optimización para rendimiento
        }}
      />
      
      {/* Elemento secundario - punto central */}
      <div 
        ref={cursorDotRef}
        className="custom-cursor-dot"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#f97316',
          transform: 'translate(0px, 0px) translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: isVisible ? 0.7 : 0,
          willChange: 'transform', // Optimización para rendimiento
        }}
      />
      
      {/* Indicador de interacción para elementos clickeables */}
      <div 
        ref={cursorInteractiveRef}
        className="custom-cursor-interactive"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid #f97316',
          transform: 'translate(0px, 0px) translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9997,
          opacity: 0,
          willChange: 'transform, opacity', // Optimización para rendimiento
        }}
      />
    </>
  );
};

export default CustomCursor;
