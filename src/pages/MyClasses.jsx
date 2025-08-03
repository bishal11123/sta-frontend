import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState('');

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/classes`);
      setClasses(res.data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      toast.warning('Class name is required');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/classes`, {
        name: newClassName,
      });
      toast.success('Class created successfully');
      setNewClassName('');
      fetchClasses();
    } catch (error) {
      toast.error('Error creating class');
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/classes/${id}`);
      toast.success('Class deleted');
      fetchClasses();
    } catch (error) {
      toast.error('Error deleting class');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Classes</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter class name"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        <button
          onClick={handleCreateClass}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      <ul className="space-y-2">
        {classes.map((cls) => (
          <li
            key={cls._id}
            className="flex justify-between items-center border px-4 py-2 rounded"
          >
            <span>{cls.name}</span>
            <button
              onClick={() => handleDeleteClass(cls._id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyClasses;
