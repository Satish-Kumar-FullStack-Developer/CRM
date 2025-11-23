require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/crm-system',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  SMTP: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from_email: process.env.SMTP_FROM_EMAIL,
    from_name: process.env.SMTP_FROM_NAME,
  },
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  AWS: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
  },
};
