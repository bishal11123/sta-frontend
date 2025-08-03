import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function SettingsModal({ onClose }) {
  const { settings, setSettings } = useSettings();
  const [form, setForm] = useState({ ...settings });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSave = () => {
    setSettings(form);
    console.log('Updated Settings:', form);
    onClose();
  };

  return (
    <div style={{ padding: '20px', minWidth: '300px' }}>
      <h3 style={{ marginBottom: '20px' }}>Income Settings</h3>

      <div style={fieldStyle}>
        <label style={labelStyle}>New Student Income:</label>
        <input
          type="number"
          name="newStudentIncome"
          value={form.newStudentIncome}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>COE Applied Income:</label>
        <input
          type="number"
          name="coeAppliedIncome"
          value={form.coeAppliedIncome}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>COE Received Income:</label>
        <input
          type="number"
          name="coeReceivedIncome"
          value={form.coeReceivedIncome}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleSave} style={saveBtn}>Save</button>
        <button onClick={onClose} style={cancelBtn}>Cancel</button>
      </div>
    </div>
  );
}

const fieldStyle = { marginBottom: '15px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const saveBtn = {
  padding: '8px 16px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const cancelBtn = {
  padding: '8px 16px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
