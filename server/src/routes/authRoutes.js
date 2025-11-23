const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../validators/validate');
const { registerValidator, loginValidator, changePasswordValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/validators');

// Public routes
router.post('/register', authLimiter, validate(registerValidator.body), authController.register);
router.post('/login', authLimiter, validate(loginValidator.body), authController.login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordValidator.body), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordValidator.body), authController.resetPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, validate(changePasswordValidator.body), authController.changePassword);
router.delete('/delete-account', authenticate, authController.deleteAccount);

module.exports = router;
