'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { AxiosError } from 'axios';

const SignUpForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const { setToken, setSessionId, setUser } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/api/auth/signup', { name, email, password });
      setStep(2);
      setInfo('OTP sent to your email.');
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.post('/api/auth/verify-otp', { email, emailOtp });
      setInfo('Account verified! Redirecting to home...');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    setIsLoading(true);
    try {
      await api.post('/api/auth/resend-otp', { email });
      setInfo('OTP resent to your email.');
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(axiosError.response?.data?.error || (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Send user info to backend to create or login user
      const res = await api.post('/api/auth/google-signup', {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
        photoURL: user.photoURL
      });
      // Save token and sessionId (if returned) and update AuthContext
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data.sessionId) {
        localStorage.setItem('sessionId', res.data.sessionId);
      }
      if (res.data.token && res.data.user) {
        setToken(res.data.token);
        setSessionId(res.data.sessionId || null);
        setUser(res.data.user);
      }
      setInfo('Signed up with Google: ' + user.email);
      setTimeout(() => router.push('/'), 1500);
    } catch (error) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      }
      setError('Google sign-in failed: ' + message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div>
        <h2 className="text-3xl sm:text-4xl mb-6 text-black">Create an account</h2>
        <p className="mb-12 text-black">{step === 1 ? 'Enter your details below' : 'Enter the OTP sent to your email'}</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {info}
          </div>
        )}

        {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-12 w-full">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
              required
            />
          </div>
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
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#DB4444] text-white py-3 rounded hover:bg-[#c03a3a] transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8 w-full">
            <div>
              <input
                type="text"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="Enter Email OTP"
                className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
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
              {isLoading ? 'Verifying...' : 'Verify OTPs'}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="w-full mt-2 bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition-colors"
            >
              Resend OTP
            </button>
          </form>
        )}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full border border-gray-300 py-3 rounded mb-3 text-black"
          >
            <Image src="/images/login/google-icon.svg" width={20} height={20} alt="Google" className="mr-2" />
            Sign up with Google
          </button>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
          <span className="text-black">Already have account? </span>
          <Link href="/login" className="text-[#DB4444] hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
