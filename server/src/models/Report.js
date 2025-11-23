const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'Sales Pipeline',
        'Lead Conversion',
        'Deal Analytics',
        'Team Performance',
        'Revenue Forecast',
        'Activity Report',
      ],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    dateRange: {
      startDate: Date,
      endDate: Date,
    },
    filters: mongoose.Schema.Types.Mixed,
    metrics: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed,
    charts: [
      {
        type: String,
        title: String,
        data: mongoose.Schema.Types.Mixed,
      },
    ],
    schedule: {
      frequency: {
        type: String,
        enum: ['Once', 'Daily', 'Weekly', 'Monthly'],
      },
      recipients: [String],
      lastGenerated: Date,
      nextGeneration: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
