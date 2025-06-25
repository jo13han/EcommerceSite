import api from '@/lib/api';
import { AxiosError } from 'axios';

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
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    throw new Error(axiosError.response?.data?.error || 'An error occurred during login');
  }
};

export const signUp = async (data: SignUpData) => {
  try {
    const response = await api.post('api/auth/signup', data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>;
    throw new Error(axiosError.response?.data?.error || 'An error occurred during signup');
  }
}; 