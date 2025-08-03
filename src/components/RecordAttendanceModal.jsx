import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecordAttendanceModal({ isOpen, onClose }) {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      axios
        .get('/api/classes')
        .then((res) => setClasses(res.data))
        .catch((err) => {
          console.error('Failed to fetch classes:', err);
          toast.error('Failed to fetch classes');
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedClass) {
      const cls = classes.find((c) => c._id === selectedClass);
      if (cls?.students) {
        setStudents(cls.students);
        setCurrentIndex(0);
        setAttendance({});
      } else {
        setStudents([]);
      }
    } else {
      setStudents([]);
      setAttendance({});
      setCurrentIndex(0);
    }
  }, [selectedClass, classes]);

  const markStatus = (status) => {
    const studentId = students[currentIndex]._id;
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
    if (currentIndex < students.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleSave = async () => {
    try {
      const requests = Object.entries(attendance).map(([studentId, status]) =>
        axios.post('/api/attendance', {
          studentId,
          adDate: selectedDate,
          status,
        })
      );
      await Promise.all(requests);
      toast.success('✅ Attendance recorded!');
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('❌ Failed to save attendance.');
    }
  };

  const allMarked = students.length > 0 && Object.keys(attendance).length === students.length;

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={overlayStyle}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={modalStyle}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>📅 Record Attendance</h3>

              {/* Date input */}
              <label style={{ fontWeight: 'bold' }}>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={inputStyle}
              />

              {/* Select Class */}
              {!selectedClass ? (
                <select
                  style={inputStyle}
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              ) : students.length === 0 ? (
                <p>No students in this class.</p>
              ) : (
                <>
                  <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <h4>
                      {currentIndex + 1}/{students.length}: {students[currentIndex].studentName}
                    </h4>
                    <div style={{ margin: '10px 0' }}>
                      <button
                        onClick={() => markStatus('Present')}
                        style={greenBtn}
                        disabled={attendance[students[currentIndex]._id]}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markStatus('Absent')}
                        style={redBtn}
                        disabled={attendance[students[currentIndex]._id]}
                      >
                        Absent
                      </button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      {currentIndex > 0 && (
                        <button onClick={() => setCurrentIndex((i) => i - 1)} style={navBtn}>
                          ⏮️ Previous
                        </button>
                      )}
                      {currentIndex < students.length - 1 && (
                        <button onClick={() => setCurrentIndex((i) => i + 1)} style={navBtn}>
                          Next ⏭️
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Summary Table */}
                  {allMarked && (
                    <div style={{ marginTop: '20px' }}>
                      <h4>📋 Attendance Summary</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th style={th}>Student</th>
                            <th style={th}>Status</th>
                            <th style={th}>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, idx) => (
                            <tr key={s._id}>
                              <td style={td}>{s.studentName}</td>
                              <td style={td}>{attendance[s._id]}</td>
                              <td style={td}>
                                <button
                                  style={{ ...navBtn, padding: '4px 8px' }}
                                  onClick={() => setCurrentIndex(idx)}
                                >
                                  ✏️ Edit
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={() => navigate('/manual-attendance')} style={manualBtn}>
                      ✏️ Manual Entry
                    </button>
                    <button onClick={handleSave} style={submitBtn} disabled={!allMarked}>
                      ✅ Submit
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Styles
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const inputStyle = {
  padding: '10px',
  width: '100%',
  borderRadius: '5px',
  marginTop: '10px',
};

const greenBtn = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  marginRight: '10px',
  borderRadius: '6px',
  cursor: 'pointer',
};

const redBtn = {
  backgroundColor: '#dc3545',
  color: 'white',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const navBtn = {
  margin: '0 10px',
  padding: '6px 12px',
  borderRadius: '6px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

const manualBtn = {
  backgroundColor: '#ffc107',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '6px',
  color: 'black',
  cursor: 'pointer',
};

const submitBtn = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const th = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px',
  border: '1px solid #ccc',
};

const td = {
  padding: '8px',
  border: '1px solid #ccc',
  textAlign: 'center',
};
