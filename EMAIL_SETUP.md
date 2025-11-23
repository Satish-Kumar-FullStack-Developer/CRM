# Email Configuration Guide for CRM System

This guide explains how to set up email functionality for the forgot password feature.

## Overview

The CRM System uses Nodemailer for sending emails. You have two options:

1. **Gmail SMTP** (Easy - Free)
2. **SendGrid** (Professional - Recommended for production)
3. **Custom SMTP** (Any email service)

---

## Option 1: Gmail SMTP (Easiest)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account (myaccount.google.com)
2. Click "Security" in the left menu
3. Enable "2-Step Verification"

### Step 2: Create App Password
1. Go to Google Account → Security
2. Scroll to "App passwords" (appears only after enabling 2FA)
3. Select "Mail" and "Windows Computer" (or your device)
4. Generate a 16-character password
5. Copy this password

### Step 3: Update .env file
Create `server/.env` file with:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=CRM System
FRONTEND_URL=http://localhost:3000
```

**Note:** Use the 16-character app password (without spaces) from Step 2.

### Step 4: Test Email Setup
1. Start the server: `npm run dev` (in server folder)
2. Go to login page
3. Click "Forgot password?"
4. Enter your Gmail address
5. Check your inbox for the reset email

---

## Option 2: SendGrid (Recommended for Production)

### Step 1: Create SendGrid Account
1. Sign up at https://sendgrid.com
2. Create a free account
3. Go to Settings → API Keys
4. Create a new API key
5. Copy the API key

### Step 2: Update .env file
Create `server/.env` file with:

```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_api_key_here
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=CRM System
FRONTEND_URL=http://localhost:3000
```

### Step 3: Update emailService.js (if using SendGrid)
The current setup uses SMTP. For SendGrid, you would use their Node.js library, but for now, SMTP configuration works fine with SendGrid's SMTP relay.

---

## Option 3: Other SMTP Services

Services like Mailgun, Postmark, or AWS SES work similarly. Get their SMTP details and update:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-email
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=CRM System
FRONTEND_URL=http://localhost:3000
```

---

## Password Reset Flow

### User Side:
1. Click "Forgot password?" on login page
2. Enter email address
3. Click "Send Reset Link"
4. Email arrives with reset link
5. Click link and create new password

### Backend Process:
1. Generate secure reset token
2. Hash token and store in database (expires in 1 hour)
3. Create reset URL with token
4. Send email with reset link
5. User clicks link → token validated → password updated

---

## Reset Password Page (Frontend)

Create `client/src/pages/ResetPasswordPage.js`:

```javascript
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, Button, Input } from '../components/UI';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Invalid reset link');
      navigate('/login');
      return;
    }

    if (!newPassword) {
      toast.error('Password is required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Card style={{ maxWidth: '400px', width: '90%' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#1f2937' }}>Create New Password</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '14px' }}>
          Enter your new password below
        </p>

        <form onSubmit={handleResetPassword}>
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
```

### Add route to App.js:
```javascript
import ResetPasswordPage from './pages/ResetPasswordPage';

// In Routes:
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

---

## Troubleshooting

### "Email send error"
- Check SMTP credentials in .env
- For Gmail: Ensure app-specific password is used (not regular password)
- Check firewall/antivirus blocking port 587

### "Invalid or expired reset token"
- Token expires after 1 hour
- Request a new reset link if it's been longer than 1 hour
- Ensure FRONTEND_URL in .env is correct

### No email received
- Check spam/junk folder
- Verify SMTP credentials
- Check server logs for error messages
- Ensure MongoDB is running and accessible

### SMTP_HOST is undefined
- Create `.env` file in server folder
- Copy content from `.env.example`
- Fill in your SMTP credentials
- Restart server after changes

---

## Email Templates

The system uses HTML email templates. You can customize them in:
- `server/src/services/emailService.js` → `sendPasswordResetEmail()` method

Current template includes:
- Gradient header
- Welcome message
- Reset button
- Security notice
- 1-hour expiration warning

---

## Production Deployment

For production:

1. **Use SendGrid or similar service** (more reliable)
2. **Generate strong secrets** for JWT and encryption
3. **Use domain email** (noreply@yourdomain.com) instead of Gmail
4. **Enable HTTPS** - update FRONTEND_URL to use https://
5. **Monitor email delivery** - check sendgrid/mailgun logs
6. **Set up reply-to address** for user inquiries

---

## Security Notes

- Reset tokens are hashed before storage (not plaintext)
- Tokens expire after 1 hour
- Each reset request generates a new token
- Frontend password reset link includes token as URL parameter
- Always use HTTPS in production
- Never log sensitive data like tokens or passwords

---

## Support

For issues:
1. Check server logs: `tail -f server/logs/app.log`
2. Verify all .env variables are set
3. Test SMTP connection: `telnet smtp.gmail.com 587`
4. Check MongoDB connection: Connect to your DB and verify
