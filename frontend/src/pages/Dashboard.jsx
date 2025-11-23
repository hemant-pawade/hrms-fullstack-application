import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UsersRound, Activity, TrendingUp } from 'lucide-react';
import { employeeAPI, teamAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTeams: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [employeesRes, teamsRes, logsRes] = await Promise.all([
        employeeAPI.getAll(),
        teamAPI.getAll(),
        teamAPI.getLogs({ limit: 5 })
      ]);

      setStats({
        totalEmployees: employeesRes.data.data.length,
        totalTeams: teamsRes.data.data.length,
        recentActivity: logsRes.data.data.length
      });

      setRecentLogs(logsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      link: '/employees'
    },
    {
      title: 'Total Teams',
      value: stats.totalTeams,
      icon: UsersRound,
      color: 'from-purple-500 to-purple-600',
      link: '/teams'
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      link: '#'
    }
  ];

  const formatAction = (action) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="card skeleton h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white shadow-lg"
      >
        <h2 className="text-3xl font-bold mb-2">Welcome to HRMS Dashboard</h2>
        <p className="text-primary-100">Manage your employees and teams efficiently</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.link}>
                <div className="card hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
          <Activity className="w-5 h-5 text-gray-400" />
        </div>

        {recentLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatAction(log.action)}
                  </p>
                  {log.meta && Object.keys(log.meta).length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(log.meta)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTimestamp(log.timestamp)}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link to="/employees">
          <div className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Manage Employees</h4>
                <p className="text-sm text-gray-600">Add, edit, or remove employees</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/teams">
          <div className="card hover:scale-105 transition-transform cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <UsersRound className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Manage Teams</h4>
                <p className="text-sm text-gray-600">Create and organize teams</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Dashboard;
