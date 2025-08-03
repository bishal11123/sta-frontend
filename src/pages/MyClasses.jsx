import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');
  const [expandedClassIds, setExpandedClassIds] = useState(new Set());

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/classes');
      setClasses(res.data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      await axios.post('http://localhost:5001/api/classes', { name: newClassName });
      setNewClassName('');
      fetchClasses();
      toast.success('Class created successfully!');
    } catch (error) {
      toast.error('Failed to create class');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/classes/${classId}`);
      setExpandedClassIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(classId);
        return newSet;
      });
      fetchClasses();
      toast.success('Class deleted successfully');
    } catch (error) {
      toast.error('Failed to delete class');
    }
  };

  const toggleExpand = (classId) => {
    setExpandedClassIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(classId)) {
        newSet.delete(classId);
      } else {
        newSet.add(classId);
      }
      return newSet;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Navbar />
      <h2>📚 My Classes</h2>

      {/* Add Class Form */}
      <form onSubmit={handleCreateClass} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Enter new class name"
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
        <button type="submit" style={btnGreen}>➕ Create Class</button>
      </form>

      {/* Classes List */}
      {classes.map((cls) => {
        const isExpanded = expandedClassIds.has(cls._id);
        return (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={classCard}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => toggleExpand(cls._id)}
            >
              <h3 style={{ margin: 0 }}>{cls.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <strong>Total Students: </strong>&nbsp;{cls.students?.length || 0}
                <button style={btnSmall} onClick={(e) => { e.stopPropagation(); toggleExpand(cls._id); }}>
                  {isExpanded ? '▲ Hide Details' : '▼ Show Details'}
                </button>
                <button
                  style={btnRed}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClass(cls._id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={th}>Name</th>
                      <th style={th}>Start Date</th>
                      <th style={th}>Remarks</th>
                      <th style={th}>COE Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students?.length > 0 ? (
                      cls.students.map((s) => (
                        <tr key={s._id}>
                          <td style={td}>{s.studentName}</td>
                          <td style={td}>{new Date(s.consultancyAdmissionDate).toLocaleDateString()}</td>
                          <td style={td}>{s.remarks || '-'}</td>
                          <td style={td}>{s.COEStatus}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ ...td, textAlign: 'center' }}>No students in this class.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

const btnGreen = {
  padding: '8px 16px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const btnRed = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginLeft: '10px',
};

const btnSmall = {
  padding: '4px 8px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginLeft: '10px',
};

const classCard = {
  marginBottom: '20px',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
};

const th = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '8px',
  border: '1px solid #ccc',
};

const td = {
  padding: '8px',
  border: '1px solid #ccc',
};