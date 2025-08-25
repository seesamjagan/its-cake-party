// Company contact information - centralized configuration
const phoneDigits = "919551862527"; // For WhatsApp links (without + and spaces)

export const COMPANY_INFO = {
  name: "Its Cake Party",
  tagline: "Homemade Bakery",
  contact: {
    phone: "+91 95518 62527",
    phoneDigits: phoneDigits,
    email: "itscakeparty@gmail.com",
    address: {
      street: "14 Vedha Illam, Amudham Nagar, 4th Cross Street",
      city: "New Perungalathur, Chennai - 600063",
      country: "IN",
      full: "14 Vedha Illam, Amudham Nagar, 4th Cross Street, New Perungalathur, Chennai - 600063"
    },
    hours: "Mon-Sun: 8AM-8PM",
    hoursDetailed: "Monday to Sunday: 8:00 AM - 8:00 PM"
  },
  social: {
    handle: "its-cake-party",
    facebook: "https://facebook.com/its-cake-party",
    instagram: "https://instagram.com/its-cake-party",
    twitter: "https://twitter.com/its-cake-party",
    whatsapp: `https://wa.me/${phoneDigits}`
  },
  website: {
    url: "https://seesamjagan.github.io/its-cake-party/",
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