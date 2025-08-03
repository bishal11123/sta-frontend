import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { getCustomIncomes, deleteCustomIncome } from '../api/customIncomeApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import 'jspdf-autotable';

export default function IncomeBreakdownPage() {
  const [students, setStudents] = useState([]);
  const [customIncomes, setCustomIncomes] = useState([]);
  const [search, setSearch] = useState('');
  const [coeStatus, setCOEStatus] = useState('');
  
  const { settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get('http://localhost:5001/api/students');
    setStudents(res.data);
    const customIncomeData = await getCustomIncomes();
    setCustomIncomes(customIncomeData);
  };

  const coeCounts = {
    Pending: students.filter((s) => s.COEStatus === 'Pending').length,
    Applied: students.filter((s) => s.COEStatus === 'Applied').length,
    Received: students.filter((s) => s.COEStatus === 'Received').length,
  };

  const handleCardClick = (status) => {
    setCOEStatus(prev => prev === status ? '' : status);
  };

  const getCardStyle = (status, color) => ({
    ...cardStyle,
    backgroundColor: coeStatus === status ? '#343a40' : color,
    cursor: 'pointer',
    border: coeStatus === status ? '3px solid white' : 'none',
  });

  const format = (num) => `Rs. ${Number(num || 0).toLocaleString('en-IN')}`;

  const calculateIncome = (student) => {
    const regIncome = student.eligibleForIncomeBonus ? settings.newStudentIncome : 0;
    const coeAppliedIncome = (student.COEStatus === 'Applied' || student.COEStatus === 'Received') ? settings.coeAppliedIncome : 0;
    const coeReceivedIncome = student.COEStatus === 'Received' ? settings.coeReceivedIncome : 0;
    const total = regIncome + coeAppliedIncome + coeReceivedIncome;
    return { regIncome, coeAppliedIncome, coeReceivedIncome, total };
  };

  const handleDeleteCustomIncome = async (id) => {
    if (window.confirm('Are you sure you want to delete this income entry?')) {
      await deleteCustomIncome(id);
      fetchData();
    }
  };

  const filtered = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase()) &&
    (coeStatus === '' || s.COEStatus === coeStatus)
  );

  const totalCustomIncome = customIncomes.reduce((sum, i) => sum + i.amount, 0);

  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Total Income Breakdown', 14, 20);

  // Student Table
  doc.setFontSize(12);
  doc.text('Student Income Breakdown', 14, 30);

  const studentBody = filtered.map((s) => {
    const i = calculateIncome(s);
    return [
      s.studentName,
      new Date(s.consultancyAdmissionDate).toLocaleDateString(),
      s.COEStatus,
      format(i.regIncome),
      format(i.coeAppliedIncome),
      format(i.coeReceivedIncome),
      format(i.total),
    ];
  });

  const totals = filtered.reduce(
    (acc, s) => {
      const i = calculateIncome(s);
      acc.reg += i.regIncome;
      acc.applied += i.coeAppliedIncome;
      acc.received += i.coeReceivedIncome;
      acc.total += i.total;
      return acc;
    },
    { reg: 0, applied: 0, received: 0, total: 0 }
  );

  autoTable(doc, {
    startY: 35,
    head: [['Name', 'Admission Date', 'COE Status', 'Reg Income', 'COE Applied', 'COE Received', 'Total']],
    body: studentBody,
    foot: [['', '', 'Total', format(totals.reg), format(totals.applied), format(totals.received), format(totals.total)]],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 123, 255] },
    footStyles: { fillColor: [40, 167, 69], textColor: 'white' },
    theme: 'grid',
  });

  // Custom Income Table
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text('Custom Monthly Incomes', 14, finalY);

  const customBody = customIncomes.map((i) => [
    new Date(i.date).toLocaleDateString(),
    format(i.amount),
    i.remark || '-',
  ]);

  autoTable(doc, {
    startY: finalY + 5,
    head: [['Date', 'Amount', 'Remark']],
    body: customBody,
    foot: [['Total', format(totalCustomIncome), '']],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 123, 255] },
    footStyles: { fillColor: [255, 193, 7], textColor: 'black' },
    theme: 'grid',
  });

  doc.save('Total-Income-Breakdown.pdf');
};


  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')} style={navBtn}>⬅ Back to Dashboard</button>

      <h2>📊 Summary</h2>
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
        <button onClick={() => setCOEStatus('')} style={clearBtn}>🔄 Clear Filter</button>
      </div>

      <h2>📊 Income Breakdown Per Student</h2>
      <input
        type="text"
        placeholder="🔍 Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchInput}
      />

      <div style={{ overflowX: 'auto', marginTop: '15px' }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Admission Date</th>
              <th style={th}>COE Status</th>
              <th style={th}>🎓 Registration</th>
              <th style={th}>📄 COE Applied</th>
              <th style={th}>✅ COE Received</th>
              <th style={th}>💰 Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => {
                const i = calculateIncome(s);
                return (
                  <tr key={s._id}>
                    <td style={td}>{s.studentName}</td>
                    <td style={td}>{new Date(s.consultancyAdmissionDate).toLocaleDateString()}</td>
                    <td style={td}>{s.COEStatus}</td>
                    <td style={td}>{format(i.regIncome)}</td>
                    <td style={td}>{format(i.coeAppliedIncome)}</td>
                    <td style={td}>{format(i.coeReceivedIncome)}</td>
                    <td style={{ ...td, fontWeight: 'bold' }}>{format(i.total)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ ...td, textAlign: 'center' }}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Monthly Income Section */}
      <h2 style={{ marginTop: '40px' }}>➕ Monthly Incomes</h2>
      <h3>Total Monthly Income: {format(totalCustomIncome)}</h3>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Date</th>
            <th style={th}>Amount</th>
            <th style={th}>Remark</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {customIncomes.length > 0 ? (
            customIncomes.map((i) => (
              <tr key={i._id}>
                <td style={td}>{new Date(i.date).toLocaleDateString()}</td>
                <td style={td}>{format(i.amount)}</td>
                <td style={td}>{i.remark || '-'}</td>
                <td style={td}>
                  <button onClick={() => handleDeleteCustomIncome(i._id)} style={deleteBtn}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ ...td, textAlign: 'center' }}>No custom incomes found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Download Button */}
      <button onClick={handleDownloadPDF} style={downloadBtn}>
        📄 Download Income PDF
      </button>
    </div>
  );
}

// 🔧 Styles
const navBtn = {
  marginBottom: '15px',
  padding: '8px 16px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
const clearBtn = {
  marginLeft: 'auto',
  padding: '8px 16px',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
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
const searchInput = {
  padding: '8px',
  width: '300px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};
const table = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
  minWidth: '700px',
};
const th = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px',
  border: '1px solid #ccc',
};
const td = {
  padding: '10px',
  border: '1px solid #ccc',
};
const deleteBtn = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
const downloadBtn = {
  padding: '10px 20px',
  marginTop: '30px',
  backgroundColor: '#343a40',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
