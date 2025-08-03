import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

// Landing Page (Public)
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';

// Protected Pages
import Home from './pages/Home';
import CalculationPage from './pages/CalculationPage';
import StudentListPage from './pages/StudentListPage';
import IncomeBreakdownPage from './pages/IncomeBreakdownPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import MyIncome from './pages/MyIncome';
import MyClasses from './pages/MyClasses';
import ManualAttendancePage from './pages/ManualAttendancePage';
import AttendanceRecordsPage from './pages/AttendanceRecordsPage';
import KanaPractice from './pages/KanaPractice';

function App() {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Protected Routes */}
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/calculation" element={<PrivateRoute><CalculationPage /></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute><StudentListPage /></PrivateRoute>} />
      <Route path="/income-breakdown" element={<PrivateRoute><IncomeBreakdownPage /></PrivateRoute>} />
      <Route path="/payment-history" element={<PrivateRoute><PaymentHistoryPage /></PrivateRoute>} />
      <Route path="/my-income" element={<PrivateRoute><MyIncome /></PrivateRoute>} />
      <Route path="/my-classes" element={<PrivateRoute><MyClasses /></PrivateRoute>} />
      <Route path="/manage-students" element={<PrivateRoute><StudentListPage /></PrivateRoute>} />
      <Route path="/manual-attendance" element={<PrivateRoute><ManualAttendancePage /></PrivateRoute>} />
      <Route path="/attendance-records" element={<PrivateRoute><AttendanceRecordsPage /></PrivateRoute>} />
      <Route path="/kana-practice" element={<PrivateRoute><KanaPractice /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
