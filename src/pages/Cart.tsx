import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { COMPANY_INFO, getWhatsAppUrl, getEmailUrl } from '../config/company';

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
    message += `Thank you for choosing ${COMPANY_INFO.name}! 🧁`;

    return message;
  };

  const handleWhatsAppSubmit = (): void => {
    const message = generateOrderMessage();
    const whatsappUrl = getWhatsAppUrl(message);
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
    const subject = `Order from ${customerInfo.name} - ${COMPANY_INFO.name}`;
    const emailUrl = getEmailUrl(subject, message);
    window.open(emailUrl);

    setIsSubmitting(true);
    setTimeout(() => {
      clearCart();
      setShowOrderForm(false);
      setIsSubmitting(false);
      alert(t('order.success'));
    }, 2000);
  };


  if (items.length === 0 && !showOrderForm) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="empty-icon">🛒</div>
          <h2 className="empty-title">
            {t('cart.empty')}
          </h2>
          <p className="empty-description">
            Add some delicious treats to your cart!
          </p>
          <Link to="/products">
            <button className="btn btn-primary">
              <ArrowLeft size={20} />
              {t('cart.continueShopping')}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <div className="container" style={{ maxWidth: '64rem' }}>
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            {t('cart.title')}
          </h1>
          <p className="page-description">
            Review your order and proceed to checkout
          </p>
        </div>

        {!showOrderForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
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
                        <button
                          onClick={() => handleQuantityChange(item.id, item.cartQuantity - 1)}
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="quantity-display">
                          {item.cartQuantity}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(item.id, item.cartQuantity + 1)}
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price and Remove */}
                      <div className="item-actions">
                        <span className="item-total">
                          ₹{item.price * item.cartQuantity}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div
              className="card cart-summary"
              style={{ padding: '1.5rem' }}
            >
              <div className="summary-total">
                <span>{t('cart.total')}:</span>
                <span className="total-amount">₹{getCartTotal()}</span>
              </div>

              <div className="summary-actions">
                <Link to="/products" style={{ flex: 1 }}>
                  <button
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    <ArrowLeft size={20} />
                    {t('cart.continueShopping')}
                  </button>
                </Link>

                <button
                  onClick={() => setShowOrderForm(true)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <ShoppingCart size={20} />
                  {t('cart.checkout')}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Order Form */
          <div
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
                <button
                  onClick={handleWhatsAppSubmit}
                  disabled={!customerInfo.name || !customerInfo.phone || isSubmitting}
                  className="btn btn-primary whatsapp"
                  style={{ backgroundColor: '#10b981' }}
                >
                  <MessageCircle size={20} />
                  {isSubmitting ? t('common.loading') : t('order.whatsapp')}
                </button>

                <button
                  onClick={handleEmailSubmit}
                  disabled={!customerInfo.name || !customerInfo.email || isSubmitting}
                  className="btn btn-primary email"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  <Send size={20} />
                  {isSubmitting ? t('common.loading') : t('order.email')}
                </button>
              </div>

              <button
                onClick={() => setShowOrderForm(false)}
                className="btn btn-secondary"
              >
                Back to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;