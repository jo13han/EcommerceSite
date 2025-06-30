'use client';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      toast.success(res.data.message);
    } catch (err) {
      const errorMessage = err instanceof AxiosError && err.response?.data?.error 
        ? err.response.data.error
        : 'An unknown error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl sm:text-4xl font-medium text-black mb-6">Forgot Your Password?</h2>
      <p className="text-black mb-8">
        No problem. Enter the email address associated with your account, and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full border-b border-gray-300 py-2 text-gray-500 focus:outline-none focus:border-[#DB4444]"
            required
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#DB4444] text-white py-3 rounded hover:bg-[#c03a3a] transition-colors ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm; 