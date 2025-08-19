import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Heart
} from 'lucide-react';

interface SocialLink {
  icon: React.ComponentType<{ size?: number }>;
  href: string;
  name: string;
}

interface ContactInfo {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
}

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks: SocialLink[] = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Twitter, href: '#', name: 'Twitter' },
  ];

  const contactInfo: ContactInfo[] = [
    { icon: MapPin, text: t('contact.info.address') },
    { icon: Phone, text: t('contact.info.phone') },
    { icon: Mail, text: t('contact.info.email') },
    { icon: Clock, text: t('contact.info.hours') },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-grid">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="footer-section"
            >
              <div className="footer-logo">
                <div className="logo-icon">
                  <span>B</span>
                </div>
                <div className="logo-text">
                  <div className="title">The Bake Bar</div>
                  <div className="subtitle">Homemade Bakery</div>
                </div>
              </div>
              <p className="footer-description">
                {t('home.aboutText')}
              </p>
              <div className="social-links">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="social-link"
                      aria-label={social.name}
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="footer-section"
            >
              <h3 className="section-title">{t('contact.title')}</h3>
              <ul className="contact-list">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <li key={index} className="contact-item">
                      <div className="contact-icon">
                        <Icon size={18} />
                      </div>
                      <span className="contact-text">{info.text}</span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="footer-section"
            >
              <h3 className="section-title">Quick Links</h3>
              <ul className="footer-links">
                <li className="footer-link">
                  <a href="/">{t('nav.home')}</a>
                </li>
                <li className="footer-link">
                  <a href="/products">{t('nav.products')}</a>
                </li>
                <li className="footer-link">
                  <a href="/contact">{t('nav.contact')}</a>
                </li>
              </ul>

              <div className="special-offer">
                <h4 className="offer-title">Special Offers</h4>
                <p className="offer-text">
                  Subscribe to our newsletter for exclusive deals and fresh bakery updates!
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="footer-bottom-content"
          >
            <p className="copyright">
              Made with <Heart size={16} className="heart" /> by The Bake Bar Team
            </p>
            <p className="copyright">
              © 2024 The Bake Bar. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;