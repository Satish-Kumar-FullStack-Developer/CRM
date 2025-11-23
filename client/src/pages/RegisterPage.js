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
    backgroundColor: '#f3f4f6',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '500px',
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

export default RegisterPage;
