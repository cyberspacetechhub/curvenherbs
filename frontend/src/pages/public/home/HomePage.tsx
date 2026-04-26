import SEO from '@/components/SEO';
import HeroSection from './sections/HeroSection';
import TrustMarquee from './sections/TrustMarquee';
import BestSellersSection from './sections/BestSellersSection';
import HowItWorksSection from './sections/HowItWorksSection';
import RealResultsSection from './sections/RealResultsSection';
import InHouseSection from './sections/InHouseSection';
import NewsletterSection from './sections/NewsletterSection';

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Curvenherbs',
  url: 'https://curvenherbs.com',
  logo: 'https://curvenherbs.com/favicon.svg',
  description: '100% Natural Herbal Body Enhancement for Women. Formulated In-House in Abakaliki, Ebonyi State, Nigeria.',
  address: { '@type': 'PostalAddress', addressLocality: 'Abakaliki', addressRegion: 'Ebonyi State', addressCountry: 'NG' },
  contactPoint: { '@type': 'ContactPoint', telephone: '+2348149838596', contactType: 'customer service', availableLanguage: 'English' },
  sameAs: ['https://wa.me/2348149838596'],
};

export default function HomePage() {
  return (
    <>
      <SEO
        title="Curvenherbs — Natural Curves. Real Confidence."
        description="100% Natural Herbal Body Enhancement for Women. Bum & Hips Growth, Healthy Weight Gain, Natural Curves — No Side Effects. Visible Results in 4–8 Weeks. Formulated In-House in Abakaliki, Nigeria."
        url="/"
        keywords="herbal body enhancement, bum hips growth syrup, natural weight gain Nigeria, curve booster powder, herbal products for women, Curvenherbs, Abakaliki herbal"
        structuredData={homeStructuredData}
      />
      <HeroSection />
      <TrustMarquee />
      <BestSellersSection />
      <HowItWorksSection />
      <RealResultsSection />
      <InHouseSection />
      <NewsletterSection />
    </>
  );
}
