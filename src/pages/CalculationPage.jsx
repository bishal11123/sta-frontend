// src/pages/CalculationPage.jsx
import React, { useState} from 'react';

import axios from 'axios';

import { useSettings } from '../context/SettingsContext';

export default function CalculationPage() {
    const { settings } = useSettings();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchCalculation = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5001/api/students/calculation', {
        params: {
          from: fromDate,
          to: toDate,
          newStudentIncome: settings.newStudentIncome,
          coeAppliedIncome: settings.coeAppliedIncome,
          coeReceivedIncome: settings.coeReceivedIncome,
        },
      });
      setResult(res.data);
    } catch (err) {
      setError('Failed to fetch calculation data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
    console.log('🧪 Using settings in CalculationPage:', settings);

  };

  const formatCurrency = (num) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Income Calculation</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={fetchCalculation} disabled={loading || !fromDate || !toDate}>
          {loading ? 'Calculating...' : '🔍 Calculate'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result ? (
        <>
          <p><strong>New Student Income:</strong> Rs. {formatCurrency(result.newStudentIncome)}</p>
          <p><strong>COE Applied Income:</strong> Rs. {formatCurrency(result.coeAppliedIncome)}</p>
          <p><strong>COE Received Income:</strong> Rs. {formatCurrency(result.coeReceivedIncome)}</p>
          <p><strong>Total Income (all students):</strong> Rs. {formatCurrency(result.totalIncome)}</p>

          <h3>Students in this period:</h3>
          {result.students.length === 0 ? (
            <p>No students found for this period.</p>
          ) : (
            <ul>
              {result.students.map(s => (
                <li key={s._id} style={{ marginBottom: '8px' }}>
                  <strong>{s.studentName}</strong> — {new Date(s.consultancyAdmissionDate).toLocaleDateString()} — <em>COE Status:</em> {s.COEStatus}
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p>Please select a date range and click Calculate.</p>
      )}
    </div>
    
  );
  
}
