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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si el error es 401 (Unauthorized) y no hemos intentado actualizar el token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Obtener el refresh token y el userId del localStorage
        const refreshToken = localStorage.getItem('refresh_token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!refreshToken || !user) {
          // Si no hay refresh token o usuario, forzar logout
          logout();
          return Promise.reject(error);
        }
        
        // Llamar al endpoint de refresh
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          userId: user.id,
          refreshToken,
        });
        
        // Guardar el nuevo access token
        localStorage.setItem('token', response.data.access_token);
        
        // Reintentar la solicitud original
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, forzar logout
        logout();
        return Promise.reject(refreshError);
      }
    }
    
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
  
  // Guardar tokens y datos de usuario
  localStorage.setItem('token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data.user;
};

export const logout = async () => {
  try {
    // Llamar al endpoint de logout si hay un token
    if (localStorage.getItem('token')) {
      const authAxios = getAuthAxios();
      await authAxios.post('/auth/logout');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
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