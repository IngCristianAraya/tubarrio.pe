import { Metadata } from 'next';
import Header from '@/components/Header';
import HowItWorksHero from '@/components/how-it-works/HowItWorksHero';
import ProcessSteps from '@/components/how-it-works/ProcessSteps';
import WhyChooseUs from '@/components/how-it-works/WhyChooseUs';
import CallToAction from '@/components/how-it-works/CallToAction';

export const metadata: Metadata = {
  title: 'Cómo Funciona - TuBarrio | Encuentra Servicios Locales',
  description: 'Descubre cómo funciona TuBarrio. Encuentra, contacta y contrata servicios locales de calidad en tu barrio de manera fácil y rápida.',
  keywords: 'como funciona tubarrio, servicios locales, proceso, pasos, contratar servicios',
  openGraph: {
    title: 'Cómo Funciona - TuBarrio',
    description: 'Descubre cómo funciona TuBarrio para encontrar servicios locales de calidad.',
    type: 'website',
  },
};

export default function ComoFuncionaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <HowItWorksHero />
        <ProcessSteps />
        <WhyChooseUs />
        <CallToAction />
      </main>
    </>
  );
}