const API_URL = process.env.REACT_APP_BACKEND_URL + '/api/classes';

export async function getClasses() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error('Failed to fetch classes');
  }
  return res.json();
}
