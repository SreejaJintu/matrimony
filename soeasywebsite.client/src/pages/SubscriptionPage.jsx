import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { AuthContext } from '../contexts/AuthContext';
import { api, session } from '../services/api';
import { MembershipLeadModal } from '../components/forms/MembershipLeadModal';
import { 
  ShieldCheck, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Lock,
  PhoneCall,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import './ProfileDetail.css';

export function SubscriptionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.fullName || session.getFullName() || '',
    mobileNumber: user?.mobileNumber || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || session.getFullName() || prev.name,
        email: user.email || prev.email,
        mobileNumber: user.mobileNumber || prev.mobileNumber,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (searchParams.get('modal') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobileNumber.trim()) {
      alert('Please provide your Name and Mobile Number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId: user?.userId || session.getUserId() || null,
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: formData.email ? formData.email.trim() : null,
        preferredPlan: '₹2,000 Standard Premium Plan (20 Profiles)',
      };

      await api.submitLead(payload);
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      alert(err.message || 'Failed to submit request. Please try again or call our support line.');
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
          <span className="pd-action-badge">Executive Assisted Membership</span>
          <h1 style={{ 
            fontFamily: "'Source Serif 4', 'Playfair Display', serif", 
            fontSize: '34px', 
            color: 'var(--dark-maroon, #4D0015)',
            margin: '8px 0 12px'
          }}>
            Unlock Full Verified Profiles
          </h1>
          <p style={{ color: 'var(--text-muted, #756A67)', fontSize: '15px', maxWidth: '580px', margin: '0 auto' }}>
            To protect member privacy and ensure genuine matrimonial alliances, profile access is activated through our dedicated relationship executives.
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
                Assisted matchmaking for individuals and families seeking verified alliances.
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary-maroon, #700019)', lineHeight: 1 }}>
                ₹2,000
              </div>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted, #756A67)' }}>Assisted One-time activation</span>
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
              <span><strong>Verified Profiles Only</strong> with KYC & background checks</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '500' }}>
              <div style={{ color: '#2E7D32' }}><Check size={18} /></div>
              <span><strong>Personal Relationship Manager</strong> assistance</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14.5px', fontWeight: '500' }}>
              <div style={{ color: '#2E7D32' }}><Check size={18} /></div>
              <span><strong>180 Days Validity</strong></span>
            </div>
          </div>

          {/* Executive Call Request Section */}
          <div style={{
            background: 'var(--cream, #FBF7F0)',
            borderRadius: '14px',
            padding: '28px',
            border: '1px solid var(--border, #E7DED5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: '#700019', color: '#FFF', borderRadius: '50%', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhoneCall size={16} />
              </div>
              <h3 style={{ fontFamily: "'Source Serif 4', serif", fontSize: '20px', color: 'var(--dark-maroon, #4D0015)', margin: 0 }}>
                Request Executive Call for Activation
              </h3>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--text-muted, #756A67)', margin: '0 0 20px', lineHeight: 1.5 }}>
              Submit your details below and our relationship executive will call you to verify your requirements, share suitable matches, and activate your 20-profile membership.
            </p>

            {submitted ? (
              <div style={{ background: '#E8F5E9', border: '1.5px solid #81C784', padding: '24px', borderRadius: '12px', color: '#1B5E20', textAlign: 'center' }}>
                <CheckCircle2 size={42} style={{ margin: '0 auto 12px', color: '#2E7D32' }} />
                <h4 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px' }}>Request Received Successfully!</h4>
                <p style={{ fontSize: '14px', color: '#2E7D32', maxWidth: '520px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                  Thank you, <strong>{formData.name}</strong>. Our executive will call you shortly on <strong>{formData.mobileNumber}</strong> to help activate your plan and answer any questions.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="pd-btn pd-btn-secondary"
                  style={{ width: 'auto', padding: '8px 20px', margin: '0 auto' }}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--dark-maroon, #4D0015)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border, #E7DED5)',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--dark-maroon, #4D0015)', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border, #E7DED5)',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--dark-maroon, #4D0015)', marginBottom: '6px' }}>
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid var(--border, #E7DED5)',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '6px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="pd-btn pd-btn-gold-action"
                    style={{ width: 'auto', padding: '13px 28px', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <UserCheck size={18} />
                    <span>{isSubmitting ? 'Submitting Request...' : 'Request Executive Call'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="pd-btn pd-btn-secondary"
                    style={{ width: 'auto', padding: '13px 20px', margin: 0 }}
                  >
                  </button>
                </div>
              </form>
            )}

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border, #E7DED5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '13px', color: 'var(--text-muted, #756A67)' }}>
              <span>Need immediate assistance?</span>
              <a 
                href="tel:+919847000000" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-maroon, #700019)', fontWeight: '700', textDecoration: 'none' }}
              >
                <PhoneCall size={14} />
                <span>Call Helpline: +91 98470 00000</span>
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', color: 'var(--text-muted, #756A67)', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#2E7D32" />
            <span>100% Executive Verified Profiles</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={16} color="#700019" />
            <span>Privacy & Contact Protected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall size={16} color="#C99A3D" />
            <span>Direct Helplines & Relationship Support</span>
          </div>
        </div>
      </main>

      {/* Reusable MembershipLeadModal component */}
      <MembershipLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

