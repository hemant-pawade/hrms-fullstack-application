require('dotenv').config();
const { sequelize, Organisation, User, Employee, Team, EmployeeTeam } = require('./models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seed...');

    // Sync database (force: true will drop existing tables)
    await sequelize.sync({ force: true });
    console.log('✓ Database tables created');

    // Create organisation
    const org = await Organisation.create({
      name: 'Demo Company Inc.'
    });
    console.log('✓ Organisation created:', org.name);

    // Create admin user
    const passwordHash = await User.hashPassword('admin123');
    const admin = await User.create({
      organisationId: org.id,
      email: 'admin@demo.com',
      passwordHash,
      name: 'Admin User'
    });
    console.log('✓ Admin user created:', admin.email);

    // Create employees
    const employees = await Employee.bulkCreate([
      {
        organisationId: org.id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@demo.com',
        phone: '+1-555-0101'
      },
      {
        organisationId: org.id,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@demo.com',
        phone: '+1-555-0102'
      },
      {
        organisationId: org.id,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@demo.com',
        phone: '+1-555-0103'
      },
      {
        organisationId: org.id,
        firstName: 'Alice',
        lastName: 'Williams',
        email: 'alice.williams@demo.com',
        phone: '+1-555-0104'
      },
      {
        organisationId: org.id,
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@demo.com',
        phone: '+1-555-0105'
      }
    ]);
    console.log(`✓ ${employees.length} employees created`);

    // Create teams
    const teams = await Team.bulkCreate([
      {
        organisationId: org.id,
        name: 'Engineering',
        description: 'Software development and technical operations'
      },
      {
        organisationId: org.id,
        name: 'Marketing',
        description: 'Brand management and customer outreach'
      },
      {
        organisationId: org.id,
        name: 'Sales',
        description: 'Revenue generation and client relations'
      }
    ]);
    console.log(`✓ ${teams.length} teams created`);

    // Assign employees to teams
    await EmployeeTeam.bulkCreate([
      { employeeId: employees[0].id, teamId: teams[0].id }, // John -> Engineering
      { employeeId: employees[1].id, teamId: teams[0].id }, // Jane -> Engineering
      { employeeId: employees[1].id, teamId: teams[1].id }, // Jane -> Marketing (multiple teams)
      { employeeId: employees[2].id, teamId: teams[2].id }, // Bob -> Sales
      { employeeId: employees[3].id, teamId: teams[1].id }, // Alice -> Marketing
      { employeeId: employees[4].id, teamId: teams[2].id }, // Charlie -> Sales
      { employeeId: employees[4].id, teamId: teams[0].id }  // Charlie -> Engineering (multiple teams)
    ]);
    console.log('✓ Employee-team assignments created');

    console.log('\n=== Seed Complete ===');
    console.log('Login credentials:');
    console.log('  Email: admin@demo.com');
    console.log('  Password: admin123');
    console.log('=====================\n');

    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
