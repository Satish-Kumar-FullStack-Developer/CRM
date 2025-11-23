const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      unique: true,
      enum: ['Admin', 'Manager', 'Sales Rep', 'Support Agent', 'Viewer'],
    },
    description: String,
    permissions: {
      leads: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      deals: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      tasks: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      reports: {
        read: Boolean,
        export: Boolean,
      },
      users: {
        create: Boolean,
        read: Boolean,
        update: Boolean,
        delete: Boolean,
      },
      settings: {
        manage: Boolean,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
