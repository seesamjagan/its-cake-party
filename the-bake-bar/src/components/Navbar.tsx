import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Home,
  Package,
  Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const { getCartItemsCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const cartItemsCount = getCartItemsCount();

  const toggleMenu = (): void => setIsMenuOpen(!isMenuOpen);
  const toggleLanguage = (): void => setIsLanguageOpen(!isLanguageOpen);

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
    setIsLanguageOpen(false);
  };

  const navItems: NavItem[] = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/products', label: t('nav.products'), icon: Package },
    { path: '/contact', label: t('nav.contact'), icon: Phone },
  ];

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="navbar"
    >
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="logo-container"
            >
              <div className="logo-icon">
                <span>B</span>
              </div>
              <div className="logo-text">
                <div className="logo-title">The Bake Bar</div>
                <div className="logo-subtitle">Homemade Bakery</div>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.path} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="nav-controls">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={toggleTheme}
              className="control-btn theme-btn"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Language Toggle */}
            <div className="language-dropdown">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={toggleLanguage}
                className={`control-btn language-btn ${isLanguageOpen ? 'active' : ''}`}
                aria-label="Change language"
              >
                <Globe size={20} />
              </motion.button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="language-backdrop"
                      onClick={() => setIsLanguageOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="language-menu"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(139, 69, 19, 0.1)" }}
                        transition={{ duration: 0.2 }}
                        onClick={() => changeLanguage('en')}
                        className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
                      >
                        🇺🇸 English
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(139, 69, 19, 0.1)" }}
                        transition={{ duration: 0.2 }}
                        onClick={() => changeLanguage('ta')}
                        className={`language-option ${i18n.language === 'ta' ? 'active' : ''}`}
                      >
                        🇮🇳 தமிழ்
                      </motion.button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-btn">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="cart-container"
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="cart-count"
                    >
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={toggleMenu}
              className="control-btn mobile-menu-btn"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="mobile-menu"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mobile-menu-content"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;