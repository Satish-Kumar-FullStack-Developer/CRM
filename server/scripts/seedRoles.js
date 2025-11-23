/**
 * Database Seed Script - Initialize Roles with Permissions
 * Run this script to set up default roles and permissions
 * 
 * Usage: node scripts/seedRoles.js
 */

const mongoose = require('mongoose');
require('dotenv').config();
const config = require('../src/config/config');
const Role = require('../src/models/Role');
const User = require('../src/models/User');
const logger = require('../src/utils/logger');

// Connect to database
mongoose.connect(config.MONGODB_URI);

const defaultRoles = [
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
    isActive: true,
  },
  {
    name: 'Manager',
    description: 'Manager with read/write access to most resources',
    permissions: {
      leads: { create: true, read: true, update: true, delete: false },
      deals: { create: true, read: true, update: true, delete: false },
      tasks: { create: true, read: true, update: true, delete: false },
      reports: { read: true, export: true },
      users: { create: false, read: true, update: true, delete: false },
      settings: { manage: false },
    },
    isActive: true,
  },
  {
    name: 'Sales Rep',
    description: 'Sales representative with access to leads and deals',
    permissions: {
      leads: { create: true, read: true, update: true, delete: false },
      deals: { create: true, read: true, update: true, delete: false },
      tasks: { create: true, read: true, update: true, delete: false },
      reports: { read: true, export: false },
      users: { create: false, read: false, update: false, delete: false },
      settings: { manage: false },
    },
    isActive: true,
  },
  {
    name: 'Support Agent',
    description: 'Support agent with access to leads and tasks',
    permissions: {
      leads: { create: false, read: true, update: true, delete: false },
      deals: { create: false, read: true, update: false, delete: false },
      tasks: { create: true, read: true, update: true, delete: false },
      reports: { read: true, export: false },
      users: { create: false, read: false, update: false, delete: false },
      settings: { manage: false },
    },
    isActive: true,
  },
  {
    name: 'Viewer',
    description: 'Viewer with read-only access',
    permissions: {
      leads: { create: false, read: true, update: false, delete: false },
      deals: { create: false, read: true, update: false, delete: false },
      tasks: { create: false, read: true, update: false, delete: false },
      reports: { read: true, export: false },
      users: { create: false, read: false, update: false, delete: false },
      settings: { manage: false },
    },
    isActive: true,
  },
];

async function seedRoles() {
  try {
    console.log('🌱 Starting database seed for roles...\n');

    // Delete existing roles
    await Role.deleteMany({});
    console.log('✓ Cleared existing roles');

    // Create new roles
    const createdRoles = await Role.insertMany(defaultRoles);
    console.log(`✓ Created ${createdRoles.length} roles:`);
    createdRoles.forEach((role) => {
      console.log(`  - ${role.name}`);
    });

    // Update users without roles to have Sales Rep role
    const salesRepRole = await Role.findOne({ name: 'Sales Rep' });
    if (salesRepRole) {
      const updatedUsers = await User.updateMany(
        { role: null },
        { role: salesRepRole._id },
        { multi: true }
      );
      console.log(`\n✓ Assigned ${updatedUsers.modifiedCount} users to Sales Rep role`);
    }

    console.log('\n✅ Database seed completed successfully!\n');
    console.log('Available Roles and Permissions:');
    console.log('================================\n');

    const allRoles = await Role.find();
    allRoles.forEach((role) => {
      console.log(`📋 ${role.name}`);
      console.log(`   ${role.description}`);
      console.log(`   Permissions:`);
      Object.entries(role.permissions).forEach(([resource, actions]) => {
        const activeActions = Object.entries(actions)
          .filter(([_, allowed]) => allowed)
          .map(([action]) => action)
          .join(', ');
        if (activeActions) {
          console.log(`     • ${resource}: ${activeActions}`);
        }
      });
      console.log();
    });

    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedRoles();
