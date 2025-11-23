const Role = require('../models/Role');
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

const initializeRoles = async () => {
  try {
    // Check if roles already exist
    const existingRoles = await Role.countDocuments();
    
    if (existingRoles === 0) {
      logger.info('No roles found. Initializing default roles...');
      await Role.insertMany(rolesData);
      logger.info('✓ Default roles initialized successfully');
    } else {
      logger.info(`✓ ${existingRoles} roles already exist in database`);
    }
  } catch (error) {
    logger.error('Error initializing roles:', error.message);
    // Don't crash server if role initialization fails, just log it
  }
};

module.exports = { initializeRoles };
