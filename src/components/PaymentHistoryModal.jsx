import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaymentHistoryModal({ onClose, onSuccess }) {
  const [payments, setPayments] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first

  const fetchPayments = async () => {
    try {
      const now = new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      const res = await axios.get(`http://localhost:5001/api/payments?month=${month}&year=${year}`);
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
        onSuccess(); // 🔁 update dashboard summary after deletion
      } catch (err) {
        console.error('Error deleting payment:', err);
      }
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Sort payments based on sortOrder
  const sortedPayments = [...payments].sort((a, b) => {
    return sortOrder === 'desc'
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Payment History</h3>

        {/* ✅ Toggle Sort Order Button */}
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          style={{ marginBottom: '10px', padding: '6px 12px', cursor: 'pointer' }}
        >
          Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
        </button>

        {/* ✅ Sorted Payments Display */}
        <ul style={{ paddingLeft: 0 }}>
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

        <button onClick={onClose} style={closeBtn}>Close</button>
      </div>
    </div>
  );
}
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '400px',
  maxHeight: '80vh',
  overflowY: 'auto',
};

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

const closeBtn = {
  marginTop: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '8px 16px',
  cursor: 'pointer',
};
