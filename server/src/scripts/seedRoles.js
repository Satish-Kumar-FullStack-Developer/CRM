const mongoose = require('mongoose');
const Role = require('../models/Role');
const config = require('../config/config');
const logger = require('../utils/logger');

const rolesData = [
  {
    name: 'Admin',
    description: 'Administrator with full access to all resources',
    permissions: {
      leads: { create: true, read: true, update: true, delete: true },
      deals: { create: true, read: true, update: true, delete: true },
      tasks: { create: true, read: true, update: true, delete: true },
      reports: { read: true, export: true },
      users: { create: true, read: true, update: true, delete: true },
      settings: { manage: true },
    },
  },
  {
    name: 'Manager',
    description: 'Manager with access to most resources',
    permissions: {
      leads: { create: true, read: true, update: true, delete: true },
      deals: { create: true, read: true, update: true, delete: true },
      tasks: { create: true, read: true, update: true, delete: true },
      reports: { read: true, export: true },
      users: { create: true, read: true, update: true, delete: false },
      settings: { manage: false },
    },
  },
  {
    name: 'Sales Rep',
    description: 'Sales representative with access to leads, deals, and tasks',
    permissions: {
      leads: { create: true, read: true, update: true, delete: false },
      deals: { create: true, read: true, update: true, delete: false },
      tasks: { create: true, read: true, update: true, delete: false },
      reports: { read: true, export: false },
      users: { create: false, read: false, update: false, delete: false },
      settings: { manage: false },
    },
  },
  {
    name: 'Support Agent',
    description: 'Support agent with access to tasks and limited leads access',
    permissions: {
      leads: { create: false, read: true, update: false, delete: false },
      deals: { create: false, read: true, update: false, delete: false },
      tasks: { create: true, read: true, update: true, delete: false },
      reports: { read: true, export: false },
      users: { create: false, read: false, update: false, delete: false },
      settings: { manage: false },
    },
  },
  {
    name: 'Viewer',
    description: 'Viewer with read-only access to all resources',
    permissions: {
      leads: { create: false, read: true, update: false, delete: false },
      deals: { create: false, read: true, update: false, delete: false },
      tasks: { create: false, read: true, update: false, delete: false },
      reports: { read: true, export: false },
      users: { create: false, read: true, update: false, delete: false },
      settings: { manage: false },
    },
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
    });
    logger.info('Connected to MongoDB for seeding');

    // Clear existing roles
    await Role.deleteMany({});
    logger.info('Cleared existing roles');

    // Insert new roles
    const createdRoles = await Role.insertMany(rolesData);
    logger.info(`Successfully seeded ${createdRoles.length} roles`);

    rolesData.forEach((role, index) => {
      logger.info(`✓ Created role: ${role.name}`);
    });

    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding roles:', error);
    process.exit(1);
  }
};

seedRoles();
