const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

// Register organisation and admin user
exports.register = async (req, res, next) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    // Validation
    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: orgName, adminName, email, password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create organisation
    const organisation = await Organisation.create({ name: orgName });

    // Hash password and create user
    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      organisationId: organisation.id,
      email,
      passwordHash,
      name: adminName
    });

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        orgId: organisation.id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Log the action
    await Log.create({
      organisationId: organisation.id,
      userId: user.id,
      action: 'organisation_created',
      meta: { organisationId: organisation.id, organisationName: orgName }
    });

    res.status(201).json({
      success: true,
      message: 'Organisation and admin user created successfully',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          organisationId: organisation.id,
          organisationName: organisation.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user with organisation
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Organisation, as: 'organisation' }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        orgId: user.organisationId,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    // Log the action
    await Log.create({
      organisationId: user.organisationId,
      userId: user.id,
      action: 'user_login',
      meta: { email: user.email }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          organisationId: user.organisationId,
          organisationName: user.organisation.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    // Log the action
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action: 'user_logout',
      meta: { email: req.user.email }
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [{ model: Organisation, as: 'organisation' }],
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisationId: user.organisationId,
        organisationName: user.organisation.name
      }
    });
  } catch (error) {
    next(error);
  }
};
