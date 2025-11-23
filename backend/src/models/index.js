const sequelize = require('../db');
const Organisation = require('./organisation');
const User = require('./user');
const Employee = require('./employee');
const Team = require('./team');
const EmployeeTeam = require('./employeeTeam');
const Log = require('./log');

// Define associations
Organisation.hasMany(User, { foreignKey: 'organisationId', as: 'users' });
User.belongsTo(Organisation, { foreignKey: 'organisationId', as: 'organisation' });

Organisation.hasMany(Employee, { foreignKey: 'organisationId', as: 'employees' });
Employee.belongsTo(Organisation, { foreignKey: 'organisationId', as: 'organisation' });

Organisation.hasMany(Team, { foreignKey: 'organisationId', as: 'teams' });
Team.belongsTo(Organisation, { foreignKey: 'organisationId', as: 'organisation' });

// Many-to-many relationship between Employee and Team
Employee.belongsToMany(Team, { 
  through: EmployeeTeam, 
  foreignKey: 'employeeId', 
  otherKey: 'teamId',
  as: 'teams'
});

Team.belongsToMany(Employee, { 
  through: EmployeeTeam, 
  foreignKey: 'teamId', 
  otherKey: 'employeeId',
  as: 'employees'
});

module.exports = {
  sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log
};
