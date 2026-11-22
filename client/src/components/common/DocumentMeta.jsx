import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useProducts } from '../../context/ProductContext';

export default function DocumentMeta() {
  const { content } = useContent();
  const { products } = useProducts();
  const location = useLocation();

  useEffect(() => {
    const seo = content?.advanced?.seo || {};
    const defaultTitle = 'RK Nutrition — Premium Sports Nutrition & Supplements';
    const baseTitle = seo.siteTitle || defaultTitle;
    const metaDesc = seo.metaDescription || 'Engineered for athletes and fitness enthusiasts. High-yield Whey Protein Isolate, Mass Gainer, and Pre-Workout formulations with verified label transparency.';
    const canonical = seo.canonicalUrl || 'https://rknutrition.com';
    const ogTitle = seo.ogTitle || baseTitle;
    const ogDesc = seo.ogDescription || metaDesc;
    const ogImg = seo.ogImage || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1200&q=80';

    const path = location.pathname;
    let pageTitle = baseTitle;
    let currentOgTitle = ogTitle;
    let currentOgDesc = ogDesc;
    let currentOgImg = ogImg;
    let currentProduct = null;

    // Route-specific title and metadata formatting
    if (path === '/products') {
      pageTitle = `Supplement Formulations | ${baseTitle}`;
      currentOgTitle = `All Supplement Formulations — ${baseTitle}`;
    } else if (path.startsWith('/product/')) {
      const slugOrId = path.replace('/product/', '');
      currentProduct = products?.find((p) => p.id === slugOrId || p.slug === slugOrId);
      if (currentProduct) {
        pageTitle = `${currentProduct.name} | High-Yield Supplement — ${baseTitle}`;
        currentOgTitle = `${currentProduct.name} | RK Nutrition`;
        currentOgDesc = currentProduct.shortDescription || currentProduct.description || metaDesc;
        if (currentProduct.images && currentProduct.images.length > 0) {
          currentOgImg = currentProduct.images[0];
        }
      } else {
        pageTitle = `Supplement Details | ${baseTitle}`;
      }
    } else if (path === '/categories') {
      pageTitle = `Supplement Categories | ${baseTitle}`;
      currentOgTitle = `Browse Supplements by Category — RK Nutrition`;
    } else if (path.startsWith('/categories/')) {
      const catSlug = path.replace('/categories/', '');
      const catFormatted = catSlug.replace(/-/g, ' ').toUpperCase();
      pageTitle = `${catFormatted} Supplements | ${baseTitle}`;
      currentOgTitle = `${catFormatted} Supplements Lineup — RK Nutrition`;
    } else if (path === '/about') {
      pageTitle = `Formulation Philosophy & Quality Standards | ${baseTitle}`;
      currentOgTitle = `About RK Nutrition — Pure Sports Nutrition Standards`;
    } else if (path === '/contact') {
      pageTitle = `Contact Desk & Product Inquiries | ${baseTitle}`;
      currentOgTitle = `Contact RK Nutrition`;
    } else if (path === '/faq') {
      pageTitle = `Frequently Asked Questions & Supplement Science | ${baseTitle}`;
      currentOgTitle = `Supplement FAQs & Ingestion Guidance — RK Nutrition`;
    } else if (path === '/shipping-policy') {
      pageTitle = `Shipping & Verification Policy | ${baseTitle}`;
    } else if (path === '/privacy-policy') {
      pageTitle = `Privacy Policy | ${baseTitle}`;
    } else if (path === '/terms-of-service') {
      pageTitle = `Terms of Service | ${baseTitle}`;
    } else if (path === '/checkout') {
      pageTitle = `Secure Checkout | ${baseTitle}`;
    } else if (path.startsWith('/order-confirmation')) {
      pageTitle = `Order Confirmed | ${baseTitle}`;
    } else if (path.startsWith('/admin') || path.startsWith('/super-admin')) {
      pageTitle = `Portal Management | RK Nutrition`;
    }

    document.title = pageTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attrName, attrValue, contentValue) => {
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    setMetaTag('name', 'description', currentOgDesc);
    setMetaTag('property', 'og:title', currentOgTitle);
    setMetaTag('property', 'og:description', currentOgDesc);
    setMetaTag('property', 'og:image', currentOgImg);
    setMetaTag('property', 'og:url', `${canonical}${path === '/' ? '' : path}`);
    setMetaTag('property', 'og:type', currentProduct ? 'product' : 'website');

    setMetaTag('name', 'twitter:title', currentOgTitle);
    setMetaTag('name', 'twitter:description', currentOgDesc);
    setMetaTag('name', 'twitter:image', currentOgImg);

    // Robots directive: noindex on admin, checkout, order confirmation
    const isPrivate = path.startsWith('/admin') || 
                      path.startsWith('/super-admin') || 
                      path === '/checkout' || 
                      path.startsWith('/order-confirmation');
    setMetaTag('name', 'robots', isPrivate ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `${canonical}${path === '/' ? '' : path}`);

    // Structured Data (JSON-LD)
    const jsonLdData = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'RK Nutrition',
        'url': canonical,
        'logo': `${canonical}/images/RK%20Nutrition%20Logo.png`,
        'sameAs': [
          'https://instagram.com/rknutrition',
          'https://facebook.com/rknutrition',
          'https://twitter.com/rknutrition'
        ],
        'contactPoint': {
          '@type': 'ContactPoint',
          'telephone': '+91-98765-43210',
          'contactType': 'customer service',
          'areaServed': 'IN',
          'availableLanguage': ['English', 'Hindi']
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'RK Nutrition',
        'url': canonical,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${canonical}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ];

    if (currentProduct) {
      jsonLdData.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': currentProduct.name,
        'image': currentProduct.images?.[0] || currentOgImg,
        'description': currentProduct.shortDescription || currentProduct.description || metaDesc,
        'sku': currentProduct.sku || currentProduct.id,
        'brand': {
          '@type': 'Brand',
          'name': 'RK Nutrition'
        },
        'category': currentProduct.category,
        'offers': {
          '@type': 'Offer',
          'url': `${canonical}${path}`,
          'priceCurrency': 'INR',
          'price': currentProduct.salePrice || currentProduct.price,
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': currentProduct.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'seller': {
            '@type': 'Organization',
            'name': 'RK Nutrition'
          }
        }
      });
    }

    let scriptTag = document.getElementById('rk-structured-data');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'rk-structured-data';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdData);

  }, [content, location.pathname, products]);

  return null;
}
