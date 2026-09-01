import React from 'react';
import { Navigate, useLocation } from 'react-router';

import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Firebase is still checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in
  return children;
};

export default PrivateRoute;
