const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Email Service - Handles email operations
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP.host,
      port: config.SMTP.port,
      secure: false,
      auth: {
        user: config.SMTP.user,
        pass: config.SMTP.password,
      },
    });
  }

  /**
   * Send email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} html - Email HTML content
   * @returns {Promise}
   */
  async sendEmail(to, subject, html) {
    try {
      const mailOptions = {
        from: `${config.SMTP.from_name} <${config.SMTP.from_email}>`,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email send error:', error);
      throw error;
    }
  }

  /**
   * Send reminder email
   * @param {object} task - Task object
   * @param {object} user - User object
   */
  async sendTaskReminder(task, user) {
    const html = `
      <h2>Task Reminder</h2>
      <p>Hi ${user.firstName},</p>
      <p>You have a task due: <strong>${task.title}</strong></p>
      <p>Due Date: ${task.dueDate.toDateString()}</p>
      <p>Priority: ${task.priority}</p>
    `;

    return this.sendEmail(user.email, `Task Reminder: ${task.title}`, html);
  }

  /**
   * Send deal notification email
   * @param {string} email - Recipient email
   * @param {object} deal - Deal object
   * @param {string} action - Action type (created, updated, closed)
   */
  async sendDealNotification(email, deal, action) {
    const html = `
      <h2>Deal ${action}</h2>
      <p>Deal: <strong>${deal.title}</strong></p>
      <p>Value: ${deal.currency} ${deal.value}</p>
      <p>Stage: ${deal.stage}</p>
      <p>Expected Close Date: ${deal.expectedCloseDate?.toDateString() || 'N/A'}</p>
    `;

    return this.sendEmail(email, `Deal ${action}: ${deal.title}`, html);
  }

  /**
   * Send lead notification email
   * @param {string} email - Recipient email
   * @param {object} lead - Lead object
   * @param {string} action - Action type
   */
  async sendLeadNotification(email, lead, action) {
    const html = `
      <h2>Lead ${action}</h2>
      <p>Lead: <strong>${lead.firstName} ${lead.lastName}</strong></p>
      <p>Email: ${lead.email}</p>
      <p>Company: ${lead.company || 'N/A'}</p>
      <p>Status: ${lead.status}</p>
    `;

    return this.sendEmail(email, `Lead ${action}: ${lead.firstName} ${lead.lastName}`, html);
  }

  /**
   * Send password reset email with token link
   * @param {string} email - User email
   * @param {string} resetLink - Password reset link with token
   */
  async sendPasswordResetEmail(email, resetLink) {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
        </div>
        
        <!-- Body -->
        <div style="background: #f9fafb; padding: 40px 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0; line-height: 1.6;">
            Hi there,
          </p>
          
          <p style="font-size: 15px; color: #6b7280; margin: 0 0 24px 0; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          
          <!-- Reset Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px; transition: transform 0.2s;">
              Reset Your Password
            </a>
          </div>

          <!-- Link Alternative -->
          <div style="background: #f3f4f6; padding: 16px; border-radius: 6px; margin: 20px 0; word-break: break-all;">
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">Or copy this link:</p>
            <a href="${resetLink}" style="color: #667eea; text-decoration: none; font-size: 13px;">
              ${resetLink}
            </a>
          </div>

          <!-- Security Notice -->
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
              <strong>🔒 Security Tip:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email. Your password will not change.
            </p>
          </div>

          <!-- Additional Info -->
          <p style="font-size: 13px; color: #9ca3af; margin: 30px 0 0 0; line-height: 1.6;">
            <strong>Need help?</strong> If you're having trouble resetting your password or didn't request this, please contact our support team.
          </p>

          <!-- Footer -->
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              © 2025 CRM System. All rights reserved.
            </p>
            <p style="font-size: 11px; color: #d1d5db; margin: 8px 0 0 0;">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail(email, 'Reset Your Password - CRM System', html);
  }
}

module.exports = new EmailService();
