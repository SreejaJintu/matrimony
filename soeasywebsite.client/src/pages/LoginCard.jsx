import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { useAdminAuth } from '../admin/context/AdminAuthContext';

export function LoginCard() {
  const [activeTab, setActiveTab] = useState('member'); // 'member' or 'admin'
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const { login: loginMember } = useContext(AuthContext);
  const { login: loginAdmin } = useAdminAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!emailOrMobile) {
      newErrors.emailOrMobile = 'Please enter your mobile number or email.';
    }
    if (!password) {
      newErrors.password = 'Please enter your password.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const userName = emailOrMobile.trim();

      if (activeTab === 'admin') {
        await loginAdmin(userName, password);
        navigate('/admin/dashboard', { replace: true });
      } else {
        await loginMember(userName, password);
        navigate('/matches', { replace: true });
      }
    } catch (err) {
      // Handle login errors from the AuthContext/API
      setLoginError(err.message || 'Invalid mobile number/email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-right-panel">
      <div className="login-card-header">
        <h2>Login to Your Account</h2>
        <p>Welcome back! Please login to continue</p>
      </div>

      <div className="login-tabs">
        <button
          type="button"
          className={`login-tab-button ${activeTab === 'member' ? 'active' : ''}`}
          onClick={() => setActiveTab('member')}
        >
          <User size={18} /> Member Login
        </button>
        <button
          type="button"
          className={`login-tab-button ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <Shield size={18} /> Admin Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {loginError && <p className="login-error-message" style={{ textAlign: 'center', marginBottom: '20px' }}>{loginError}</p>}

        <div className="login-form-group">
          <label htmlFor="emailOrMobile" className="login-form-label">
            Mobile Number / Email ID
          </label>
          <div className="login-input-wrapper">
            <User size={20} className="input-icon" />
            <input
              type="text"
              id="emailOrMobile"
              placeholder="Enter mobile number or email"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              className={errors.emailOrMobile ? 'is-error' : ''}
            />
          </div>
          {errors.emailOrMobile && <p className="login-error-message">{errors.emailOrMobile}</p>}
        </div>

        <div className="login-form-group">
          <label htmlFor="password" className="login-form-label">
            Password
          </label>
          <div className="login-input-wrapper">
            <Lock size={20} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'is-error' : ''}
            />
            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="login-error-message">{errors.password}</p>}
        </div>

        <div className="login-options">
          <label className="login-remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="login-forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Logging in...
            </>
          ) : (
            <>
              Login <ArrowRight size={20} />
            </>
          )}
          
        </button>
      </form>

      <p className="login-create-account">
        New to Soesy Matrimony? <Link to="/register">Create Account</Link>
      </p>
    </div>
  );
}
