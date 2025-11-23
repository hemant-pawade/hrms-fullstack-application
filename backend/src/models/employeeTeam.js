const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'employee_id',
    references: {
      model: 'employees',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'team_id',
    references: {
      model: 'teams',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'assigned_at'
  }
}, {
  tableName: 'employee_teams',
  timestamps: false
});

module.exports = EmployeeTeam;
