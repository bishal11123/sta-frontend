import React, { useState } from 'react';
import axios from 'axios';

export default function AddIncomeModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5001/api/payments', {
      amount: parseFloat(amount),
      date,
      remarks
    });
    onSuccess();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>Record Payment</h3>
        <form onSubmit={handleSubmit}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            style={inputStyle}
          />

          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={inputStyle}
          />

          <label>Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="Optional"
            style={inputStyle}
          />

          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <button type="submit" style={buttonStyle}>Submit</button>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#ccc', marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 9999
};

const modalStyle = {
  background: 'white', padding: '20px', borderRadius: '10px',
  width: '400px', textAlign: 'left'
};

const inputStyle = {
  width: '100%', padding: '8px', marginBottom: '10px',
  borderRadius: '5px', border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '8px 16px', backgroundColor: '#007bff',
  color: 'white', border: 'none', borderRadius: '5px',
  cursor: 'pointer'
};
