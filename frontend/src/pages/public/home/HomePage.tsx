import HeroSection from './sections/HeroSection';
import TrustMarquee from './sections/TrustMarquee';
import BestSellersSection from './sections/BestSellersSection';
import HowItWorksSection from './sections/HowItWorksSection';
import RealResultsSection from './sections/RealResultsSection';
import InHouseSection from './sections/InHouseSection';
import NewsletterSection from './sections/NewsletterSection';

export default function HomePage() {
  return (
    <>
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
