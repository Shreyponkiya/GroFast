import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect to appropriate dashboard
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'user') {
      return <Navigate to="/user/dashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'deliveryBoy') {
      return <Navigate to="/delivery/dashboard" replace />;
    }
    
    // Fallback redirect if role is unknown
    return <Navigate to="/login" replace />;
  }

  // If authenticated and has the right role, show the protected component
  return children;
};

export default PrivateRoute;