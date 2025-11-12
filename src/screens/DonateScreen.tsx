import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { colors } from '../utils/theme';
import './DonateScreen.css';

const DonateScreen: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    message: '',
    receiptFile: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, receiptFile: e.target.files![0] }));
    }
  };

  const handleSubmitReceipt = () => {
    if (!formData.fullName || !formData.email || !formData.amount) {
      window.alert('Error\nPlease fill in all required fields.');
      return;
    }
    window.alert('Success\nThank you for your donation!');
  };

  const openWhatsApp = () => {
    const phoneNumber = '+233558415813';
    const message = 'Hello! I need help with my donation receipt.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      window.alert(`Copied\n${text} copied to clipboard`);
    } catch (err) {
      window.alert(`Copied\n${text}`);
    }
  };

  return (
    <div className="donate-container">
      <div className="donate-header">
        <h1 className="donate-header-title">Donate</h1>
        <p className="donate-header-subtitle">Support our mission and make a difference</p>
      </div>

      {/* Mobile Money Section */}
      <div className="donate-section">
        <h2 className="donate-section-title">Donate via Mobile Money (Ghana)</h2>
        <p className="donate-section-subtitle">Support our mission and make a difference</p>
        
        {/* MTN */}
        <div className="donate-payment-card">
          <div className="donate-payment-header">
            <div className="donate-payment-icon" style={{ backgroundColor: '#FFC107' }}>
              <span>MTN</span>
            </div>
            <h3 className="donate-payment-title">MTN Mobile Money</h3>
          </div>
          <div className="donate-payment-details">
            <div className="donate-payment-row">
              <span className="donate-payment-label">Number:</span>
              <button className="donate-payment-value-button" onClick={() => copyToClipboard('0542872101')}>
                0542872101
              </button>
            </div>
            <div className="donate-payment-row">
              <span className="donate-payment-label">Name:</span>
              <span className="donate-payment-value">IYISHATU AWUDU</span>
            </div>
          </div>
        </div>

        {/* Airtel/Tigo */}
        <div className="donate-payment-card">
          <div className="donate-payment-header">
            <div className="donate-payment-icon" style={{ backgroundColor: '#E30613' }}>
              <span>AT</span>
            </div>
            <h3 className="donate-payment-title">Airtel/Tigo</h3>
          </div>
          <div className="donate-payment-details">
            <div className="donate-payment-row">
              <span className="donate-payment-label">Number:</span>
              <button className="donate-payment-value-button" onClick={() => copyToClipboard('0268856620')}>
                0268856620
              </button>
            </div>
            <div className="donate-payment-row">
              <span className="donate-payment-label">Name:</span>
              <span className="donate-payment-value">IYISHATU AWUDU</span>
            </div>
          </div>
        </div>

        <div className="donate-reference-card">
          <span className="donate-reference-label">Reference:</span>
          <button className="donate-reference-value-button" onClick={() => copyToClipboard('Tijaniya App Support')}>
            Tijaniya App Support
          </button>
        </div>
      </div>

      {/* SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX Section */}
      <div className="donate-section">
        <h2 className="donate-section-title">SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX</h2>
        <p className="donate-section-subtitle">Supporting educational development and Islamic learning</p>
        
        <div className="donate-image-container">
          <img 
            src="/assets/images/SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX1.jpg" 
            alt="Educational Complex 1"
            className="donate-educational-image"
          />
        </div>
        
        <div className="donate-image-container">
          <img 
            src="/assets/images/SHEIKH ABDULLAHI MAIKANO EDUCATIONAL COMPLEX2.jpg" 
            alt="Educational Complex 2"
            className="donate-educational-image"
          />
        </div>
      </div>

      {/* Procedure to Donate Section */}
      <div className="donate-section">
        <h2 className="donate-section-title">Procedure to Donate</h2>
        <p className="donate-section-subtitle">Follow these simple steps to make your donation</p>
        
        <div className="donate-image-container">
          <img 
            src="/assets/images/proceedure.jpg" 
            alt="Donation Procedure"
            className="donate-procedure-image"
          />
        </div>
      </div>

      {/* Bank Account Details Section */}
      <div className="donate-section">
        <h2 className="donate-section-title">Bank Account Details</h2>
        <p className="donate-section-subtitle">Alternative banking options for your donations</p>
        
        <div className="donate-image-container">
          <img 
            src="/assets/images/bankaccount.jpg" 
            alt="Bank Account Details"
            className="donate-bank-image"
          />
        </div>
      </div>

      {/* Help Section */}
      <div className="donate-section">
        <div className="donate-help-card">
          <span className="donate-help-icon">❓</span>
          <div className="donate-help-content">
            <h3 className="donate-help-title">Need Help?</h3>
            <p className="donate-help-subtitle">WhatsApp us:</p>
            <button className="donate-help-number" onClick={openWhatsApp}>
              +233 558415813
            </button>
            <p className="donate-help-note">After payment, upload your receipt (PDF/JPG) or contact us via WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Receipt Submission Form */}
      <div className="donate-section">
        <h2 className="donate-section-title">Submit Payment Receipt</h2>
        <p className="donate-section-subtitle">Upload your payment receipt to help us track your donation</p>
        
        <div className="donate-form-card">
          <div className="donate-input-group">
            <label className="donate-input-label">Full Name *</label>
            <input
              type="text"
              className="donate-input"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

          <div className="donate-input-group">
            <label className="donate-input-label">Email *</label>
            <input
              type="email"
              className="donate-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="donate-input-group">
            <label className="donate-input-label">Phone Number</label>
            <input
              type="tel"
              className="donate-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div className="donate-input-group">
            <label className="donate-input-label">Amount Donated (GHS) *</label>
            <input
              type="number"
              className="donate-input"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
            />
          </div>

          <div className="donate-input-group">
            <label className="donate-input-label">Payment Receipt *</label>
            <label className="donate-file-upload">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span>📤</span>
              <span className="donate-file-upload-text">
                {formData.receiptFile ? formData.receiptFile.name : 'No file chosen'}
              </span>
            </label>
            <p className="donate-file-upload-note">Accepted formats: PDF, JPG, PNG (Max 10MB)</p>
          </div>

          <div className="donate-input-group">
            <label className="donate-input-label">Message (Optional)</label>
            <textarea
              className="donate-textarea"
              placeholder="Any message for us..."
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
            />
          </div>

          <button className="donate-submit-button" onClick={handleSubmitReceipt}>
            <span>✓</span>
            <span>Submit Receipt</span>
          </button>

          <div className="donate-security-note">
            <span>🛡️</span>
            <p className="donate-security-text">Secure & Private - Your payment information is secure and will only be used to verify your donation. We never store sensitive financial data.</p>
          </div>
        </div>
      </div>

      <div style={{ height: '20px' }} />
    </div>
  );
};

export default DonateScreen;

