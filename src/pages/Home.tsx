import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="hero-content"
        >
          <motion.div
            variants={floatVariants}
            animate="animate"
            className="hero-logo"
          >
            <img src="logo.png" alt={`${COMPANY_INFO.name} Logo`} className="hero-logo-image" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="hero-title"
          >
            {t('home.title', { companyName: COMPANY_INFO.name })}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="hero-subtitle"
          >
            {t('home.subtitle', { tagline: COMPANY_INFO.tagline })}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="hero-description"
          >
            {t('home.description')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="hero-actions"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                {t('home.cta')}
                <ChevronRight size={20} />
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
              >
                {t('nav.contact')}
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="stats-grid"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
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
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2 className="section-title">
              {t('home.featured')}
            </h2>
            <p className="section-description">
              {t('common.featuredDescription')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="products-grid"
          >
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
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
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
            style={{ marginTop: '3rem' }}
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
              >
                {t('common.viewAllProducts')}
                <ChevronRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '5rem 0', background: 'linear-gradient(to right, #FFF8DC, #F5F5DC)' }}>
        <div className="container">
          <div className="grid grid-1 lg-grid-2 gap-8" style={{ alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;