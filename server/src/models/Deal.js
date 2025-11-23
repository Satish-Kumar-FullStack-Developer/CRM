const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
    },
    description: String,
    value: {
      type: Number,
      required: [true, 'Deal value is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    },
    stage: {
      type: String,
      enum: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      default: 'Prospecting',
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    expectedCloseDate: Date,
    actualCloseDate: Date,
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    contact: {
      name: String,
      email: String,
      phone: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Won', 'Lost', 'Stuck'],
      default: 'Active',
    },
    reason: String,
    products: [
      {
        productId: String,
        quantity: Number,
        price: Number,
      },
    ],
    customFields: mongoose.Schema.Types.Mixed,
    attachments: [
      {
        url: String,
        fileName: String,
        uploadedAt: Date,
      },
    ],
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
    ],
  },
  { timestamps: true }
);

dealSchema.index({ stage: 1 });
dealSchema.index({ owner: 1 });
dealSchema.index({ lead: 1 });

module.exports = mongoose.model('Deal', dealSchema);
