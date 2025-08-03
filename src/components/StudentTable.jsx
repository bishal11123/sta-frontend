import React from 'react';

export default function StudentTable({ students, onEdit, onDelete }) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thTdStyle}>Name</th>
          <th style={thTdStyle}>Phone</th>
          <th style={thTdStyle}>College</th>
          <th style={thTdStyle}>Admission</th>
          <th style={thTdStyle}>Class</th>

          <th style={thTdStyle}>Aplications</th>
          <th style={thTdStyle}>Remarks</th>
          <th style={thTdStyle}>Actions</th>

        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s._id}>
            <td style={thTdStyle}>{s.studentName}</td>
            <td style={thTdStyle}>{s.phone}</td>
            <td style={thTdStyle}>{s.selectedCollegeName}</td>
            <td style={thTdStyle}>{formatDate(s.consultancyAdmissionDate)}</td>
            <td style={thTdStyle}>{s.classId ? s.classId.name : '-'}</td>

            <td style={thTdStyle}>{s.COEStatus}</td>
            <td style={thTdStyle}>{s.remarks || '-'}</td>

            <td style={thTdStyle}>
              <button
                onClick={() => onEdit(s)}
                style={editButtonStyle}
                aria-label={`Edit ${s.studentName}`}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(s._id)}
                style={deleteButtonStyle}
                aria-label={`Delete ${s.studentName}`}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-GB'); // DD/MM/YYYY
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
  fontSize: '14px',
};

const thTdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
};

const editButtonStyle = {
  marginRight: '5px',
  padding: '5px 10px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};
