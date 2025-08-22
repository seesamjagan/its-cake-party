// Company contact information - centralized configuration
const phoneDigits = "919551862527"; // For WhatsApp links (without + and spaces)

export const COMPANY_INFO = {
  name: "The Bake Bar",
  tagline: "Homemade Bakery",
  contact: {
    phone: "+91 95518 62527",
    phoneDigits: phoneDigits,
    email: "Jaganvinothini1993@gmail.com",
    address: {
      street: "123 Bakery Street",
      city: "Sweet City",
      country: "IN",
      full: "123 Bakery Street, Sweet City"
    },
    hours: "Mon-Sun: 8AM-8PM",
    hoursDetailed: "Monday to Sunday: 8:00 AM - 8:00 PM"
  },
  social: {
    handle: "the-bake-bar",
    facebook: "https://facebook.com/the-bake-bar",
    instagram: "https://instagram.com/the-bake-bar",
    twitter: "https://twitter.com/the-bake-bar",
    whatsapp: `https://wa.me/${phoneDigits}`
  },
  website: {
    url: "https://seesamjagan.github.io/the-bake-bar/",
    domain: "seesamjagan.github.io"
  }
} as const;

// Helper functions for generating contact URLs
export const getWhatsAppUrl = (message: string = "") => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${COMPANY_INFO.contact.phoneDigits}?text=${encodedMessage}`;
};

export const getEmailUrl = (subject: string = "", body: string = "") => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${COMPANY_INFO.contact.email}?subject=${encodedSubject}&body=${encodedBody}`;
};

export const getPhoneUrl = () => {
  return `tel:${COMPANY_INFO.contact.phone}`;
};

export const getMapsUrl = () => {
  const address = encodeURIComponent(COMPANY_INFO.contact.address.full);
  return `https://maps.google.com/maps?q=${address}`;
};