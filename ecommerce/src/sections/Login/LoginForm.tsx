'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const LoginForm = () => {
  const router = useRouter();
  const { login, setToken, setSessionId, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Force a full client-side reload to update UI
      window.location.href = '/';
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Send user info to backend to login
      const res = await api.post('/api/auth/google-login', {
        email: user.email,
        googleId: user.uid,
      });
      // Save token and sessionId (if returned) and update AuthContext
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data.sessionId) {
        localStorage.setItem('sessionId', res.data.sessionId);
      }
      // Update AuthContext state
      if (res.data.token && res.data.user) {
        setToken(res.data.token);
        setSessionId(res.data.sessionId || null);
        setUser(res.data.user);
      }
      router.push('/');
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      setError('Google login failed: ' + message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-medium text-black mb-6">Log in to Exclusive</h2>
        <p className="text-black mb-12">Enter your details below</p>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-12 w-full">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto bg-[#DB4444] text-white py-3 px-8 rounded hover:bg-[#c03a3a] transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
            <Link href="/forgot-password" className="text-[#DB4444] hover:underline">
              Forget Password?
            </Link>
          </div>
        </form>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-2">
        <span className="text-black">Don&apos;t have an account? </span>
        <Link href="/signup" className="text-[#DB4444] hover:underline">
          Sign Up
        </Link>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full border border-gray-300 py-3 rounded mb-3 text-black"
        >
          <Image src="/images/login/google-icon.svg" width={20} height={20} alt="Google" className="mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
