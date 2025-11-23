import React from 'react';
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

  return (
    <div style={styles.container}>
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
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
  },
  title: {
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#1f2937',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#6b7280',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default LoginPage;
