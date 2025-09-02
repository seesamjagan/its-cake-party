export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

export const SEO_CONFIG: Record<string, SEOConfig> = {
  home: {
    title: "Its Cake Party - Homemade Bakery | Fresh Artisan Baked Goods | Order Online",
    description: "Its Cake Party is a family-owned bakery dedicated to creating the most delicious homemade treats. Every product is crafted with love and the finest ingredients. Order fresh cakes, pastries, and baked goods online for delivery. Custom cakes, wedding cakes, birthday cakes available.",
    keywords: "bakery, homemade, cakes, pastries, fresh baked goods, artisan bakery, custom cakes, wedding cakes, birthday cakes, cookies, bread, desserts, online bakery, cake delivery, fresh pastries, homemade bread, cupcakes, muffins, brownies, food delivery, local bakery",
    canonical: "https://itscakeparty.com/",
    ogImage: "https://itscakeparty.com/logo.png",
    ogType: "website"
  },

  products: {
    title: "Fresh Bakery Products | Cakes, Pastries & Desserts | Its Cake Party",
    description: "Browse our extensive collection of fresh baked goods including custom cakes, wedding cakes, pastries, cookies, cupcakes, muffins, and desserts. All made with love using finest ingredients. Order online for home delivery.",
    keywords: "bakery products, fresh cakes, pastries, cookies, cupcakes, muffins, brownies, desserts, wedding cakes, birthday cakes, custom cakes, online bakery ordering, cake delivery, artisan pastries",
    canonical: "https://itscakeparty.com/products",
    ogImage: "https://itscakeparty.com/logo.png",
    ogType: "website"
  },

  contact: {
    title: "Contact Us - Its Cake Party | Order Custom Cakes & Bakery Items",
    description: "Get in touch with Its Cake Party for custom cake orders, catering services, and special bakery requests. Located in Sweet City, India. Call +91 95518 62527 or email us for personalized service and fresh baked goods.",
    keywords: "contact bakery, custom cake orders, bakery contact, cake catering, wedding cake orders, birthday cake orders, bakery phone number, bakery address, cake consultation",
    canonical: "https://itscakeparty.com/contact",
    ogImage: "https://itscakeparty.com/logo.png",
    ogType: "website"
  },

  cart: {
    title: "Shopping Cart - Its Cake Party | Review Your Bakery Order",
    description: "Review your bakery order, modify quantities, and proceed to checkout. Fresh baked goods from Its Cake Party delivered to your doorstep. Secure online ordering for cakes, pastries, and desserts.",
    keywords: "bakery cart, order review, cake checkout, bakery delivery, online bakery order, cake order summary",
    canonical: "https://itscakeparty.com/cart",
    ogImage: "https://itscakeparty.com/logo.png",
    ogType: "website"
  },

  // Product categories
  'products-cakes': {
    title: "Fresh Cakes Online | Custom & Wedding Cakes | Its Cake Party",
    description: "Order fresh, handcrafted cakes online from Its Cake Party. Custom birthday cakes, wedding cakes, celebration cakes made with finest ingredients. Same-day delivery available.",
    keywords: "fresh cakes, custom cakes, wedding cakes, birthday cakes, celebration cakes, online cake order, cake delivery, handmade cakes",
    canonical: "https://itscakeparty.com/products?category=cakes"
  },

  'products-pastries': {
    title: "Artisan Pastries Online | Fresh Baked Daily | Its Cake Party",
    description: "Delicious artisan pastries baked fresh daily. Order croissants, Danish pastries, puff pastries, and more from Its Cake Party. Made with premium ingredients and traditional techniques.",
    keywords: "artisan pastries, fresh pastries, croissants, Danish pastries, puff pastries, bakery pastries, pastry delivery",
    canonical: "https://itscakeparty.com/products?category=pastries"
  },

  'products-cookies': {
    title: "Homemade Cookies Online | Fresh Baked Cookies | Its Cake Party",
    description: "Order fresh homemade cookies online from Its Cake Party. Chocolate chip, oatmeal, sugar cookies and more. Perfect for gifts, parties, or everyday treats.",
    keywords: "homemade cookies, fresh cookies, chocolate chip cookies, oatmeal cookies, sugar cookies, cookie delivery, bakery cookies",
    canonical: "https://itscakeparty.com/products?category=cookies"
  },

  'products-cupcakes': {
    title: "Gourmet Cupcakes Online | Custom Cupcakes | Its Cake Party",
    description: "Delicious gourmet cupcakes made fresh daily. Custom cupcakes for parties, events, and celebrations. Order online for delivery or pickup from Its Cake Party.",
    keywords: "gourmet cupcakes, custom cupcakes, party cupcakes, celebration cupcakes, cupcake delivery, fresh cupcakes",
    canonical: "https://itscakeparty.com/products?category=cupcakes"
  }
};

export const DEFAULT_SEO: SEOConfig = {
  title: "Its Cake Party - Homemade Bakery | Fresh Artisan Baked Goods",
  description: "Its Cake Party is a family-owned bakery dedicated to creating the most delicious homemade treats. Every product is crafted with love and the finest ingredients.",
  keywords: "bakery, homemade, cakes, pastries, fresh baked goods, artisan bakery",
  canonical: "https://itscakeparty.com/",
  ogImage: "https://itscakeparty.com/logo.png",
  ogType: "website"
};

export function getSEOConfig(pageKey: string): SEOConfig {
  return SEO_CONFIG[pageKey] || DEFAULT_SEO;
}

export function updatePageSEO(config: SEOConfig): void {
  // Update document title
  document.title = config.title;

  // Update meta description
  updateMetaTag('description', config.description);

  // Update meta keywords
  if (config.keywords) {
    updateMetaTag('keywords', config.keywords);
  }

  // Update canonical URL
  if (config.canonical) {
    updateLinkTag('canonical', config.canonical);
  }

  // Update Open Graph tags
  updateMetaTag('og:title', config.title, 'property');
  updateMetaTag('og:description', config.description, 'property');
  if (config.ogImage) {
    updateMetaTag('og:image', config.ogImage, 'property');
  }
  if (config.ogType) {
    updateMetaTag('og:type', config.ogType, 'property');
  }
  if (config.canonical) {
    updateMetaTag('og:url', config.canonical, 'property');
  }

  // Update Twitter Card tags
  updateMetaTag('twitter:title', config.title);
  updateMetaTag('twitter:description', config.description);
  if (config.ogImage) {
    updateMetaTag('twitter:image', config.ogImage);
  }
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }

  meta.content = content;
}

function updateLinkTag(rel: string, href: string): void {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }

  link.href = href;
}