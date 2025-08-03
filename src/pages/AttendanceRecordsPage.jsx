import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AttendanceRecordsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [adMonth, setAdMonth] = useState('');
  const [students, setStudents] = useState([]);
  const [recordsMap, setRecordsMap] = useState({});

  useEffect(() => {
    axios.get('/api/classes')
      .then(res => setClasses(res.data))
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    if (!selectedClass || !adMonth) return;

    axios.get('/api/attendance/records', {
      params: { classId: selectedClass, adMonth },
    })
      .then(res => {
        setStudents(res.data.students);
        setRecordsMap(res.data.recordsMap);
      })
      .catch(() => {
        setStudents([]);
        setRecordsMap({});
      });
  }, [selectedClass, adMonth]);

  // Get all days in the selected month, format YYYY-MM-DD
  const getDaysInMonth = (monthStr) => {
    const [year, month] = monthStr.split('-').map(Number);
    const daysCount = new Date(year, month, 0).getDate();
    return Array.from({ length: daysCount }, (_, i) => 
      `${monthStr}-${String(i + 1).padStart(2, '0')}`
    );
  };

  const daysInMonth = adMonth ? getDaysInMonth(adMonth) : [];

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Attendance Records (AD)</h2>

      <div style={{ marginBottom: 20 }}>
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        >
          <option value="">Select Class</option>
          {classes.map(cls => (
            <option key={cls._id} value={cls._id}>{cls.name}</option>
          ))}
        </select>

        <input
          type="month"
          value={adMonth}
          onChange={e => setAdMonth(e.target.value)}
          style={{ padding: 8 }}
        />
      </div>

      {students.length === 0 ? (
        <p>No students or records found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={th}>Student</th>
                {daysInMonth.map(day => (
                  <th key={day} style={th}>{day.split('-')[2]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td style={td}>{s.studentName}</td>
                  {daysInMonth.map(dateStr => {
                    const status = recordsMap[s._id]?.[dateStr] || '';
                    const bg = status === 'Present' ? '#28a745' :
                               status === 'Absent' ? '#dc3545' :
                               status === 'Leave' ? '#ffc107' :
                               status === 'Late' ? '#17a2b8' : 'transparent';
                    return (
                      <td
                        key={dateStr}
                        style={{ ...td, backgroundColor: bg, color: status ? 'white' : 'black' }}
                      >
                        {status ? status[0] : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  padding: '8px', border: '1px solid #ccc', backgroundColor: '#007bff', color: 'white',
};

const td = {
  padding: '8px', border: '1px solid #ccc', textAlign: 'center',
};
