import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getStudents, deleteStudent } from '../api/studentApi';
import StudentTable from '../components/StudentTable';
import EditStudentForm from '../components/EditStudentForm';

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [coeStatus, setCOEStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchAllStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, search, coeStatus, fromDate, toDate]);

  const coeCounts = {
  Pending: students.filter((s) => s.COEStatus === 'Pending').length,
  Applied: students.filter((s) => s.COEStatus === 'Applied').length,
  Received: students.filter((s) => s.COEStatus === 'Received').length,
};

const handleCardClick = (status) => {
  setCOEStatus(prev => prev === status ? '' : status); // toggle off if already selected
};

const getCardStyle = (status, color) => ({
  ...cardStyle,
  backgroundColor: coeStatus === status ? '#343a40' : color,
  cursor: 'pointer',
  border: coeStatus === status ? '3px solid white' : 'none',
});



  const fetchAllStudents = async () => {
    const data = await getStudents();
    setStudents(data);
  };

  const applyFilters = () => {
    let result = [...students];

    if (search.trim()) {
      result = result.filter(s =>
        s.studentName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (coeStatus) {
      result = result.filter(s => s.COEStatus === coeStatus);
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      result = result.filter(s => {
        const admission = new Date(s.consultancyAdmissionDate);
        return admission >= from && admission <= to;
      });
    }

    setFiltered(result);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
      fetchAllStudents();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button
  onClick={() => navigate('/home')}
  style={{
    marginBottom: '15px',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }}
>
  ⬅ Back to Dashboard
</button>

<h2 style={{ marginBottom: '10px' }}>📊 Summary</h2>
<div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
  <div onClick={() => handleCardClick('Pending')} style={getCardStyle('Pending', '#ffc107')}>
    <h3>Pending</h3>
    <p style={cardNumber}>{coeCounts.Pending}</p>
  </div>
  <div onClick={() => handleCardClick('Applied')} style={getCardStyle('Applied', '#17a2b8')}>
    <h3>Applied</h3>
    <p style={cardNumber}>{coeCounts.Applied}</p>
  </div>
  <div onClick={() => handleCardClick('Received')} style={getCardStyle('Received', '#28a745')}>
    <h3>Received</h3>
    <p style={cardNumber}>{coeCounts.Received}</p>
  </div>

  <button
    onClick={() => setCOEStatus('')}
    style={{
      marginLeft: 'auto',
      padding: '8px 16px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    🔄 Clear Filter
  </button>
</div>



      <h2>Total Students List</h2>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />
        <select value={coeStatus} onChange={(e) => setCOEStatus(e.target.value)} style={inputStyle}>
          <option value="">All COE Status</option>
          <option value="Pending">Pending</option>
          <option value="Applied">Applied</option>
          <option value="Received">Received</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      <StudentTable
        students={filtered}
        onEdit={setEditingStudent}
        onDelete={handleDelete}
      />

      {editingStudent && (
        <EditStudentForm
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onStudentUpdated={fetchAllStudents}
        />
      )}
    </div>
  );
}

const inputStyle = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const cardStyle = {
  flex: 1,
  padding: '20px',
  color: 'white',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

const cardNumber = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '10px',
};

