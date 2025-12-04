"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';

type Filters = {
  categoria?: string;
  barrio?: string;
  distrito?: string;
};

type CategoryOption = { slug: string; name: string };

type FiltersDrawerProps = {
  categories: CategoryOption[];
  neighborhoods: string[];
  districts: string[];
  basePath?: string;
  mode?: 'buttonOnly' | 'responsive';
  triggerClassName?: string;
  triggerIconClassName?: string;
};

export default function FiltersDrawer({
  categories,
  neighborhoods,
  districts,
  basePath = '/servicios',
  mode = 'responsive',
  triggerClassName,
  triggerIconClassName,
}: FiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial: Filters = useMemo(() => {
    return {
      categoria: searchParams.get('categoria') || undefined,
      barrio: searchParams.get('barrio') || undefined,
      distrito: searchParams.get('distrito') || undefined,
    };
  }, [searchParams]);

  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(initial);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setFilters(initial);
  }, [initial]);

  useEffect(() => {
    if (open) {
      drawerRef.current?.focus();
      if (contentRef.current) contentRef.current.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const activeCount = useMemo(() => {
    return ['categoria', 'barrio', 'distrito'].reduce((acc, key) => {
      const k = key as keyof Filters;
      return acc + (filters[k] ? 1 : 0);
    }, 0);
  }, [filters]);

  const setParam = useCallback((key: keyof Filters, value?: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  }, []);

  const buildQueryString = useCallback((f: Filters) => {
    const params = new URLSearchParams(searchParams.toString());
    ['categoria', 'barrio', 'distrito'].forEach(k => params.delete(k));
    if (f.categoria) params.set('categoria', f.categoria);
    if (f.barrio) params.set('barrio', f.barrio);
    if (f.distrito) params.set('distrito', f.distrito);
    return params.toString();
  }, [searchParams]);

  const applyFilters = useCallback(() => {
    const qs = buildQueryString(filters);
    const url = qs ? `${basePath}?${qs}` : basePath;
    router.replace(url, { scroll: false });
    setOpen(false);
  }, [filters, buildQueryString, router, basePath]);

  const resetFilters = useCallback(() => {
    setFilters({});
    const qs = buildQueryString({});
    const url = qs ? `${basePath}?${qs}` : basePath;
    router.replace(url, { scroll: false });
  }, [buildQueryString, router, basePath]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        {mode === 'responsive' && (
          <div className="hidden md:flex gap-3 w-full">
            <select
              aria-label="Filtrar por categoría"
              className="w-1/3 rounded-md border border-gray-300 bg-white p-2 text-sm"
              value={filters.categoria || ''}
              onChange={e => setParam('categoria', e.target.value || undefined)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select
              aria-label="Filtrar por barrio"
              className="w-1/3 rounded-md border border-gray-300 bg-white p-2 text-sm"
              value={filters.barrio || ''}
              onChange={e => setParam('barrio', e.target.value || undefined)}
            >
              <option value="">Todos los barrios</option>
              {neighborhoods.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              aria-label="Filtrar por distrito"
              className="w-1/3 rounded-md border border-gray-300 bg-white p-2 text-sm"
              value={filters.distrito || ''}
              onChange={e => setParam('distrito', e.target.value || undefined)}
            >
              <option value="">Todos los distritos</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-md bg-black text-white px-4 py-2 text-sm"
                onClick={applyFilters}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                onClick={resetFilters}
              >
                Restablecer
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          className={`${triggerClassName ?? 'relative rounded-full border border-gray-300 bg-white text-gray-700 p-2 shadow-sm md:hidden'} h-10 inline-flex items-center justify-center gap-2`}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="filters-drawer"
          aria-label={activeCount > 0 ? `Abrir filtros (${activeCount} activos)` : 'Abrir filtros'}
        >
          <FunnelIcon className={`h-5 w-5 ${triggerIconClassName ?? ''}`} />
          <span className="text-sm">Filtros</span>
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[11px] font-medium text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[1000] bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="filters-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        className={`fixed inset-x-0 bottom-0 z-[1000] md:hidden transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'
          }`}
        onKeyDown={onKeyDown}
        ref={drawerRef}
        tabIndex={-1}
      >
        <div
          className="mx-auto w-full max-w-md rounded-t-2xl bg-white shadow-lg flex flex-col h-screen md:h-[90vh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
        >
          <div className="flex justify-center pt-2">
            <div className="h-1.5 w-10 rounded-full bg-gray-300" />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-base font-semibold">Filtros</h2>
            <button
              type="button"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </button>
          </div>

          <div
            ref={contentRef}
            className="px-4 py-3 space-y-3 flex-1 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                value={filters.categoria || ''}
                onChange={e => setParam('categoria', e.target.value || undefined)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Barrio</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                value={filters.barrio || ''}
                onChange={e => setParam('barrio', e.target.value || undefined)}
              >
                <option value="">Todos los barrios</option>
                {neighborhoods.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Distrito</label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                value={filters.distrito || ''}
                onChange={e => setParam('distrito', e.target.value || undefined)}
              >
                <option value="">Todos los distritos</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2 bg-white border-t pb-[env(safe-area-inset-bottom)]">
            <div className="flex gap-2">
              <button
                type="button"
                className="w-full rounded-md bg-black text-white px-4 py-2 text-sm"
                onClick={applyFilters}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm"
                onClick={resetFilters}
              >
                Restablecer
              </button>
              <button
                type="button"
                className="w-full text-sm text-gray-600"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
