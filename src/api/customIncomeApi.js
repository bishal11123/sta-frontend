import axios from 'axios';

export const getCustomIncomes = async () => {
  const res = await axios.get('/api/custom-incomes');
  return res.data;
};

export const addCustomIncome = async (data) => {
  const res = await axios.post('/api/custom-incomes', data);
  return res.data;
};

export const deleteCustomIncome = async (id) => {
  await axios.delete(`/api/custom-incomes/${id}`);
};
