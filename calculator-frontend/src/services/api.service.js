import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create an axios instance with auth token
const getAuthAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Auth services
export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });
  
  // Store the token and return user data
  localStorage.setItem('token', response.data.access_token);
  return response.data.user;
};

export const register = async (username, password) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    password
  });
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Calculator services
export const calculate = async (expression) => {
  const authAxios = getAuthAxios();
  const response = await authAxios.post('/calculations', {
    expression
  });
  
  return response.data;
};

// History services

export const getHistory = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/calculations/history`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
};

export const getUserHistory = async (userId) => {
  const authAxios = getAuthAxios();
  const response = await authAxios.get(`/calculations/history/${userId}`);
  
  return response.data;
};

// Admin services
export const getUsers = async () => {
  const authAxios = getAuthAxios();
  const response = await authAxios.get('/users');
  
  return response.data;
};

export default {
  login,
  register,
  logout,
  calculate,
  getHistory,
  getUserHistory,
  getUsers
};