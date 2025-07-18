import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials) => {
  try {
    // تحديد نوع المستخدم (مدير أو مستخدم عادي)
    const userType = credentials.email === 'admin@gmail.com' ? 'admin' : 'user';
    
    const response = await api.post(`/api/auth/${userType}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw {
      message: error.response?.data?.message || 'حدث خطأ أثناء التسجيل',
      status: error.response?.status || 500
    };
  }
};
