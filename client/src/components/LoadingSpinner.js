import React from 'react';

/**
 * Loading Spinner Component
 */
const LoadingSpinner = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60,
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.spinner, width: sizeMap[size], height: sizeMap[size] }} />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  spinner: {
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add animation to global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);

export default LoadingSpinner;
