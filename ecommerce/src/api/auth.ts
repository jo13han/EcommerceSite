import api from '@/lib/api';

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const logIn = async (data: LoginData) => {
  try {
    const response = await api.post('api/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred during login');
  }
};

export const signUp = async (data: SignUpData) => {
  try {
    const response = await api.post('api/auth/signup', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'An error occurred during signup');
  }
}; 