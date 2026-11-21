import HeroSection from '../components/HeroSection';
import BrandPillarsStrip from '../components/home/BrandPillarsStrip';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import CategoryShowcaseSection from '../components/CategoryShowcaseSection';
import SupplementEducationSection from '../components/home/SupplementEducationSection';
import BrandIntroSection from '../components/BrandIntroSection';
import VisualFeatureSection from '../components/VisualFeatureSection';
import BrandValuesSection from '../components/BrandValuesSection';
import InformationalBanner from '../components/home/InformationalBanner';
import { useContent } from '../context/ContentContext';

const SECTION_COMPONENTS = {
  hero: HeroSection,
  pillars: BrandPillarsStrip,
  featured: FeaturedProductsSection,
  featuredProducts: FeaturedProductsSection,
  categories: CategoryShowcaseSection,
  education: SupplementEducationSection,
  supplementEducation: SupplementEducationSection,
  intro: BrandIntroSection,
  brandIntro: BrandIntroSection,
  feature: VisualFeatureSection,
  values: BrandValuesSection,
  brandValues: BrandValuesSection,
  banner: InformationalBanner
};

const DEFAULT_SECTION_ORDER = [
  'hero',
  'pillars',
  'featured',
  'categories',
  'education',
  'intro',
  'feature',
  'values',
  'banner'
];

export default function HomePage() {
  const { content } = useContent();

  const sectionOrder = Array.isArray(content?.homepage?.sectionOrder) && content.homepage.sectionOrder.length > 0
    ? content.homepage.sectionOrder
    : DEFAULT_SECTION_ORDER;

  const visibility = {
    hero: true,
    pillars: true,
    featured: true,
    categories: true,
    education: true,
    intro: true,
    feature: true,
    values: true,
    banner: false,
    ...(content?.homepage?.sectionVisibility || content?.visibility || {})
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
