'use client'

import React, { useEffect, useState, useRef } from 'react'

const CustomCursor: React.FC = () => {
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorInteractiveRef = useRef<HTMLDivElement>(null)

  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const mousePosition = useRef({ x: 0, y: 0 })
  const cursorPosition = useRef({ x: 0, y: 0 })
  const dotPosition = useRef({ x: 0, y: 0 })

  const cursorSpeed = 0.2

  useEffect(() => {
    if (typeof window === 'undefined') return

    document.body.style.cursor = 'none'

    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
      setIsVisible(true)
    }

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)
    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    const checkInteractiveElements = () => {
      const hoveredElement = document.elementFromPoint(mousePosition.current.x, mousePosition.current.y)
      const isInteractive = hoveredElement?.matches('a, button, input, select, textarea, [role="button"]')
      setIsHovering(!!isInteractive)
    }

    const animateCursor = () => {
      const dx = mousePosition.current.x - cursorPosition.current.x
      const dy = mousePosition.current.y - cursorPosition.current.y

      cursorPosition.current.x += dx * cursorSpeed
      cursorPosition.current.y += dy * cursorSpeed

      // Punto central SIN retraso
      dotPosition.current.x = mousePosition.current.x
      dotPosition.current.y = mousePosition.current.y

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px) translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotPosition.current.x}px, ${dotPosition.current.y}px) translate(-50%, -50%) scale(${isClicking ? 1.2 : 1})`
      }

      if (cursorInteractiveRef.current && isHovering) {
        cursorInteractiveRef.current.style.transform = `translate(${cursorPosition.current.x}px, ${cursorPosition.current.y}px) translate(-50%, -50%)`
        cursorInteractiveRef.current.style.opacity = '0.6'
      } else if (cursorInteractiveRef.current) {
        cursorInteractiveRef.current.style.opacity = '0'
      }

      requestAnimationFrame(animateCursor)
    }

    const animationFrame = requestAnimationFrame(animateCursor)
    const hoverCheckInterval = setInterval(checkInteractiveElements, 100)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      clearInterval(hoverCheckInterval)
      cancelAnimationFrame(animationFrame)
    }
  }, [isClicking, isHovering])

  return (
    <>
      {/* Cursor principal - anillo */}
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
          willChange: 'transform',
        }}
      />

      {/* Punto fijo central sin retraso */}
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
          willChange: 'transform',
        }}
      />

      {/* Indicador de hover sobre elementos clickeables */}
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
          willChange: 'transform, opacity',
        }}
      />
    </>
  )
}

export default CustomCursor
