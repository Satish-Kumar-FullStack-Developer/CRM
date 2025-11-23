import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Validate token exists
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/login');
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPasswordWithToken(token, password);
      
      if (response.data.success) {
        toast.success('Password reset successfully! You can now login with your new password.');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to reset password';
      toast.error(message);
      
      // If token is invalid/expired, redirect to login
      if (message.includes('Invalid') || message.includes('expired')) {
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 flex items-center justify-center p-4">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 p-3 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Reset Password</h1>
            <p className="text-purple-100 text-sm">Create a new password for your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  placeholder="Enter new password"
                  className={`w-full px-4 py-3 pr-10 border-2 rounded-lg transition-all focus:outline-none ${
                    errors.password
                      ? 'border-red-500 focus:border-red-600 bg-red-50'
                      : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.password}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Minimum 6 characters required
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: '' });
                    }
                  }}
                  placeholder="Confirm new password"
                  className={`w-full px-4 py-3 pr-10 border-2 rounded-lg transition-all focus:outline-none ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-600 bg-red-50'
                      : 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertCircle size={16} className="mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Use a strong password with a mix of uppercase, lowercase, numbers, and symbols.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Resetting Password...
                </>
              ) : (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Reset Password
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Back to Login
                </button>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our support team at support@crm.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
