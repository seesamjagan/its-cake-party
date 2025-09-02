import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { COMPANY_INFO } from '../config/company';

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
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-container">
              <div className="logo-icon">
                <img src="logo.png" alt={`${COMPANY_INFO.name} Logo`} className="logo-image" />
              </div>
              <div className="logo-text">
                <div className="logo-title">{COMPANY_INFO.name}</div>
                <div className="logo-subtitle">{COMPANY_INFO.tagline}</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="nav-controls">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="control-btn theme-btn"
              aria-label={t('common.toggleTheme')}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Toggle */}
            <div className="language-dropdown">
              <button
                onClick={toggleLanguage}
                className={`control-btn language-btn ${isLanguageOpen ? 'active' : ''}`}
                aria-label={t('common.changeLanguage')}
              >
                <Globe size={20} />
              </button>

              {isLanguageOpen && (
                <>
                  <div
                    className="language-backdrop"
                    onClick={() => setIsLanguageOpen(false)}
                  />
                  <div className="language-menu">
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
                    >
                        🇺🇸 English
                    </button>
                    <button
                      onClick={() => changeLanguage('ta')}
                      className={`language-option ${i18n.language === 'ta' ? 'active' : ''}`}
                    >
                        🇮🇳 தமிழ்
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-btn">
              <div className="cart-container">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="cart-count">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="control-btn mobile-menu-btn"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-content">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;