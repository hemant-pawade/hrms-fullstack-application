const { Employee, Team, Log } = require('../models');

// Get all employees for the organisation
exports.listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      where: { organisationId: req.user.orgId },
      include: [{
        model: Team,
        as: 'teams',
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// Get single employee
exports.getEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { 
        id, 
        organisationId: req.user.orgId 
      },
      include: [{
        model: Team,
        as: 'teams',
        attributes: ['id', 'name', 'description'],
        through: { attributes: ['assignedAt'] }
      }]
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Create employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    const employee = await Employee.create({
      organisationId: req.user.orgId,
      firstName,
      lastName,
      email,
      phone
    });

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_created',
      meta: { 
        employeeId: employee.id, 
        firstName, 
        lastName 
      }
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone } = req.body;

    const employee = await Employee.findOne({
      where: { 
        id, 
        organisationId: req.user.orgId 
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update fields
    if (firstName !== undefined) employee.firstName = firstName;
    if (lastName !== undefined) employee.lastName = lastName;
    if (email !== undefined) employee.email = email;
    if (phone !== undefined) employee.phone = phone;

    await employee.save();

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_updated',
      meta: { 
        employeeId: employee.id,
        updates: { firstName, lastName, email, phone }
      }
    });

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { 
        id, 
        organisationId: req.user.orgId 
      }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const employeeData = { 
      id: employee.id, 
      firstName: employee.firstName, 
      lastName: employee.lastName 
    };

    await employee.destroy();

    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'employee_deleted',
      meta: employeeData
    });

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
