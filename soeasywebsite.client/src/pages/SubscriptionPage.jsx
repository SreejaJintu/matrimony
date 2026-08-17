import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { AuthContext } from '../contexts/AuthContext';
import { api, session } from '../services/api';
import { 
  ShieldCheck, 
  Crown, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  CreditCard, 
  Lock,
  Clock,
  PhoneCall
} from 'lucide-react';
import './ProfileDetail.css';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [paymentRef, setPaymentRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!paymentRef.trim()) return;

    setIsSubmitting(true);
    try {
      const userId = session.getUserId();
      await api.submitPayment({
        userId: userId,
        paymentReference: paymentRef.trim(),
        membershipPlanId: 3,       // Premium plan
        amountPaid: 1999.00,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Payment submission error:', err);
      alert('Failed to submit payment reference. Please try again or contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pd-page">
      <Header />

      <main className="pd-container" style={{ maxWidth: '900px', paddingTop: '10px' }}>
        <div className="pd-back-nav">
          <button onClick={() => navigate(-1)} className="pd-back-btn">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="pd-action-badge">Exclusive Membership</span>
          <h1 style={{ 
            fontFamily: "'Source Serif 4', 'Playfair Display', serif", 
            fontSize: '34px', 
            color: 'var(--dark-maroon, #4D0015)',
            margin: '8px 0 12px'
          }}>
            Unlock Full Verified Profiles
          </h1>
          <p style={{ color: 'var(--text-muted, #756A67)', fontSize: '15px', maxWidth: '560px', margin: '0 auto' }}>
            Choose the official GSeven Matrimony membership to connect with prospective brides and grooms.
          </p>
        </div>

        {/* Membership Plan Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #D6B97A',
          boxShadow: '0 8px 32px rgba(112, 0, 25, 0.06)',
          padding: '40px',
          marginBottom: '36px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-14px',
            right: '32px',
            background: 'linear-gradient(135deg, #C99A3D 0%, #8C6215 100%)',
            color: '#FFFFFF',
            padding: '4px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Most Popular
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid var(--border, #E7DED5)', paddingBottom: '24px', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: '26px', color: 'var(--dark-maroon, #4D0015)', margin: '0 0 6px' }}>
                Standard Premium Plan
              </h2>
              <span style={{ color: 'var(--text-muted, #756A67)', fontSize: '14px' }}>
                Ideal for individuals and families seeking genuine matrimonial alliances.
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary-maroon, #700019)', lineHeight: 1 }}>
                ₹2,000
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #756A67)' }}>One-time payment</span>
            </div>
          </div>

          {/* Plan Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '500' }}>
              <div style={{ color: '#2E7D32' }}><Check size={18} /></div>
              <span><strong>Unlock 20 Full Profiles</strong> (Family, Contact & Preferences)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '500' }}>
              <div style={{ color: '#2E7D32' }}><Check size={18} /></div>
              <span><strong>Verified Profiles Only</strong> with KYC checks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '500' }}>
              <div style={{ color: '#2E7D32' }}><Check size={18} /></div>
              <span><strong>Send Express Interests</strong> directly</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '500' }}>
              <div style={{ color: '#2E7D32' }}><Check size={18} /></div>
              <span><strong>180 Days Validity</strong></span>
            </div>
          </div>

          {/* Payment Details & Submission Form */}
          <div style={{
            background: 'var(--cream, #FBF7F0)',
            borderRadius: '14px',
            padding: '24px',
            border: '1px solid var(--border, #E7DED5)'
          }}>
            <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: '18px', color: 'var(--dark-maroon, #4D0015)', margin: '0 0 12px' }}>
              Payment & Verification
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted, #756A67)', margin: '0 0 16px', lineHeight: 1.5 }}>
              Please transfer <strong>₹2,000</strong> via UPI or Bank Transfer, then submit your transaction reference ID below. Admin will approve your account and unlock your 20 profiles immediately upon verification.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', fontSize: '13.5px' }}>
              <div style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border, #E7DED5)' }}>
                <strong>UPI ID:</strong> soesymatrimony@okhdfcbank
              </div>
              <div style={{ background: '#FFFFFF', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border, #E7DED5)' }}>
                <strong>GPay / PhonePe:</strong> +91 98470 00000
              </div>
            </div>

            {submitted ? (
              <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '16px', borderRadius: '10px', color: '#1B5E20' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', marginBottom: '4px' }}>
                  <Check size={18} />
                  <span>Payment Details Submitted Successfully</span>
                </div>
                <p style={{ fontSize: '13px', margin: 0 }}>
                  Reference <strong>{paymentRef}</strong> has been sent to the admin team. Your 20-profile access will be activated upon confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Enter Transaction ID / UTR / Reference No."
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  required
                  style={{
                    flex: '1 1 260px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border, #E7DED5)',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !paymentRef.trim()}
                  className="pd-btn pd-btn-gold-action"
                  style={{ width: 'auto', padding: '12px 24px', margin: 0 }}
                >
                  <Sparkles size={16} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit for Approval'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Trust Badges Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', color: 'var(--text-muted, #756A67)', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#2E7D32" />
            <span>100% Secure Verification</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={16} color="#700019" />
            <span>Privacy Protected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall size={16} color="#C99A3D" />
            <span>Matrimonial Helpdesk Support</span>
          </div>
        </div>
      </main>
    </div>
  );
}
