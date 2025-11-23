import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from '../hooks/useForm';
import { loginSuccess } from '../redux/authSlice';
import authService from '../services/authService';
import { Card, Button, Input, Select } from '../components/UI';
import { toast } from 'react-toastify';

/**
 * Register Page
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { firstName: '', lastName: '', email: '', password: '', department: '' },
    async (formData) => {
      try {
        const response = await authService.register(formData);
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.token
        }));
        toast.success('Registration successful!');
        navigate('/');
      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';
        toast.error(message);
      }
    }
  );

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

      {/* Register Card */}
      <Card style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join CRM System</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="First Name"
            type="text"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
            placeholder="Enter first name"
            required
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
            placeholder="Enter last name"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="Enter email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter password (min 6 chars)"
            required
          />

          <Select
            label="Department"
            name="department"
            value={values.department}
            onChange={handleChange}
            error={errors.department}
            options={[
              { value: 'Sales', label: 'Sales' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Support', label: 'Support' },
              { value: 'Management', label: 'Management' },
            ]}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            loading={isSubmitting}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Create Account
          </Button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <a href="/login" style={styles.link}>
            Sign in
          </a>
        </p>
      </Card>
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
    maxWidth: '500px',
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
};

export default RegisterPage;
