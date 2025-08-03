import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();


  const fetchPayments = async () => {
  try {
    const params = {};
    if (fromDate && toDate) {
      params.from = fromDate;
      params.to = toDate;
    }

    const res = await axios.get('http://localhost:5001/api/payments', { params });
    setPayments(res.data);
  } catch (err) {
    console.error('Failed to fetch payments:', err);
  }
};



  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await axios.delete(`http://localhost:5001/api/payments/${id}`);
        await fetchPayments();
      } catch (err) {
        console.error('Error deleting payment:', err);
      }
    }
  };

  useEffect(() => {
  const fetchPayments = async () => {
    try {
      const params = {};
      if (fromDate && toDate) {
        params.from = fromDate;
        params.to = toDate;
      }

      const res = await axios.get('http://localhost:5001/api/payments', { params });
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  fetchPayments();
}, [fromDate, toDate]);


  const sortedPayments = [...payments].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto' }}>
      <button
  onClick={() => navigate('/')}
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

      <h2>💳 Payment History</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={fetchPayments}>🔍 Filter</button>
        <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
          Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {sortedPayments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul style={{ padding: 0 }}>
          {sortedPayments.map((payment) => (
            <li key={payment._id} style={itemStyle}>
              <div>
                <strong>Amount:</strong> Rs. {payment.amount}<br />
                <strong>Date:</strong> {new Date(payment.date).toLocaleDateString()}<br />
                <strong>Remarks:</strong> {payment.remarks || '—'}
              </div>
              <button onClick={() => handleDelete(payment._id)} style={deleteBtn}>🗑</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const itemStyle = {
  listStyle: 'none',
  marginBottom: '10px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const deleteBtn = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '5px 10px',
  cursor: 'pointer',
};
