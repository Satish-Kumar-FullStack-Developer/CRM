const mongoose = require('mongoose');

const emailIntegrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    provider: {
      type: String,
      enum: ['Gmail', 'Outlook', 'SendGrid', 'SMTP', 'Other'],
      required: true,
    },
    accessToken: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isConnected: {
      type: Boolean,
      default: true,
    },
    lastSyncDate: Date,
    syncFrequency: {
      type: String,
      enum: ['Real-time', 'Hourly', 'Daily', 'Manual'],
      default: 'Hourly',
    },
    settings: {
      autoSync: Boolean,
      trackingEnabled: Boolean,
      templateLibrary: [
        {
          name: String,
          content: String,
          subject: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmailIntegration', emailIntegrationSchema);
