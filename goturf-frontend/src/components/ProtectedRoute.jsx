// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== allowedRole) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
