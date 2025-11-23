const Joi = require('joi');

// User Validators
const registerValidator = {
  body: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    phone: Joi.string().optional(),
    department: Joi.string().valid('Sales', 'Marketing', 'Support', 'Management', 'Admin').optional(),
  }),
};

const loginValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const changePasswordValidator = {
  body: Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).max(50).required(),
  }),
};

const forgotPasswordValidator = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

const resetPasswordValidator = {
  body: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(6).max(50).required(),
  }),
};

// Lead Validators
const createLeadValidator = {
  body: Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    title: Joi.string().optional(),
    source: Joi.string()
      .valid('Website', 'Email', 'Phone', 'Referral', 'Trade Show', 'Social Media', 'Other')
      .optional(),
    status: Joi.string().optional(),
    description: Joi.string().optional(),
  }),
};

const updateLeadValidator = {
  body: Joi.object({
    firstName: Joi.string().min(2).optional(),
    lastName: Joi.string().min(2).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    status: Joi.string().valid('New', 'Contacted', 'Qualified', 'Unqualified', 'Lost').optional(),
    leadScore: Joi.number().min(0).max(100).optional(),
  }),
};

// Deal Validators
const createDealValidator = {
  body: Joi.object({
    title: Joi.string().required(),
    value: Joi.number().min(0).required(),
    currency: Joi.string().valid('USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD').optional(),
    stage: Joi.string().optional(),
    probability: Joi.number().min(0).max(100).optional(),
    closingDate: Joi.date().optional(),
    expectedCloseDate: Joi.date().optional(),
    description: Joi.string().optional(),
    owner: Joi.string().optional(),
    lead: Joi.string().optional(),
    status: Joi.string().optional(),
  }),
};

// Task Validators
const createTaskValidator = {
  body: Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('Call', 'Email', 'Meeting', 'Follow-up', 'Other').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'Low', 'Medium', 'High', 'Urgent').optional(),
    dueDate: Joi.date().optional(),
    description: Joi.string().optional(),
    assignedTo: Joi.string().optional(),
    assignedBy: Joi.string().optional(),
    status: Joi.string().optional(),
  }),
};

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  createLeadValidator,
  updateLeadValidator,
  createDealValidator,
  createTaskValidator,
};
