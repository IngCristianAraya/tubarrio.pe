"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  message?: string;
  emoji?: string;
  intervalMs?: number;
  toggleTitle?: boolean;
  toggleFavicon?: boolean;
  desktopOnly?: boolean;
  usePin?: boolean;
  pinColor?: string;
};

/**
 * TabAttention: Alterna el título de la pestaña y el favicon cuando la pestaña
 * está oculta, para atraer la atención del usuario de forma sutil.
 *
 * Por defecto:
 * - Cambia `document.title` entre el título original y un mensaje con emoji.
 * - Reemplaza temporalmente el favicon por uno generado con emoji usando canvas.
 * - Se desactiva automáticamente cuando la pestaña vuelve a estar visible.
 * - Respeta `prefers-reduced-motion` y no se ejecuta en móviles.
 */
export default function TabAttention({
  message = "¡Vuelve a TuBarrio.pe 👋",
  emoji = "👋",
  intervalMs = 2000,
  toggleTitle = true,
  toggleFavicon = true,
  desktopOnly = true,
  usePin = false,
  pinColor = "#ff3b30", // rojo tipo iOS por defecto
}: Props) {
  const originalTitleRef = useRef<string>("");
  const originalIconRef = useRef<string>("");
  const timerRef = useRef<number | null>(null);
  const swapStateRef = useRef<boolean>(false);

  useEffect(() => {
    // Salir si el usuario prefiere menos movimiento o si es móvil
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = /Mobi|Android|iP(ad|hone)/i.test(navigator.userAgent);
    if (prefersReducedMotion || (desktopOnly && isMobile)) {
      return;
    }

    originalTitleRef.current = document.title;
    originalIconRef.current = getCurrentFaviconHref() || "/favicon-32x32.png";

    const onVisibilityChange = () => {
      if (document.hidden) {
        startAttention();
      } else {
        stopAttention();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    // Si la pestaña ya está oculta al montar
    if (document.hidden) startAttention();

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopAttention();
    };
  }, [desktopOnly, intervalMs, toggleTitle, toggleFavicon, message, emoji]);

  const startAttention = () => {
    if (timerRef.current) return; // Evitar duplicados
    timerRef.current = window.setInterval(() => {
      swapStateRef.current = !swapStateRef.current;
      const useAlt = swapStateRef.current;
      // Título
      if (toggleTitle) {
        document.title = useAlt ? message : originalTitleRef.current;
      }
      // Favicon
      if (toggleFavicon) {
        const href = useAlt
          ? (usePin ? createPinFaviconHref(pinColor) : createEmojiFaviconHref(emoji))
          : originalIconRef.current;
        setFavicon(href);
      }
    }, intervalMs);
  };

  const stopAttention = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Restaurar estado original
    if (toggleTitle) document.title = originalTitleRef.current;
    if (toggleFavicon) setFavicon(originalIconRef.current);
  };

  return null;
}

function getCurrentFaviconHref(): string | null {
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]')
  );
  // Preferir el último definido, suele ser el efectivo
  const last = links[links.length - 1];
  return last?.href || null;
}

function setFavicon(href: string) {
  // Eliminar todos los favicons actuales para forzar actualización
  const existing = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel*="icon"]')
  );
  existing.forEach((el) => el.parentNode?.removeChild(el));

  const type = getFaviconType(href);

  const icon = document.createElement('link');
  icon.rel = 'icon';
  if (type) icon.type = type;
  icon.href = href;
  icon.sizes = '32x32';
  document.head.appendChild(icon);

  // Algunas versiones de Windows/IE antiguas y ciertos navegadores reconocen shortcut icon
  const shortcut = document.createElement('link');
  shortcut.rel = 'shortcut icon';
  if (type) shortcut.type = type;
  shortcut.href = href;
  document.head.appendChild(shortcut);
}

function getFaviconType(href: string): string | undefined {
  if (href.startsWith('data:image/')) {
    // data URL ya incluye el mime; devolvemos el que usamos
    if (href.startsWith('data:image/png')) return 'image/png';
    if (href.startsWith('data:image/svg+xml')) return 'image/svg+xml';
    return undefined;
  }
  if (href.endsWith('.png')) return 'image/png';
  if (href.endsWith('.svg')) return 'image/svg+xml';
  if (href.endsWith('.ico')) return 'image/x-icon';
  return undefined;
}

function createEmojiFaviconHref(emoji: string): string {
  const size = 64;
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const canvas = document.createElement("canvas");
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Fondo transparente para respetar temas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Texto (emoji)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${Math.floor(48 * ratio)}px system-ui, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji`;
  ctx.fillText(emoji, (size * ratio) / 2, (size * ratio) / 2);

  return canvas.toDataURL("image/png");
}

function createPinFaviconHref(color: string): string {
  const size = 64;
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  const canvas = document.createElement("canvas");
  canvas.width = size * ratio;
  canvas.height = size * ratio;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const cx = (size * ratio) / 2;
  const cy = (size * ratio) / 2;

  // Fondo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sombra suave
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.20)";
  ctx.shadowBlur = 6 * ratio;
  ctx.shadowOffsetY = 2 * ratio;

  // Cuerpo del pin: círculo + punta
  ctx.beginPath();
  const r = 14 * ratio;
  ctx.arc(cx, cy - 4 * ratio, r, Math.PI, 0); // mitad superior
  ctx.lineTo(cx + 8 * ratio, cy + 14 * ratio);
  ctx.quadraticCurveTo(cx, cy + 22 * ratio, cx - 8 * ratio, cy + 14 * ratio);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();

  // Borde sutil
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1 * ratio;
  ctx.stroke();

  // Punto interior blanco
  ctx.beginPath();
  ctx.arc(cx, cy - 6 * ratio, 5 * ratio, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  return canvas.toDataURL("image/png");
}
