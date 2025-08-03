import React, { useState, useEffect } from 'react';
import { updateStudent } from '../api/studentApi';
import { getClasses } from '../api/classApi';  // You'll need to have this API function to fetch classes

const COEStatusOptions = ['Pending', 'Applied', 'Received'];

export default function EditStudentForm({ student, onClose, onStudentUpdated }) {
  const [form, setForm] = useState({ ...student });
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    // Format date fields to yyyy-MM-dd for inputs
    const formatted = { ...student };
    ['consultancyAdmissionDate', 'courseStartDate', 'courseEndDate', 'interviewScheduledDate', 'coeApplicationDate', 'visaApplicationDate', 'paymentReceivedDate'].forEach(field => {
      if (formatted[field]) {
        formatted[field] = new Date(formatted[field]).toISOString().split('T')[0];
      }
    });
    setForm(formatted);

    // Fetch classes
    fetchClasses();
  }, [student]);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { income, ...dataToSend } = form; // remove income before sending
    await updateStudent(student._id, dataToSend);
    onStudentUpdated();
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Edit Student</h2>
        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>

            {/* Text inputs */}
            {[
              { name: 'studentName', label: 'Student Name' },
              { name: 'phone', label: 'Phone' },
              { name: 'address', label: 'Address' },
              { name: 'selectedCollegeName', label: 'College Name' },
              { name: 'remarks', label: 'Remarks' },
            ].map(({ name, label, type = 'text' }) => (
              <div key={name}>
                <label>{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name] || ''}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            ))}

            {/* Date inputs */}
            {[
              { name: 'consultancyAdmissionDate', label: 'Admission Date' },
            ].map(({ name, label }) => (
              <div key={name}>
                <label>{label}</label>
                <input
                  name={name}
                  type="date"
                  value={form[name] || ''}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            ))}

            {/* COE Status select */}
            <div>
              <label>Application Status</label>
              <select
                name="COEStatus"
                value={form.COEStatus || ''}
                onChange={handleChange}
                style={inputStyle}
              >
                {COEStatusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Class dropdown */}
            <div>
              <label>Class</label>
              <select
                name="classId"
                value={form.classId || ''}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div style={{ marginTop: '15px', textAlign: 'right' }}>
            <button type="submit" style={buttonStyle}>Save</button>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, backgroundColor: '#ccc', marginLeft: '10px' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 9999
};

const modalStyle = {
  background: 'white', padding: '20px', borderRadius: '10px',
  width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '10px'
};

const inputStyle = {
  padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '100%'
};

const buttonStyle = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};
