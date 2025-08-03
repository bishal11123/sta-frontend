import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api/students';

export async function getStudents() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function addStudent(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateStudent(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Update failed: ${res.status} ${error}`);
  }

  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ✅ CORRECT getMonthlySummary function using settings
export const getMonthlySummary = async (month, year, settings = {}) => {
  const res = await axios.get(`${API_URL}/summary`, {
    params: {
      month,
      year,
      ...settings, // newStudentIncome, coeAppliedIncome, coeReceivedIncome
    }
  });
  return res.data;
};
