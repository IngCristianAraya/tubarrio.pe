export type DataSource = 'firebase' | 'supabase';

export function getDataSource(): DataSource {
  // Default a Supabase para evitar dependencias de Firebase
  const val = (process.env.NEXT_PUBLIC_DATA_SOURCE || 'supabase').toLowerCase();
  return val === 'firebase' ? 'firebase' : 'supabase';
}

export function isSupabaseEnabled(): boolean {
  return getDataSource() === 'supabase';
}

export function isFirebaseEnabled(): boolean {
  return getDataSource() === 'firebase';
}

// Country helper: returns a 2-letter country code (e.g., 'pe'), or null if not set/invalid
export function getCountry(): string | null {
  const val = (process.env.NEXT_PUBLIC_COUNTRY || '').toLowerCase().trim();
  if (!val) return null;
  return /^[a-z]{2}$/.test(val) ? val : null;
}

// Feature flags: lista separada por comas en NEXT_PUBLIC_FEATURES (ej: "chile_extra, new_buttons")
export function getFeatureFlags(): Set<string> {
  const raw = (process.env.NEXT_PUBLIC_FEATURES || '').trim();
  if (!raw) return new Set();
  const items = raw
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set(items);
}

export function isFeatureEnabled(name: string): boolean {
  return getFeatureFlags().has(name.trim().toLowerCase());
}