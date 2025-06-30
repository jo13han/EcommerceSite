'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, { password });
      toast.success(res.data.message);
      router.push('/login');
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
      <h2 className="text-3xl sm:text-4xl font-medium text-black mb-6">Reset Your Password</h2>
      <p className="text-black mb-8">
        Choose a new password for your account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full border-b border-gray-300 py-2 text-gray-500 focus:outline-none focus:border-[#DB4444]"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
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
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm; 