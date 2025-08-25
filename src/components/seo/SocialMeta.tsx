'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { SITE_URL, SITE_NAME, DEFAULT_SEO } from '@/lib/constants';

interface SocialMetaProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'book';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function SocialMeta({
  title = SITE_NAME,
  description = DEFAULT_SEO.description,
  image = DEFAULT_SEO.image,
  url,
  type = 'website' as const,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: SocialMetaProps) {
  const pathname = usePathname();
  const pageUrl = url || `${SITE_URL}${pathname}`;
  const pageTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const pageImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_PE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={pageImage} />

      {/* Additional Open Graph Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.length > 0 && (
        <>
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
    </Head>
  );
}

export default SocialMeta;
