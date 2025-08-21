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
import { COMPANY_INFO } from '../config/company';
import logoImage from '../assets/images/logo.png';

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
    { icon: Facebook, href: COMPANY_INFO.social.facebook, name: 'Facebook' },
    { icon: Instagram, href: COMPANY_INFO.social.instagram, name: 'Instagram' },
    { icon: Twitter, href: COMPANY_INFO.social.twitter, name: 'Twitter' },
  ];

  const contactInfo: ContactInfo[] = [
    { icon: MapPin, text: COMPANY_INFO.contact.address.full },
    { icon: Phone, text: COMPANY_INFO.contact.phone },
    { icon: Mail, text: COMPANY_INFO.contact.email },
    { icon: Clock, text: COMPANY_INFO.contact.hours },
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
                  <img src={logoImage} alt={`${COMPANY_INFO.name} Logo`} className="logo-image" />
                </div>
                <div className="logo-text">
                  <div className="title">{COMPANY_INFO.name}</div>
                  <div className="subtitle">{COMPANY_INFO.tagline}</div>
                </div>
              </div>
              <p className="footer-description">
                {t('home.aboutText', { companyName: COMPANY_INFO.name })}
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
              Made with <Heart size={16} className="heart" /> by {COMPANY_INFO.name} Team
            </p>
            <p className="copyright">
              © 2024 {COMPANY_INFO.name}. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;