import HeroSection from '../components/HeroSection';
import InfiniteMarqueeStrip from '../components/home/InfiniteMarqueeStrip';
import BrandPillarsStrip from '../components/home/BrandPillarsStrip';
import TrustStrip from '../components/home/TrustStrip';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import CategoryShowcaseSection from '../components/CategoryShowcaseSection';
import BrandIntroSection from '../components/BrandIntroSection';
import WhyRKComparisonSection from '../components/home/WhyRKComparisonSection';
import SupplementEducationSection from '../components/home/SupplementEducationSection';
import SocialProofBand from '../components/home/SocialProofBand';
import ClosingCtaBand from '../components/home/ClosingCtaBand';
import VisualFeatureSection from '../components/VisualFeatureSection';
import BrandValuesSection from '../components/BrandValuesSection';
import InformationalBanner from '../components/home/InformationalBanner';
import { useContent } from '../context/ContentContext';

const SECTION_COMPONENTS = {
  hero: HeroSection,
  marquee: InfiniteMarqueeStrip,
  pillars: BrandPillarsStrip,
  trust: TrustStrip,
  featured: FeaturedProductsSection,
  featuredProducts: FeaturedProductsSection,
  categories: CategoryShowcaseSection,
  intro: BrandIntroSection,
  brandIntro: BrandIntroSection,
  whyRk: WhyRKComparisonSection,
  education: SupplementEducationSection,
  supplementEducation: SupplementEducationSection,
  reviews: SocialProofBand,
  closingCta: ClosingCtaBand,
  feature: VisualFeatureSection,
  values: BrandValuesSection,
  brandValues: BrandValuesSection,
  banner: InformationalBanner
};

const DEFAULT_SECTION_ORDER = [
  'hero',
  'marquee',
  'pillars',
  'trust',
  'featured',
  'categories',
  'intro',
  'whyRk',
  'education',
  'reviews',
  'banner',
  'closingCta'
];

export default function HomePage() {
  const { content } = useContent();

  const rawOrder = Array.isArray(content?.homepage?.sectionOrder) && content.homepage.sectionOrder.length > 0
    ? content.homepage.sectionOrder
    : DEFAULT_SECTION_ORDER;

  // Enforce removal of feature and values from HomePage per Phase 1
  const sectionOrder = rawOrder.filter(
    (key) => key !== 'values' && key !== 'brandValues' && key !== 'feature'
  );

  const visibility = {
    hero: true,
    marquee: true,
    pillars: true,
    trust: true,
    featured: true,
    categories: true,
    intro: true,
    whyRk: true,
    education: true,
    reviews: true,
    closingCta: true,
    banner: false,
    ...(content?.homepage?.sectionVisibility || content?.visibility || {}),
    feature: false,
    values: false,
    brandValues: false
  };

  const renderedKeys = new Set();

  return (
    <>
      {sectionOrder.map((key) => {
        if (!key || renderedKeys.has(key)) return null;
        renderedKeys.add(key);

        const isVisible = key === 'banner'
          ? Boolean(visibility[key])
          : visibility[key] !== false;

        if (!isVisible) return null;

        const Component = SECTION_COMPONENTS[key];
        if (!Component) return null;

        return <Component key={key} />;
      })}
    </>
  );
}
