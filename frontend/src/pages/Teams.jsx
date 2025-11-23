import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Search, UserPlus, X } from 'lucide-react';
import { teamAPI, employeeAPI } from '../services/api';
import TeamForm from '../components/TeamForm';
import toast from 'react-hot-toast';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTeam, setAssignTeam] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, employeesRes] = await Promise.all([
        teamAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setTeams(teamsRes.data.data);
      setEmployees(employeesRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTeam(null);
    setShowForm(true);
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedTeam) {
        await teamAPI.update(selectedTeam.id, formData);
        toast.success('Team updated successfully');
      } else {
        await teamAPI.create(formData);
        toast.success('Team created successfully');
      }
      setShowForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete team "${name}"?`)) {
      return;
    }

    try {
      await teamAPI.delete(id);
      toast.success('Team deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete team');
    }
  };

  const handleAssignClick = (team) => {
    setAssignTeam(team);
    setSelectedEmployees([]);
    setShowAssignModal(true);
  };

  const handleAssignEmployees = async () => {
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    try {
      await teamAPI.assignEmployees(assignTeam.id, selectedEmployees);
      toast.success(`${selectedEmployees.length} employee(s) assigned to team`);
      setShowAssignModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to assign employees');
    }
  };

  const handleUnassign = async (teamId, employeeId, employeeName) => {
    if (!window.confirm(`Remove ${employeeName} from this team?`)) {
      return;
    }

    try {
      await teamAPI.unassignEmployee(teamId, employeeId);
      toast.success('Employee removed from team');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove employee');
    }
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="card skeleton h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
          <p className="text-gray-600 mt-1">{teams.length} total teams</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Team List */}
      {filteredTeams.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No teams found' : 'No teams yet'}
          </p>
          {!searchTerm && (
            <button
              onClick={handleCreate}
              className="btn btn-primary mt-4 inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Team</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card"
            >
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        {team.employees?.length || 0} member{team.employees?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  {team.description && (
                    <p className="text-gray-600 text-sm ml-15">{team.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAssignClick(team)}
                    className="btn btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Assign</span>
                  </button>
                  <button
                    onClick={() => handleEdit(team)}
                    className="btn btn-secondary p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id, team.name)}
                    className="btn btn-danger p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Team Members */}
              {team.employees && team.employees.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {team.employees.map(employee => (
                      <div
                        key={employee.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-900 truncate">
                            {employee.firstName} {employee.lastName}
                          </span>
                        </div>
                        <button
                          onClick={() => handleUnassign(team.id, employee.id, `${employee.firstName} ${employee.lastName}`)}
                          className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                          title="Remove from team"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Team Form Modal */}
      {showForm && (
        <TeamForm
          team={selectedTeam}
          onSave={handleSave}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Assign Employees Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Assign Employees to {assignTeam?.name}
              </h2>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {employees.map(employee => {
                  const isAssigned = assignTeam?.employees?.some(e => e.id === employee.id);
                  const isSelected = selectedEmployees.includes(employee.id);
                  
                  return (
                    <label
                      key={employee.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isAssigned ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 
                        isSelected ? 'bg-primary-50 border-2 border-primary-500' : 
                        'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !isAssigned && toggleEmployeeSelection(employee.id)}
                        disabled={isAssigned}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {employee.firstName} {employee.lastName}
                          </p>
                          {employee.email && (
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          )}
                        </div>
                      </div>
                      {isAssigned && (
                        <span className="text-xs text-gray-500">Already assigned</span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {selectedEmployees.length} employee(s) selected
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignEmployees}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Assign Selected</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Teams;
