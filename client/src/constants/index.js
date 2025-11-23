// API constants
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Lead status options
export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Unqualified', 'Lost'];

export const LEAD_SOURCES = ['Website', 'Email', 'Phone', 'Referral', 'Trade Show', 'Social Media', 'Other'];

// Deal constants
export const DEAL_STAGES = [
  'Prospecting',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export const DEAL_STATUSES = ['Active', 'Won', 'Lost', 'Stuck'];

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

// Task constants
export const TASK_TYPES = ['Call', 'Email', 'Meeting', 'Follow-up', 'Other'];

export const TASK_STATUSES = ['Open', 'In Progress', 'Completed', 'Cancelled'];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

// User roles
export const USER_ROLES = ['Admin', 'Manager', 'Sales Rep', 'Support Agent', 'Viewer'];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

// Time constants (in milliseconds)
export const NOTIFICATION_TOAST_DURATION = 3000;
export const API_TIMEOUT = 10000;
