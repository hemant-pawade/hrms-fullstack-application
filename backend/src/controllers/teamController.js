const { Team, Employee, EmployeeTeam, Log } = require('../models');

// Get all teams for the organisation
exports.listTeams = async (req, res, next) => {
  try {
    const teams = await Team.findAll({
      where: { organisationId: req.user.orgId },
      include: [{
        model: Employee,
        as: 'employees',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        through: { attributes: [] }
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

// Get single team
exports.getTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { 
        id, 
        organisationId: req.user.orgId 
      },
      include: [{
        model: Employee,
        as: 'employees',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
        through: { attributes: ['assignedAt'] }
      }]
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// Create team
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      });
    }

    const team = await Team.create({
      organisationId: req.user.orgId,
      name,
      description
    });

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'team_created',
      meta: { 
        teamId: team.id, 
        name 
      }
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// Update team
exports.updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { 
        id, 
        organisationId: req.user.orgId 
      }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Update fields
    if (name !== undefined) team.name = name;
    if (description !== undefined) team.description = description;

    await team.save();

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'team_updated',
      meta: { 
        teamId: team.id,
        updates: { name, description }
      }
    });

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// Delete team
exports.deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { 
        id, 
        organisationId: req.user.orgId 
      }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const teamData = { 
      id: team.id, 
      name: team.name 
    };

    await team.destroy();

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'team_deleted',
      meta: teamData
    });

    res.json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Assign employee(s) to team
exports.assignEmployees = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { employeeIds } = req.body; // Array of employee IDs

    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'employeeIds array is required'
      });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: { 
        id: teamId, 
        organisationId: req.user.orgId 
      }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify all employees belong to organisation
    const employees = await Employee.findAll({
      where: { 
        id: employeeIds,
        organisationId: req.user.orgId 
      }
    });

    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more employees not found'
      });
    }

    // Create assignments (ignore duplicates)
    const assignments = [];
    for (const employeeId of employeeIds) {
      const [assignment, created] = await EmployeeTeam.findOrCreate({
        where: { employeeId, teamId },
        defaults: { employeeId, teamId }
      });
      
      if (created) {
        assignments.push(assignment);
        
        // Log each assignment
        await Log.create({
          organisationId: req.user.orgId,
          userId: req.user.userId,
          action: 'employee_assigned_to_team',
          meta: { employeeId, teamId, teamName: team.name }
        });
      }
    }

    res.json({
      success: true,
      message: `${assignments.length} employee(s) assigned to team`,
      data: { assigned: assignments.length }
    });
  } catch (error) {
    next(error);
  }
};

// Unassign employee from team
exports.unassignEmployee = async (req, res, next) => {
  try {
    const { teamId, employeeId } = req.params;

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: { 
        id: teamId, 
        organisationId: req.user.orgId 
      }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify employee belongs to organisation
    const employee = await Employee.findOne({
      where: { 
        id: employeeId,
        organisationId: req.user.orgId 
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Remove assignment
    const deleted = await EmployeeTeam.destroy({
      where: { employeeId, teamId }
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_unassigned_from_team',
      meta: { employeeId, teamId, teamName: team.name }
    });

    res.json({
      success: true,
      message: 'Employee unassigned from team'
    });
  } catch (error) {
    next(error);
  }
};

// Get logs
exports.getLogs = async (req, res, next) => {
  try {
    const { limit = 100, action } = req.query;

    const where = { organisationId: req.user.orgId };
    if (action) {
      where.action = action;
    }

    const logs = await Log.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};
