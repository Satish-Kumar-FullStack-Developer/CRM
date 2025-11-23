// Validation utilities
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const regex = /^[0-9\-\+\(\)\s]*$/;
  return regex.test(phone);
};

export const validateFormData = (data, rules) => {
  const errors = {};
  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const rule = rules[field];

    if (rule.required && !value) {
      errors[field] = `${field} is required`;
    } else if (rule.type === 'email' && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    } else if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }
  });

  return errors;
};
