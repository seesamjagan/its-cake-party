import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Star, Award, Users, Clock } from 'lucide-react';
import { Product } from '../types';
import productsData from '../data/products.json';
import { COMPANY_INFO } from '../config/company';

interface Stat {
  icon: React.ComponentType<{ size?: number }>;
  number: string;
  label: string;
}

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get featured products
    const featured = (productsData as Product[]).filter(product => product.featured);
    setFeaturedProducts(featured);
  }, []);


  const stats: Stat[] = [
    { icon: Users, number: '20+', label: t('home.stats.customers') },
    { icon: Award, number: '50+', label: t('home.stats.recipes') },
    { icon: Star, number: '4.9', label: t('home.stats.rating') },
    { icon: Clock, number: '2', label: t('home.stats.experience') },
  ];

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="floating-element element-1"></div>
        <div className="floating-element element-2"></div>

        <div className="hero-content">
          <div className="hero-logo">
            <img src="logo.png" alt={`${COMPANY_INFO.name} Logo`} className="hero-logo-image" />
          </div>

          <h1 className="hero-title">
            {t('home.title', { companyName: COMPANY_INFO.name })}
          </h1>

          <p className="hero-subtitle">
            {t('home.subtitle', { tagline: COMPANY_INFO.tagline })}
          </p>

          <p className="hero-description">
            {t('home.description')}
          </p>

          <div className="hero-actions">
            <Link to="/products">
              <button className="btn btn-primary">
                {t('home.cta')}
                <ChevronRight size={20} />
              </button>
            </Link>
            <Link to="/contact">
              <button className="btn btn-secondary">
                {t('nav.contact')}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="stat-item"
                >
                  <div className="stat-icon">
                    <Icon size={24} />
                  </div>
                  <div className="stat-number">
                    {stat.number}
                  </div>
                  <div className="stat-label">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {t('home.featured')}
            </h2>
            <p className="section-description">
              {t('common.featuredDescription')}
            </p>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="card product-card"
              >
                <div className="product-image">
                  <div>🧁</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">
                    {product.name}
                  </h3>
                  <p className="product-description">
                    {product.description}
                  </p>
                  <div className="product-footer">
                    <span className="product-price">
                      ₹{product.price}
                    </span>
                    <span className="product-quantity">
                      {product.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="text-center"
            style={{ marginTop: '3rem' }}
          >
            <Link to="/products">
              <button className="btn btn-primary">
                {t('common.viewAllProducts')}
                <ChevronRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(to right, #FFF8DC, #F5F5DC)' }}>
        <div className="container">
          <div className="grid grid-1 lg-grid-2 gap-8" style={{ alignItems: 'center' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                {t('home.about')}
              </h2>
              <p style={{ fontSize: '1.125rem', lineHeight: '1.75', marginBottom: '1.5rem', color: '#374151' }}>
                {t('home.aboutText', { companyName: COMPANY_INFO.name })}
              </p>
              <p style={{ color: '#6b7280', lineHeight: '1.75' }}>
                From our signature chocolate cakes to delicate pastries, every item in our bakery
                tells a story of tradition, innovation, and pure deliciousness.
              </p>
            </div>

            <div className="relative">
              <div style={{
                aspectRatio: '4/3',
                background: 'linear-gradient(to bottom right, #8B4513, #d97706)',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>👨‍🍳</div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Crafted with Love</p>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '-1rem',
                  right: '-1rem',
                  width: '5rem',
                  height: '5rem',
                  backgroundColor: '#FFB6C1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}
              >
                ⭐
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;