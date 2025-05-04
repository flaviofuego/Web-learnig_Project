import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Configure interceptors
axios.interceptors.request.use(
  config => {
    console.log(`Request sent to: ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log(`Response received from: ${response.config.url}`, {
      status: response.status,
      data: response.data ? 'Data received' : 'No data'
    });
    return response;
  },
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Create an axios instance with auth token
const getAuthAxios = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    console.log(`Token available: ${token.substring(0, 15)}...`);
  } else {
    console.error('No token available for request!');
  }
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Auth services
export const login = async (username, password) => {
  console.log('Login service called for user:', username);
  
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });
  
  console.log('Login response:', {
    token: response.data.access_token ? 'Token received' : 'No token',
    user: response.data.user
  });
  
  // Store the token and return user data
  localStorage.setItem('token', response.data.access_token);
  return response.data.user;
};

export const register = async (username, password) => {
  console.log('Register service called for user:', username);
  
  const response = await axios.post(`${API_URL}/auth/register`, {
    username,
    password
  });
  
  console.log('Registration response:', response.data);
  return response.data;
};

export const logout = () => {
  console.log('Logout service called');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Calculator services
export const calculate = async (expression) => {
  console.log('Calculate service called with expression:', expression);
  
  const authAxios = getAuthAxios();
  const response = await authAxios.post('/calculations', {
    expression
  });
  
  console.log('Calculation response:', response.data);
  return response.data;
};

// History services
export const getHistory = async () => {
  console.log('Get history service called');
  
  const authAxios = getAuthAxios();
  const response = await authAxios.get('/calculations/history');
  
  console.log('History response:', {
    count: response.data.length,
    data: response.data
  });
  
  return response.data;
};

export const getUserHistory = async (userId) => {
  console.log('Get user history service called for user ID:', userId);
  
  const authAxios = getAuthAxios();
  const response = await authAxios.get(`/calculations/history/${userId}`);
  
  console.log('User history response:', {
    count: response.data.length,
    userId: userId
  });
  
  return response.data;
};

// Admin services
export const getUsers = async () => {
  console.log('Get users service called');
  
  const authAxios = getAuthAxios();
  const response = await authAxios.get('/users');
  
  console.log('Users response:', {
    count: response.data.length
  });
  
  return response.data;
};

const apiService = {
  login,
  register,
  logout,
  calculate,
  getHistory,
  getUserHistory,
  getUsers
};

export default apiService;