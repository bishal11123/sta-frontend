import React, { useState, useEffect } from 'react';
import { addStudent } from '../api/studentApi';
import axios from 'axios';

export default function StudentForm({ onSuccess }) {
  const [form, setForm] = useState({
    studentName: '',
    phone: '',
    consultancyAdmissionDate: '',
    selectedCollegeName: '',
    remarks: '',
    classId: '', // New field for selected class
  });

  const [eligibleForIncomeBonus, setEligibleForIncomeBonus] = useState(false);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/classes');
      const classesData = response.data.classes || response.data; // try both depending on backend shape
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      classId: form.classId,
      COEStatus: 'Pending',
      admissionStatus: 'Pending',
      courseStatus: 'Not Started',
      interviewStatus: 'Not Scheduled',
      visaStatus: 'Pending',
      eligibleForIncomeBonus,
      income: eligibleForIncomeBonus ? 2000 : 0,
    };

    try {
      await addStudent(dataToSend);
      if (onSuccess) onSuccess();

      // Reset form
      setForm({
        studentName: '',
        phone: '',
        consultancyAdmissionDate: '',
        selectedCollegeName: '',
        remarks: '',
        classId: '',
      });
      setEligibleForIncomeBonus(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h3>Add Student</h3>
      <div style={gridStyle}>
        {[
          { name: 'studentName', placeholder: 'Student Name', required: true },
          { name: 'phone', placeholder: 'Phone' },
          { name: 'consultancyAdmissionDate', type: 'date', required: true },
          { name: 'selectedCollegeName', placeholder: 'Selected College' },
          { name: 'remarks', placeholder: 'Remarks' },
        ].map(({ name, placeholder, type = 'text', required }) => (
          <input
            key={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
            required={required}
            style={inputStyle}
          />
        ))}

        {/* Class Dropdown */}
        <select
          name="classId"
          value={form.classId}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Income Bonus Checkbox */}
      <label style={{ display: 'block', margin: '10px 0' }}>
        <input
          type="checkbox"
          checked={eligibleForIncomeBonus}
          onChange={(e) => setEligibleForIncomeBonus(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        Include Rs. 2000 in Income
      </label>

      <button type="submit" style={buttonStyle}>Add</button>
    </form>
  );
}

// Styles
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '10px',
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};
