import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Send,
  MessageCircle,
  Mail,
  User,
  Phone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerInfo } from '../types';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleQuantityChange = (productId: number, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const generateOrderMessage = (): string => {
    let message = `🛒 *Order from ${customerInfo.name}*\n\n`;
    message += `📞 Phone: ${customerInfo.phone}\n`;
    message += `📧 Email: ${customerInfo.email}\n\n`;
    message += `📋 *Order Details:*\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.cartQuantity}\n`;
      message += `   Price: ₹${item.price} x ${item.cartQuantity} = ₹${item.price * item.cartQuantity}\n\n`;
    });

    message += `💰 *Total Amount: ₹${getCartTotal()}*\n\n`;
    message += `Thank you for choosing The Bake Bar! 🧁`;

    return message;
  };

  const handleWhatsAppSubmit = (): void => {
    const message = generateOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919843050897?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      setShowOrderForm(false);
      setIsSubmitting(false);
      alert(t('order.success'));
    }, 2000);
  };

  const handleEmailSubmit = (): void => {
    const message = generateOrderMessage();
    const subject = `Order from ${customerInfo.name} - The Bake Bar`;
    const emailUrl = `mailto:Jaganvinothini1993@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(emailUrl);

    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      setShowOrderForm(false);
      setIsSubmitting(false);
      alert(t('order.success'));
    }, 2000);
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3 }
    }
  };

  if (items.length === 0 && !showOrderForm) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="empty-icon">🛒</div>
          <h2 className="empty-title">
            {t('cart.empty')}
          </h2>
          <p className="empty-description">
            Add some delicious treats to your cart!
          </p>
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
            >
              <ArrowLeft size={20} />
              {t('cart.continueShopping')}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <div className="container" style={{ maxWidth: '64rem' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-header"
        >
          <h1 className="page-title">
            {t('cart.title')}
          </h1>
          <p className="page-description">
            Review your order and proceed to checkout
          </p>
        </motion.div>

        {!showOrderForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Cart Items */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="card cart-item"
                  >
                    <div className="item-content">
                      {/* Product Image */}
                      <div className="item-image">
                        <span>🧁</span>
                      </div>

                      {/* Product Info */}
                      <div className="item-info">
                        <h3 className="item-name">
                          {item.name}
                        </h3>
                        <p className="item-description">
                          {item.description}
                        </p>
                        <p className="item-unit-price">
                          ₹{item.price} per {item.quantity}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="quantity-controls">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </motion.button>

                        <span className="quantity-display">
                          {item.cartQuantity}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>

                      {/* Price and Remove */}
                      <div className="item-actions">
                        <span className="item-total">
                          ₹{item.price * item.cartQuantity}
                        </span>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card cart-summary"
              style={{ padding: '1.5rem' }}
            >
              <div className="summary-total">
                <span>{t('cart.total')}:</span>
                <span className="total-amount">₹{getCartTotal()}</span>
              </div>

              <div className="summary-actions">
                <Link to="/products" style={{ flex: 1 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    <ArrowLeft size={20} />
                    {t('cart.continueShopping')}
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOrderForm(true)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <ShoppingCart size={20} />
                  {t('cart.checkout')}
                </motion.button>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Order Form */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ padding: '2rem' }}
          >
            <h2 className="text-center" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              {t('order.title')}
            </h2>

            {/* Customer Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                {t('order.customerInfo')}
              </h3>
              <div className="grid grid-1 md-grid-2 gap-4">
                <div className="form-group">
                  <div className="input-icon">
                    <User className="icon" size={20} />
                    <input
                      type="text"
                      name="name"
                      placeholder={t('contact.form.name')}
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-icon">
                    <Phone className="icon" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder={t('contact.form.phone')}
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <div className="input-icon">
                    <Mail className="icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      placeholder={t('contact.form.email')}
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
                {t('order.orderSummary')}
              </h3>
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.cartQuantity}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      ₹{item.price * item.cartQuantity}
                    </span>
                  </div>
                ))}
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <div className="flex justify-between" style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
                    <span>{t('cart.total')}:</span>
                    <span style={{ color: '#8B4513' }}>₹{getCartTotal()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p className="text-center" style={{ fontWeight: 500 }}>
                {t('order.submitVia')}:
              </p>

              <div className="grid grid-1 md-grid-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsAppSubmit}
                  disabled={!customerInfo.name || !customerInfo.phone || isSubmitting}
                  className="btn btn-primary whatsapp"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <MessageCircle size={20} />
                  {isSubmitting ? t('common.loading') : t('order.whatsapp')}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailSubmit}
                  disabled={!customerInfo.name || !customerInfo.email || isSubmitting}
                  className="btn btn-primary email"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  <Send size={20} />
                  {isSubmitting ? t('common.loading') : t('order.email')}
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOrderForm(false)}
                className="btn btn-secondary"
              >
                Back to Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;