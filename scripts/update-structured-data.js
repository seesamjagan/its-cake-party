// Script to update structured data and meta tags in HTML files with centralized company info
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read company info from centralized config
const configPath = join(__dirname, '../src/config/company.ts');
let configContent = readFileSync(configPath, 'utf8');

// Extract COMPANY_INFO from TypeScript file (simple parsing)
const companyInfoMatch = configContent.match(/export const COMPANY_INFO = ({[\s\S]*?}) as const;/);
if (!companyInfoMatch) {
  throw new Error('Could not find COMPANY_INFO in config file');
}

// Convert TypeScript object to JavaScript object (basic conversion)
let companyInfoStr = companyInfoMatch[1]
  .replace(/phoneDigits: phoneDigits,/g, 'phoneDigits: "919551862527",')
  .replace(/whatsapp: `https:\/\/wa\.me\/\$\{phoneDigits\}`/g, 'whatsapp: "https://wa.me/919551862527"');

const COMPANY_INFO = eval('(' + companyInfoStr + ')');

// Function to update HTML file
function updateHtmlFile(filePath, isIndexFile = false) {
  let htmlContent = readFileSync(filePath, 'utf8');

  // Update title and meta tags
  const title = `${COMPANY_INFO.name} - ${COMPANY_INFO.tagline} | Fresh Artisan Baked Goods`;
  const description = `${COMPANY_INFO.name} is a family-owned bakery dedicated to creating the most delicious homemade treats. Every product is crafted with love and the finest ingredients.`;

  htmlContent = htmlContent
    .replace(/<title>.*?<\/title>/g, `<title>${title}</title>`)
    .replace(/name="title" content=".*?"/g, `name="title" content="${title}"`)
    .replace(/name="description" content=".*?"/g, `name="description" content="${description}. Order fresh cakes, pastries, and baked goods online."`)
    .replace(/name="author" content=".*?"/g, `name="author" content="${COMPANY_INFO.name} Team"`)
    .replace(/property="og:title" content=".*?"/g, `property="og:title" content="${title}"`)
    .replace(/property="og:description" content=".*?"/g, `property="og:description" content="${description}"`)
    .replace(/property="og:site_name" content=".*?"/g, `property="og:site_name" content="${COMPANY_INFO.name}"`)
    .replace(/property="twitter:title" content=".*?"/g, `property="twitter:title" content="${title}"`)
    .replace(/property="twitter:description" content=".*?"/g, `property="twitter:description" content="${description}"`)
    .replace(/name="apple-mobile-web-app-title" content=".*?"/g, `name="apple-mobile-web-app-title" content="${COMPANY_INFO.name}"`);

  // Update structured data (only for index.html)
  if (isIndexFile) {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Bakery",
      "name": COMPANY_INFO.name,
      "description": description,
      "url": COMPANY_INFO.website.url,
      "telephone": COMPANY_INFO.contact.phone,
      "email": COMPANY_INFO.contact.email,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": COMPANY_INFO.contact.address.country,
        "streetAddress": COMPANY_INFO.contact.address.full
      },
      "openingHours": "Mo-Su 08:00-20:00",
      "priceRange": "$$",
      "image": `${COMPANY_INFO.website.url}logo.png`
    };

    const structuredDataRegex = /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/;
    const newStructuredDataScript = `<script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 6)}
    </script>`;

    htmlContent = htmlContent.replace(structuredDataRegex, newStructuredDataScript);
  }

  writeFileSync(filePath, htmlContent, 'utf8');
}

// Update index.html
const indexPath = join(__dirname, '../index.html');
updateHtmlFile(indexPath, true);

// Update 404.html
const notFoundPath = join(__dirname, '../public/404.html');
updateHtmlFile(notFoundPath, false);

console.log('✅ HTML files updated successfully with centralized company information!');
console.log(`   - Updated meta tags and structured data for ${COMPANY_INFO.name}`);
console.log('   - All hardcoded company references now use centralized config');