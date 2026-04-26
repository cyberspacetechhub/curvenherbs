import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Curvenherbs';
const SITE_URL = 'https://curvenherbs.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  '100% Natural Herbal Body Enhancement for Women. Bum & Hips Growth, Healthy Weight Gain, Natural Curves — No Side Effects. Visible Results in 4–8 Weeks. Formulated In-House in Abakaliki, Nigeria.';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string;
  noIndex?: boolean;
  structuredData?: object;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  keywords,
  noIndex = false,
  structuredData,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = url ? `${SITE_URL}${url}` : undefined;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
