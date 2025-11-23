const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../validators/validate');
const { createTaskValidator } = require('../validators/validators');

// All routes require authentication
router.use(authenticate);

// Get all tasks
router.get('/', authorize('tasks', 'read'), taskController.getTasks);

// Get task statistics
router.get('/statistics', authorize('tasks', 'read'), taskController.getStatistics);

// Create task
router.post('/', authorize('tasks', 'create'), validate(createTaskValidator.body), taskController.createTask);

// Get task by ID
router.get('/:id', authorize('tasks', 'read'), taskController.getTaskById);

// Update task
router.put('/:id', authorize('tasks', 'update'), taskController.updateTask);

// Complete task
router.patch('/:id/complete', authorize('tasks', 'update'), taskController.completeTask);

// Add note to task
router.post('/:id/notes', authorize('tasks', 'update'), taskController.addNote);

// Delete task
router.delete('/:id', authorize('tasks', 'delete'), taskController.deleteTask);

module.exports = router;
