import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { SocialLinks } from './SocialLinks';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../data/translations';
import emailjs from '@emailjs/browser';

export const ContactSection: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const sendConfirmationEmail = async (senderEmail: string, senderName: string) => {
    const confirmationMessages = {
      en: 'Your message has been sent to Aurimas. He will reply at his earliest convenience.',
      lt: 'Žinutė nusiųsta Aurimui. Jis atrašys, kai galės.',
      fr: 'Message sent to Aurimas. He will reply at his earliest convenience.'
    };

    const confirmationSubject = {
      en: 'Message Confirmation - Aurimas Website',
      lt: 'Žinutės patvirtinimas - Aurimo svetainė',
      fr: 'Confirmation de message - Site web d\'Aurimas'
    };

    try {
      // Initialize EmailJS (you'll need to set up EmailJS account and get these IDs)
      const templateParams = {
        to_email: senderEmail,
        to_name: senderName,
        subject: confirmationSubject[currentLanguage],
        message: confirmationMessages[currentLanguage],
        from_name: 'Aurimas Website'
      };

      // For now, we'll use a simple approach - create a hidden form that submits to a confirmation service
      // This is a placeholder - in production you'd use EmailJS or similar service
      console.log('Sending confirmation to:', senderEmail);
      console.log('Confirmation message:', confirmationMessages[currentLanguage]);
      
      return true; // Assume success for now
    } catch (error) {
      console.error('Error sending confirmation:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert(t.contact.fillAllFields);
      return;
    }

    setIsSubmitting(true);
    setShowError(false);

    try {
      // Send main message to Aurimas via Formspree
      const response = await fetch('https://formspree.io/f/xzzvbzwg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
          _subject: `Contact Form: ${formData.subject}`,
        }),
      });

      if (response.ok) {
        // Send confirmation email to sender
        await sendConfirmationEmail(formData.email, formData.name);
        
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.contact.title}
          </h2>
          <p className="text-xl text-gray-800 mb-8">
            {t.contact.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t.contact.getInTouch}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t.contact.email}</h4>
                      <p className="text-gray-600">aurimas.nausedas@proton.me</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t.contact.location}</h4>
                      <p className="text-gray-600">Edinburgh, Scotland / Vilnius, Lithuania</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{t.contact.responseTime}</h4>
                      <p className="text-gray-600">{t.contact.responseTimeValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-yellow-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">{t.contact.sendMessage}</h3>
              
              {showSuccess && (
                <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <p className="text-green-800 font-medium">{t.contact.messageSent}</p>
                  <p className="text-green-600 text-sm mt-1">{t.contact.confirmationMessage}</p>
                </div>
              )}

              {showError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-800 font-medium">{t.contact.errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.contact.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors disabled:opacity-50"
                      placeholder={t.contact.yourName}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors disabled:opacity-50"
                      placeholder={t.contact.yourEmail}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.subject}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder={t.contact.subjectPlaceholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.message}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={6}
                    className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors disabled:opacity-50"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? t.contact.sending : t.contact.sendMessageButton}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};