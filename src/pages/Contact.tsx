import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  User,
  MessageSquare
} from 'lucide-react';
import { ContactFormData } from '../types';
import { COMPANY_INFO, getEmailUrl, getPhoneUrl, getMapsUrl, getWhatsAppUrl } from '../config/company';
import { useSEO } from '../hooks/useSEO';

interface ContactInfoItem {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  value: string;
  action: (() => void) | null;
}

interface SocialLink {
  icon: React.ComponentType<{ size?: number }>;
  name: string;
  url: string;
  color: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // SEO optimization for contact page
  useSEO();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleWhatsApp = (): void => {
    const message = `Hi! I'm ${formData.name}. ${formData.message}`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, '_blank');
  };

  const handleDirectEmail = (): void => {
    const subject = `Contact from ${formData.name}`;
    const body = `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const emailUrl = getEmailUrl(subject, body);
    window.open(emailUrl);
  };

  const contactInfo: ContactInfoItem[] = [
    {
      icon: MapPin,
      title: 'Address',
      value: t('contact.info.address', { address: COMPANY_INFO.contact.address.full }),
      action: () => window.open(getMapsUrl(), '_blank')
    },
    {
      icon: Phone,
      title: 'Phone',
      value: t('contact.info.phone', { phone: COMPANY_INFO.contact.phone }),
      action: () => window.open(getPhoneUrl())
    },
    {
      icon: Mail,
      title: 'Email',
      value: t('contact.info.email', { email: COMPANY_INFO.contact.email }),
      action: () => window.open(getEmailUrl())
    },
    {
      icon: Clock,
      title: 'Hours',
      value: t('contact.info.hours', { hours: COMPANY_INFO.contact.hours }),
      action: null
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      icon: Facebook,
      name: 'Facebook',
      url: COMPANY_INFO.social.facebook,
      color: 'facebook'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      url: COMPANY_INFO.social.instagram,
      color: 'instagram'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      url: COMPANY_INFO.social.twitter,
      color: 'twitter'
    },
    {
      icon: MessageCircle,
      name: t('contact.socialMedia.whatsapp'),
      url: COMPANY_INFO.social.whatsapp,
      color: 'whatsapp'
    }
  ];


  const faqs: FAQ[] = [
    {
      question: t('contact.faq.questions.hours.question'),
      answer: t('contact.faq.questions.hours.answer')
    },
    {
      question: t('contact.faq.questions.custom.question'),
      answer: t('contact.faq.questions.custom.answer')
    },
    {
      question: t('contact.faq.questions.delivery.question'),
      answer: t('contact.faq.questions.delivery.answer')
    },
    {
      question: t('contact.faq.questions.vegetarian.question'),
      answer: t('contact.faq.questions.vegetarian.answer')
    }
  ];

  return (
    <div className="page-container contact-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">
            {t('contact.title')}
          </h1>
          <p className="page-description">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            {/* Contact Cards */}
            <div className="info-cards">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div
                    key={index}
                    onClick={info.action || undefined}
                    className={`card info-card ${info.action ? 'cursor-pointer' : ''}`}
                  >
                    <div className="info-content">
                      <div className="info-icon">
                        <Icon size={24} />
                      </div>
                      <div className="info-text">
                        <div className="info-title">
                          {info.title}
                        </div>
                        <div className="info-value">
                          {info.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Placeholder */}
            <div className="card map-placeholder">
              <div className="map-content">
                <MapPin size={48} className="map-icon" />
                <p className="map-title">
                  Interactive Map Coming Soon
                </p>
                <p className="map-address">
                  {COMPANY_INFO.contact.address.full}
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div
              className="card social-section"
              style={{ padding: '1.5rem' }}
            >
              <h3 className="social-title">
                {t('contact.social')}
              </h3>
              <div className="social-grid">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-item ${social.color}`}
                    >
                      <Icon size={24} />
                      <span className="social-name">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="card contact-form"
            style={{ padding: '2rem' }}
          >
            <h2 className="form-title">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <div className="input-icon">
                    <User className="icon" size={20} />
                    <input
                      type="text"
                      name="name"
                      placeholder={t('contact.form.name')}
                      value={formData.name}
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <Mail className="icon" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.form.email')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <MessageSquare className="icon" size={20} />
                  <textarea
                    name="message"
                    placeholder={t('contact.form.message')}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Submit Options */}
              <div className="submit-options">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Send size={20} />
                  {isSubmitting ? t('common.loading') : t('contact.form.send')}
                </button>

                <div className="options-grid">
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    disabled={!formData.name || !formData.message}
                    className="btn btn-secondary option-btn whatsapp"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectEmail}
                    disabled={!formData.name || !formData.email}
                    className="btn btn-secondary option-btn email"
                  >
                    <Mail size={18} />
                    Direct Email
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="faq-header">
            <h2 className="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="faq-description">
              Quick answers to common questions about our bakery
            </p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card faq-item"
              >
                <h3 className="faq-question">
                  {faq.question}
                </h3>
                <p className="faq-answer">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;