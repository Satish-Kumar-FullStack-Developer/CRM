const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../validators/validate');
const { registerValidator, loginValidator } = require('../validators/validators');

// Public routes
router.post('/register', authLimiter, validate(registerValidator.body), authController.register);
router.post('/login', authLimiter, validate(loginValidator.body), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;
