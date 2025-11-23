const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../validators/validate');
const { createDealValidator } = require('../validators/validators');

// All routes require authentication
router.use(authenticate);

// Get all deals
router.get('/', authorize('deals', 'read'), dealController.getDeals);

// Get pipeline summary
router.get('/pipeline/summary', authorize('deals', 'read'), dealController.getPipelineSummary);

// Create deal
router.post('/', authorize('deals', 'create'), validate(createDealValidator.body), dealController.createDeal);

// Get deal by ID
router.get('/:id', authorize('deals', 'read'), dealController.getDealById);

// Update deal
router.put('/:id', authorize('deals', 'update'), dealController.updateDeal);

// Delete deal
router.delete('/:id', authorize('deals', 'delete'), dealController.deleteDeal);

module.exports = router;
