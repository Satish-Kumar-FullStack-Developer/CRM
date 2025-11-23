const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../validators/validate');
const { createLeadValidator, updateLeadValidator } = require('../validators/validators');

// All routes require authentication
router.use(authenticate);

// Get all leads
router.get('/', authorize('leads', 'read'), leadController.getLeads);

// Get lead statistics
router.get('/statistics', authorize('leads', 'read'), leadController.getStatistics);

// Create lead
router.post('/', authorize('leads', 'create'), validate(createLeadValidator.body), leadController.createLead);

// Get lead by ID
router.get('/:id', authorize('leads', 'read'), leadController.getLeadById);

// Update lead
router.put('/:id', authorize('leads', 'update'), validate(updateLeadValidator.body), leadController.updateLead);

// Delete lead
router.delete('/:id', authorize('leads', 'delete'), leadController.deleteLead);

module.exports = router;
