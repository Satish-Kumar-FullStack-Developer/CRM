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
}

module.exports = new EmailService();
