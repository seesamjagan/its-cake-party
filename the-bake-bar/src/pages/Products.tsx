import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Grid3X3,
  List,
  SlidersHorizontal,
  Heart,
  Eye,
  ArrowUpDown
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import productsData from '../data/products.json';

interface Category {
  id: string;
  name: string;
}

type SortOption = 'name' | 'price-low' | 'price-high' | 'featured';
type ViewMode = 'grid' | 'list';

const Products: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading with realistic delay
    setTimeout(() => {
      const sortedProducts = [...(productsData as Product[])].sort((a, b) => {
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        return 0;
      });
      setProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      setIsLoading(false);

      // Set initial price range based on products
      const prices = sortedProducts.map(p => p.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }, 1200);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, sortBy, priceRange]);

  const categories: Category[] = [
    { id: 'all', name: t('products.categories.all') },
    { id: 'cakes', name: t('products.categories.cakes') },
    { id: 'pastries', name: t('products.categories.pastries') },
    { id: 'cupcakes', name: t('products.categories.cupcakes') },
    { id: 'muffins', name: t('products.categories.muffins') },
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
  ];

  const handleAddToCart = (product: Product): void => {
    addToCart(product);
  };

  const toggleFavorite = (productId: number): void => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const getProductImage = (product: Product): string => {
    // Generate a unique gradient based on product name
    const colors = [
      ['#FF6B6B', '#FFE66D'],
      ['#4ECDC4', '#44A08D'],
      ['#A8EDEA', '#FED6E3'],
      ['#FFB6C1', '#FFA07A'],
      ['#98D8E8', '#6DD5FA'],
      ['#FFEAA7', '#FDCB6E']
    ];
    const colorIndex = product.id % colors.length;
    return `linear-gradient(135deg, ${colors[colorIndex][0]}, ${colors[colorIndex][1]})`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  if (isLoading) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner-enhanced">
            <div className="loading-ring"></div>
            <div className="loading-ring"></div>
            <div className="loading-ring"></div>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '1.125rem', color: '#8B4513' }}>
            {t('common.loading')} our delicious products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container products-page">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="page-header"
        >
          <h1 className="page-title">
            {t('products.title')}
          </h1>
          <p className="page-description">
            Discover our handcrafted delights made with love and the finest ingredients
          </p>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="enhanced-filters"
        >
          {/* Top Filter Bar */}
          <div className="filter-bar">
            {/* Search */}
            <div className="search-box enhanced">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products, ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Sort */}
            <div className="sort-dropdown">
              <ArrowUpDown size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-toggle ${showFilters ? 'active' : ''}`}
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="expandable-filters"
              >
                {/* Categories */}
                <div className="filter-section">
                  <h4>Categories</h4>
                  <div className="category-pills">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="filter-section">
                  <h4>Price Range</h4>
                  <div className="price-range">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="price-slider"
                    />
                    <div className="price-labels">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="results-info"
        >
          <p>Showing {filteredProducts.length} of {products.length} products</p>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm + sortBy + viewMode}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`products-container ${viewMode}`}
          >
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="no-products"
              >
                <div className="no-products-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setPriceRange([0, 1000]);
                  }}
                  className="btn btn-secondary"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: viewMode === 'grid' ? -10 : 0, scale: viewMode === 'grid' ? 1.02 : 1 }}
                  className={`product-card ${viewMode} ${product.featured ? 'featured' : ''}`}
                >
                  {/* Product Image */}
                  <div
                    className="product-image"
                    style={{ background: getProductImage(product) }}
                  >
                    <div className="product-overlay">
                      <button
                        className="action-btn favorite"
                        onClick={() => toggleFavorite(product.id)}
                      >
                        <Heart
                          size={18}
                          fill={favorites.has(product.id) ? '#FF6B6B' : 'none'}
                          color={favorites.has(product.id) ? '#FF6B6B' : 'white'}
                        />
                      </button>
                      <button className="action-btn quick-view">
                        <Eye size={18} />
                      </button>
                    </div>

                    {product.featured && (
                      <div className="featured-badge">
                        <Star size={12} fill="currentColor" />
                        Featured
                      </div>
                    )}

                    <div className="product-emoji">
                      {product.category === 'cakes' && '🎂'}
                      {product.category === 'pastries' && '🥐'}
                      {product.category === 'cupcakes' && '🧁'}
                      {product.category === 'muffins' && '🧈'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <div className="product-header">
                      <div>
                        <h3 className="product-name">{product.name}</h3>
                        <span className="product-category">{product.category}</span>
                      </div>
                      <div className="product-price">₹{product.price}</div>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-meta">
                      <div className="meta-item">
                        <span className="meta-label">Quantity:</span>
                        <span className="meta-value">{product.quantity}</span>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="product-tags">
                      {product.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span key={index} className="ingredient-tag">
                          {ingredient}
                        </span>
                      ))}
                      {product.ingredients.length > 3 && (
                        <span className="more-tags">+{product.ingredients.length - 3}</span>
                      )}
                    </div>

                    {/* Allergens */}
                    {product.allergens && product.allergens.length > 0 && (
                      <div className="allergens">
                        <span className="allergen-label">Contains:</span>
                        {product.allergens.map((allergen, index) => (
                          <span key={index} className="allergen-tag">
                            {allergen}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                      className={`btn btn-primary add-to-cart ${viewMode === 'list' ? 'compact' : ''}`}
                    >
                      <ShoppingCart size={18} />
                      {viewMode === 'grid' ? 'Add to Cart' : 'Add'}
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Products;