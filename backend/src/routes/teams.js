const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', teamController.listTeams);
router.get('/:id', teamController.getTeam);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team assignments
router.post('/:teamId/assign', teamController.assignEmployees);
router.delete('/:teamId/unassign/:employeeId', teamController.unassignEmployee);

// Logs
router.get('/logs/all', teamController.getLogs);

module.exports = router;
