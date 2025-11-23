import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import RegisterOrg from './pages/RegisterOrg';
import Employees from './pages/Employees';
import Teams from './pages/Teams';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }
    return !isAuthenticated ? children : <Navigate to="/dashboard" />;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login setIsAuthenticated={setIsAuthenticated} /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterOrg setIsAuthenticated={setIsAuthenticated} /></PublicRoute>} />
          
          <Route path="/" element={<PrivateRoute><Layout setIsAuthenticated={setIsAuthenticated} /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="teams" element={<Teams />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
