const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['task_assigned', 'task_due', 'deal_update', 'lead_assigned', 'reminder', 'mention', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: String,
    relatedTo: {
      type: String,
      enum: ['Lead', 'Deal', 'Task', 'User'],
    },
    relatedId: mongoose.Schema.Types.ObjectId,
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    action: {
      label: String,
      url: String,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
