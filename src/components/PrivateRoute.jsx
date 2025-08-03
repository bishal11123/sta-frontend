// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token'); // or your login flag
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
