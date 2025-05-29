import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/';

export const Redbook = async (email, password) => {
  const response = await axios.post(API_URL + 'Redbook', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};
