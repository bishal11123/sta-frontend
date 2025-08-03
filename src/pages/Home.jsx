import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from '../components/Navbar'; // <-- Import Navbar here
import StudentForm from '../components/StudentForm';
import RecordAttendanceModal from '../components/RecordAttendanceModal';

export default function Home() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const handleStudentSuccess = () => {
    toast.success("🎉 Student registered successfully!");
    setShowAddModal(false);
  };

  const handleAttendanceSuccess = () => {
    toast.success("📅 Attendance recorded successfully!");
    setShowAttendanceModal(false);
  };

  return (
    <>
      {/* Full Navbar with Logout and Nepal time */}
      <Navbar />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Main content */}
      <div style={outerContainerStyle}>
        <div style={containerStyle}>
          <AnimatedCard onClick={() => navigate('/my-income')}>
            <h2>📊 My Income Dashboard</h2>
            <p>Click to open full income dashboard →</p>
          </AnimatedCard>

          <AnimatedCard onClick={() => navigate('/my-classes')}>
            <h2>🏫 My Classes</h2>
            <p>Click to manage your classes →</p>
          </AnimatedCard>

          <AnimatedCard onClick={() => navigate('/students')}>
            <h2>🏫 Manage Students</h2>
            <p>Click to manage your students →</p>
          </AnimatedCard>

          <AnimatedCard onClick={() => setShowAddModal(true)}>
            <h2>📝 Register new Student</h2>
            <p>Click to register a new student →</p>
          </AnimatedCard>

          <AnimatedCard onClick={() => setShowAttendanceModal(true)}>
            <h2>📅 Record Attendance</h2>
            <p>Click to mark today's attendance →</p>
          </AnimatedCard>

          <AnimatedCard onClick={() => navigate('/attendance-records')}>
            <h2>📋 Attendance Records</h2>
            <p>Click to view attendance history →</p>
          </AnimatedCard>

          <AnimatedCard onClick={() => navigate('/kana-practice')}>
            <h2>📋 kana practice</h2>
            <p>Click to practice kana →</p>
          </AnimatedCard>
        </div>
      </div>

      {/* Modals with animation */}
      <AnimatePresence>
        {showAddModal && (
          <ModalWrapper onClose={() => setShowAddModal(false)}>
            <h3 style={{ marginBottom: '1rem' }}>Register New Student</h3>
            <StudentForm onSuccess={handleStudentSuccess} />
          </ModalWrapper>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAttendanceModal && (
          <ModalWrapper onClose={() => setShowAttendanceModal(false)}>
            <h3 style={{ marginBottom: '1rem' }}>Record Attendance</h3>
            <RecordAttendanceModal onSuccess={handleAttendanceSuccess} />
          </ModalWrapper>
        )}
      </AnimatePresence>
    </>
  );
}

// 🔸 Animated Card Component
function AnimatedCard({ children, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      style={cardStyle}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}

// 🔸 Modal with Framer Motion
function ModalWrapper({ children, onClose }) {
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        style={modalContentStyle}
      >
        <button onClick={onClose} style={closeButtonStyle} aria-label="Close modal">×</button>
        {children}
      </motion.div>
    </div>
  );
}

// Styles
const outerContainerStyle = {
  minHeight: '100vh',
  background: '#f8f9fa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
};

const containerStyle = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
  justifyContent: 'center',
};

const cardStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '40px',
  borderRadius: '12px',
  cursor: 'pointer',
  textAlign: 'center',
  width: '300px',
  userSelect: 'none',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  width: '500px',
  position: 'relative',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '15px',
  fontSize: '24px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
};
