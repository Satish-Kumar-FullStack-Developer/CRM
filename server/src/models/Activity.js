const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Call', 'Email', 'Meeting', 'Note', 'Task', 'Deal Update', 'Lead Update'],
      required: true,
    },
    subject: String,
    description: String,
    relatedTo: {
      type: String,
      enum: ['Lead', 'Deal', 'Contact', 'Task'],
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    duration: Number,
    outcome: String,
    nextSteps: String,
    attachments: [
      {
        url: String,
        fileName: String,
      },
    ],
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', activitySchema);
