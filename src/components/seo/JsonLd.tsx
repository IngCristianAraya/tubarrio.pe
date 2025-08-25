'use client';

import Script from 'next/script';
import { ReactNode } from 'react';

interface JsonLdProps<T = any> {
  type: string;
  data: T;
  children?: ReactNode;
}

export function JsonLd<T>({ type, data, children }: JsonLdProps<T>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <>
      <Script
        id={`json-ld-${type}-${Math.random().toString(36).substring(2, 9)}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd, null, 2),
        }}
      />
      {children}
    </>
  );
}

// Componentes específicos de schema.org
export function LocalBusinessJsonLd({
  name,
  description,
  url,
  logo,
  address,
  geo,
  telephone,
  openingHours,
  priceRange = '$$',
  servesCuisine,
  sameAs = [],
}: {
  name: string;
  description: string;
  url: string;
  logo: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: string;
    longitude: string;
  };
  telephone: string;
  openingHours: string | string[];
  priceRange?: string;
  servesCuisine?: string[];
  sameAs?: string[];
}) {
  return (
    <JsonLd
      type="LocalBusiness"
      data={{
        name,
        description,
        url,
        logo,
        address: {
          '@type': 'PostalAddress',
          ...address,
        },
        geo: {
          '@type': 'GeoCoordinates',
          ...geo,
        },
        telephone,
        openingHours: Array.isArray(openingHours) ? openingHours : [openingHours],
        priceRange,
        servesCuisine,
        sameAs,
      }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return <JsonLd type="BreadcrumbList" data={data} />;
}

export function FAQJsonLd({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  return (
    <JsonLd
      type="FAQPage"
      data={{
        mainEntity: questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      }}
    />
  );
}
