"use client";

import type { Service } from '@/types/service';
import { useCallback } from 'react';

function normalizePhone(phone?: string) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

export default function ServiceMobileBottomNav({ service }: { service: Service }) {
  const handleMapClick = useCallback(() => {
    const el = document.getElementById('service-map');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const contactHref = service.contactUrl
    || (service.whatsapp ? `https://wa.me/${service.whatsapp.replace(/[^\d]/g, '')}`
    : (service.phone ? `https://wa.me/${service.phone.replace(/[^\d]/g, '')}` : undefined));

  const detailsHref = service.detailsUrl;

  const telHref = (() => {
    const p = normalizePhone(service.phone || service.whatsapp);
    return p ? `tel:${p}` : undefined;
  })();

  const items: Array<{
    key: string;
    label: string;
    icon: string;
    href?: string;
    external?: boolean;
    onClick?: () => void;
  }> = [
    { key: 'contacto', label: 'Contacto', icon: '💬', href: contactHref, external: true },
    { key: 'web', label: 'Web', icon: '🌐', href: detailsHref, external: true },
    { key: 'mapa', label: 'Mapa', icon: '📍', onClick: handleMapClick },
    { key: 'llamar', label: 'Llamar', icon: '📞', href: telHref },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 z-50">
      <div className="mx-auto max-w-md">
        <ul className="grid grid-cols-4">
          {items.map((item) => {
            const isDisabled = !item.href && !item.onClick;
            if (item.onClick) {
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={`w-full flex flex-col items-center justify-center py-2.5 text-xs ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
                  >
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span className="mt-0.5">{item.label}</span>
                  </button>
                </li>
              );
            }
            const isExternal = !!item.external && !!item.href && item.href.startsWith('http');
            const href = item.href || '#';
            return (
              <li key={item.key}>
                <a
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={`flex flex-col items-center justify-center py-2.5 text-xs ${isDisabled ? 'text-gray-400 pointer-events-none' : 'text-gray-700'}`}
                >
                  <span className="text-xl leading-none">{item.icon}</span>
                  <span className="mt-0.5">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

