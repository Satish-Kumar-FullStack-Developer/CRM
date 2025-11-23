import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from '../hooks/useForm';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import authService from '../services/authService';
import { Card, Button, Input } from '../components/UI';
import { toast } from 'react-toastify';

/**
 * Login Page
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (formData) => {
      dispatch(loginStart());
      try {
        const response = await authService.login(formData.email, formData.password);
        dispatch(loginSuccess(response.data));
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        dispatch(loginFailure(message));
        toast.error(message);
      }
    }
  );

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResettingPassword(true);
    try {
      await authService.requestPasswordReset(forgotEmail);
      toast.success('Password reset link sent to your email!');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      
      {/* Background Pattern Layers */}
      <div style={styles.containerBefore}></div>
      <div style={styles.containerAfter}></div>

      {/* Login Card */}
      <Card style={styles.card}>
        <h1 style={styles.title}>CRM System</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={styles.forgotButton}
              onMouseEnter={(e) => {
                e.target.style.color = '#764ba2';
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#667eea';
                e.target.style.textDecoration = 'none';
              }}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            loading={isSubmitting}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Sign In
          </Button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <a href="/register" style={styles.link}>
            Sign up
          </a>
        </p>
      </Card>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <Card style={{ maxWidth: '450px', width: '95%', padding: '0' }}>
            {/* Modal Header */}
            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', padding: '32px', borderRadius: '14px 14px 0 0', position: 'relative' }}>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                }}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                ×
              </button>
              <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Reset Password</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>Enter your email address to receive a password reset link</p>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>We'll send a secure link to reset your password</p>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail('');
                    }}
                    style={{ padding: '12px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e5e7eb';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResettingPassword || !forgotEmail}
                    style={{ padding: '12px 16px', background: isResettingPassword || !forgotEmail ? '#d1d5db' : '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: isResettingPassword || !forgotEmail ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: isResettingPassword || !forgotEmail ? 0.6 : 1 }}
                    onMouseEnter={(e) => {
                      if (!isResettingPassword && forgotEmail) {
                        e.target.style.background = '#1d4ed8';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isResettingPassword && forgotEmail) {
                        e.target.style.background = '#2563eb';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {isResettingPassword ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255, 255, 255, 0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>

              {/* Help Text */}
              <div style={{ marginTop: '24px', padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                <p style={{ fontSize: '13px', color: '#1e40af', margin: '0' }}>
                  💡 <strong>Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
                </p>
              </div>
            </div>
          </Card>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
  },
  containerBefore: {
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    animation: 'float 20s linear infinite',
  },
  containerAfter: {
    position: 'absolute',
    bottom: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
    backgroundSize: '80px 80px',
    animation: 'float 25s linear infinite reverse',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem',
    position: 'relative',
    zIndex: 10,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#1f2937',
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem',
    fontSize: '14px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#6b7280',
    fontSize: '14px',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  forgotButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s',
    padding: '0',
  },
};

export default LoginPage;
