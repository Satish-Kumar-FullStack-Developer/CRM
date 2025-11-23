const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All routes require authentication
router.use(authenticate);

// Dashboard analytics
router.get('/dashboard', authorize('reports', 'read'), reportController.getDashboardAnalytics);

// Sales pipeline report
router.get('/pipeline', authorize('reports', 'read'), reportController.getSalesPipelineReport);

// Lead conversion report
router.get('/conversion', authorize('reports', 'read'), reportController.getLeadConversionReport);

// Deal analytics report
router.get('/deals', authorize('reports', 'read'), reportController.getDealAnalyticsReport);

// Team performance report
router.get('/team', authorize('reports', 'read'), reportController.getTeamPerformanceReport);

module.exports = router;
