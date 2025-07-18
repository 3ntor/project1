import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requireAuth = false, requireAdmin = false }) => {
  const { isAuthenticated, isAdminUser } = useAuth();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdminUser()) {
    return (
      <div className="access-denied">
        <div className="access-denied-container">
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
          <p>Please contact the administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;