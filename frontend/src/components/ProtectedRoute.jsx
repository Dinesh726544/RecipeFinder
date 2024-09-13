import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  // Dynamically check if the user is authenticated
  // const isAuthenticated = !!localStorage.getItem('authToken');
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthenticated =  !!localStorage.getItem('accessToken')


  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
