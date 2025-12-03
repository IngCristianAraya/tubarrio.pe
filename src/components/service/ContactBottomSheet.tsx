'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Globe, X, MessageSquare, Facebook, Instagram } from 'lucide-react';
import type { Service } from '@/types/service';

interface ContactBottomSheetProps {
  service: Service & {
    id: string;
    whatsapp?: any;
    phone?: any;
    website?: string;
    social?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
    };
    latitude?: number | string;
    longitude?: number | string;
    location?: string;
    address?: string;
  };
}

function normalizePhone(raw?: unknown): string | null {
  if (raw === undefined || raw === null) return null;
  let text = '';
  if (typeof raw === 'string') {
    text = raw;
  } else if (typeof raw === 'number') {
    text = String(raw);
  } else if (Array.isArray(raw)) {
    const first = raw.find((v) => !!v);
    text = typeof first === 'string' ? first : String(first ?? '');
  } else if (typeof raw === 'object') {
    const obj: any = raw;
    text = obj?.whatsapp || obj?.phone || obj?.contact?.whatsapp || obj?.toString?.() || '';
  } else {
    text = String(raw);
  }
  text = text.trim();
  if (!text) return null;
  const digits = text.replace(/\D/g, '');
  if (!digits) return null;
  return digits;
}

function formatWhatsappNumber(raw?: unknown): string | null {
  const digits = normalizePhone(raw);
  if (!digits) return null;
  // Asumimos Perú si no está el prefijo
  const withCountry = digits.startsWith('51') ? digits : `51${digits}`;
  return withCountry;
}

function buildMapsLink(service: ContactBottomSheetProps['service']): string | null {
  const lat = service.latitude;
  const lng = service.longitude;
  const hasCoords = lat !== undefined && lng !== undefined && lat !== null && lng !== null;
  if (hasCoords && String(lat).length > 0 && String(lng).length > 0) {
    return `https://www.google.com/maps?q=${encodeURIComponent(String(lat))},${encodeURIComponent(String(lng))}`;
  }
  const query = service.address || service.location;
  if (query && query.trim().length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return null;
}

const ContactBottomSheet: React.FC<ContactBottomSheetProps> = ({ service }) => {
  const [open, setOpen] = useState(false);
  const [positions, setPositions] = useState({ bottomOffset: 20 });

  useEffect(() => {
    // Ajusta el offset si existe un footer fijo para evitar solapamiento
    const adjust = () => {
      // Valor conservador para margen inferior
      setPositions({ bottomOffset: window.innerWidth < 768 ? 80 : 24 });
    };
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  const wa = formatWhatsappNumber(service.whatsapp || service.social);
  const tel = normalizePhone(service.phone);
  const maps = buildMapsLink(service);
  const web = service.website || null;
  const fb = service.socialMedia?.facebook || null;
  const ig = service.socialMedia?.instagram || null;

  const actions = [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageSquare,
      href: wa ? `https://wa.me/${wa}` : null,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      key: 'phone',
      label: 'Llamar',
      icon: Phone,
      href: tel ? `tel:${tel}` : null,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      key: 'maps',
      label: 'Cómo llegar',
      icon: MapPin,
      href: maps,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      key: 'website',
      label: 'Sitio web',
      icon: Globe,
      href: web,
      color: 'bg-gray-800 hover:bg-black',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      href: fb,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      href: ig,
      color: 'bg-pink-600 hover:bg-pink-700',
    },
  ];

  return (
    <>
      {/* Botón flotante */}
      <button
        aria-label="Contactar"
        onClick={() => setOpen(true)}
        className="fixed left-1/2 -translate-x-1/2 z-40 rounded-full shadow-lg text-white px-6 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        style={{ bottom: positions.bottomOffset }}
      >
        <span className="bg-orange-600 hover:bg-orange-700 rounded-full px-4 py-2 font-semibold">Contactar</span>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 250, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="Acciones de contacto"
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl"
          >
            <div className="px-5 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Contactar a {service.name}</h3>
              <button
                aria-label="Cerrar"
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {actions.map(({ key, label, icon: Icon, href, color }) => (
                <div key={key} className="">
                  {href ? (
                    <a
                      href={href}
                      target={key === 'website' || key === 'facebook' || key === 'instagram' ? '_blank' : undefined}
                      rel={key === 'website' || key === 'facebook' || key === 'instagram' ? 'noopener noreferrer' : undefined}
                      className={`flex items-center justify-center gap-2 rounded-lg text-white px-4 py-3 ${color}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </a>
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-center gap-2 rounded-lg px-4 py-3 bg-gray-200 text-gray-500 cursor-not-allowed"
                      title={`No disponible`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ContactBottomSheet;
