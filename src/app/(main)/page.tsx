// src/app/page.tsx
import ClientHome from './client-home';
import { SocialMeta } from '@/components/seo/SocialMeta';
import { SITE_URL } from '@/lib/constants';

export const metadata = {
  title: 'Tubarrio.pe - Descubre todos los servicios de tu zona',
  description: 'Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio.',
};

export default function HomePage() {
  return (
    <>
      <SocialMeta 
        title="TuBarrio.pe - Descubre todos los servicios de tu zona"
        description="Explora restaurantes, abarrotes, lavanderías, panaderías y más servicios locales en tu barrio."
        image="/images/og-image.jpg"
        url={SITE_URL}
      />
      <ClientHome />
    </>
  );
}
