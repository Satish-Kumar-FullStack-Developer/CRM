const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['Call', 'Email', 'Meeting', 'Follow-up', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    reminderTime: Date,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
    },
    relatedTo: {
      type: String,
      enum: ['Lead', 'Deal', 'Contact', 'General'],
      default: 'General',
    },
    relatedId: mongoose.Schema.Types.ObjectId,
    completedAt: Date,
    completedBy: String,
    notes: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    remindersSet: {
      type: Boolean,
      default: false,
    },
    attachments: [String],
  },
  { timestamps: true }
);

taskSchema.index({ assignedTo: 1, dueDate: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

module.exports = mongoose.model('Task', taskSchema);
