import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSEOConfig, updatePageSEO, SEOConfig } from '../config/seo';

export function useSEO(customConfig?: Partial<SEOConfig>): void {
  const location = useLocation();

  useEffect(() => {
    // Determine page key based on current route
    let pageKey = 'home';

    if (location.pathname === '/products') {
      const urlParams = new URLSearchParams(location.search);
      const category = urlParams.get('category');
      pageKey = category ? `products-${category}` : 'products';
    } else if (location.pathname === '/contact') {
      pageKey = 'contact';
    } else if (location.pathname === '/cart') {
      pageKey = 'cart';
    }

    // Get base SEO config for this page
    const baseSEOConfig = getSEOConfig(pageKey);

    // Merge with custom config if provided
    const finalConfig: SEOConfig = {
      ...baseSEOConfig,
      ...customConfig
    };

    // Update page SEO
    updatePageSEO(finalConfig);

    // Update structured data for current page
    updateStructuredData(pageKey, finalConfig);
  }, [location.pathname, location.search, customConfig]);
}

function updateStructuredData(pageKey: string, config: SEOConfig): void {
  // Remove existing structured data
  const existingScript = document.querySelector('#dynamic-structured-data');
  if (existingScript) {
    existingScript.remove();
  }

  let structuredData: any = null;

  switch (pageKey) {
    case 'home':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Its Cake Party",
        "description": config.description,
        "url": config.canonical,
        "telephone": "+91 95518 62527",
        "email": "Jaganvinothini1993@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Bakery Street",
          "addressLocality": "Sweet City",
          "addressCountry": "IN"
        },
        "openingHours": "Mo-Su 08:00-20:00",
        "priceRange": "$",
        "image": config.ogImage,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "150"
        }
      };
      break;

    case 'products':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": config.title,
        "description": config.description,
        "url": config.canonical,
        "mainEntity": {
          "@type": "ItemList",
          "name": "Bakery Products",
          "description": "Fresh baked goods, cakes, pastries, and desserts"
        }
      };
      break;

    case 'contact':
      structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": config.title,
        "description": config.description,
        "url": config.canonical,
        "mainEntity": {
          "@type": "LocalBusiness",
          "name": "Its Cake Party",
          "telephone": "+91 95518 62527",
          "email": "Jaganvinothini1993@gmail.com"
        }
      };
      break;

    default:
      if (pageKey.startsWith('products-')) {
        const category = pageKey.replace('products-', '');
        structuredData = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": config.title,
          "description": config.description,
          "url": config.canonical,
          "mainEntity": {
            "@type": "ItemList",
            "name": `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`,
            "description": `Fresh ${category} from Its Cake Party bakery`
          }
        };
      }
      break;
  }

  if (structuredData) {
    const script = document.createElement('script');
    script.id = 'dynamic-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

// Utility function for product-specific SEO
export function useProductSEO(productName?: string, productDescription?: string): void {
  const customConfig: Partial<SEOConfig> = {};

  if (productName) {
    customConfig.title = `${productName} | Fresh Bakery Products | Its Cake Party`;
    customConfig.description = productDescription || `Order fresh ${productName.toLowerCase()} from Its Cake Party. Handcrafted with love using finest ingredients.`;
  }

  useSEO(customConfig);
}