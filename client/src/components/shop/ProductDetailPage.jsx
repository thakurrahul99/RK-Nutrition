import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductAccordion from './ProductAccordion';
import ProductReviews from './ProductReviews';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage({ product, onBackToShop }) {
  if (!product) return null;

  const { additionalInfo } = product;

  // Prepare expandable sections ONLY when verified data is available
  const accordionItems = [];

  if (additionalInfo?.productInfo) {
    accordionItems.push({
      title: "Product Information",
      content: additionalInfo.productInfo
    });
  }

  if (additionalInfo?.ingredients) {
    accordionItems.push({
      title: "Ingredients / Composition",
      content: additionalInfo.ingredients
    });
  }

  if (additionalInfo?.nutrition) {
    accordionItems.push({
      title: "Nutrition Information",
      content: additionalInfo.nutrition
    });
  }

  if (additionalInfo?.usage) {
    accordionItems.push({
      title: "Usage / Label Directions",
      content: additionalInfo.usage
    });
  }

  if (additionalInfo?.storage) {
    accordionItems.push({
      title: "Storage Information",
      content: additionalInfo.storage
    });
  }

  if (additionalInfo?.faq && additionalInfo.faq.length > 0) {
    accordionItems.push({
      title: "Frequently Asked Questions",
      content: (
        <div className="space-y-4 pt-1">
          {additionalInfo.faq.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-semibold text-[#F5F4F2] text-xs block">{item.q}</span>
              <p className="text-xs text-[#8C8C8C]">{item.a}</p>
            </div>
          ))}
        </div>
      )
    });
  }

  return (
    <div className="bg-[#111111] min-h-screen py-10 px-4 sm:px-6 lg:px-8 border-b border-[#222222]">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono uppercase text-[#8C8C8C]">
          <button
            type="button"
            onClick={onBackToShop}
            className="inline-flex items-center gap-1.5 hover:text-[#F5F4F2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>COLLECTION</span>
          </button>
          <span>/</span>
          <span className="text-[#8C8C8C]">{product.category}</span>
          <span>/</span>
          <span className="text-[#C8202B] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Media Column (6 cols) */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Product Information, Accordions & Reviews Column (6 cols) */}
          <div className="lg:col-span-6 space-y-10">
            <ProductInfo product={product} />

            {/* Expandable Information Sections */}
            {accordionItems.length > 0 && (
              <div className="pt-6">
                <ProductAccordion items={accordionItems} />
              </div>
            )}

            {/* Authentic Customer Reviews & Feedback */}
            <ProductReviews productId={product.id} productName={product.name} />
          </div>

        </div>

      </div>
    </div>
  );
}
