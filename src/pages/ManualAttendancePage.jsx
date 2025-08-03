// src/pages/ManualAttendancePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManualAttendancePage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: status }

  // Fetch all students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');  // Adjust if your API route differs
      setStudents(res.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  // Fetch attendance for selected date
  useEffect(() => {
    if (!date) return;

    const fetchAttendance = async () => {
      try {
        const res = await axios.get('/api/attendance', { params: { date } });
        // res.data is expected to be an array of attendance records [{ student, status }, ...]
        const attendanceMap = {};
        res.data.forEach(record => {
          attendanceMap[record.student] = record.status;
        });
        setAttendanceRecords(attendanceMap);
      } catch (error) {
        console.error('Failed to fetch attendance', error);
      }
    };

    fetchAttendance();
  }, [date]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    try {
      const promises = Object.entries(attendanceRecords).map(([studentId, status]) =>
        axios.post('/api/attendance', {
          studentId,
          date,
          status,
        })
      );
      await Promise.all(promises);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance', error);
      alert('Failed to save attendance');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📝 Manual Attendance Entry</h2>
      <label>
        Select Date:{' '}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          style={{ marginBottom: 20 }}
        />
      </label>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Student Name</th>
            <th style={thStyle}>Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td style={tdStyle}>{student.studentName}</td>
              <td style={tdStyle}>
                <select
                  value={attendanceRecords[student._id] || ''}
                  onChange={(e) => handleStatusChange(student._id, e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Leave">Leave</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSave} style={saveBtnStyle}>
        💾 Save Attendance
      </button>
    </div>
  );
}

// Styles
const thStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#007bff',
  color: 'white',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const saveBtnStyle = {
  marginTop: 20,
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
