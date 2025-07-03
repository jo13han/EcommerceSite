'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const otpSchema = z.object({
  emailOtp: z.string().min(4, 'OTP is required'),
});

type SignupFormValues = z.infer<typeof signupSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const { setToken, setSessionId, setUser } = useAuth();

  // Signup form
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // OTP form
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormValues) => {
      await api.post('/api/auth/signup', data);
      setEmail(data.email);
    },
    onSuccess: () => {
      setStep(2);
      toast.success('OTP sent to your email. Please verify.');
    },
    onError: (err: unknown) => {
      const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'Signup failed';
      toast.error(errorMessage);
    },
  });

  // OTP verification mutation
  const otpMutation = useMutation({
    mutationFn: async (data: OtpFormValues) => {
      const res = await api.post('/api/auth/verify-otp', { email, emailOtp: data.emailOtp });
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
    },
    onSuccess: () => {
      toast.success('Account Verified Successfully! Redirecting...');
      setTimeout(() => router.push('/'), 1500);
    },
    onError: (err: unknown) => {
      const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'OTP verification failed';
      toast.error(errorMessage);
    },
  });

  // Resend OTP
  const resendOtpMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/resend-otp', { email });
    },
    onSuccess: () => {
      toast.success('A new OTP has been sent to your email.');
    },
    onError: (err: unknown) => {
      const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'Failed to resend OTP';
      toast.error(errorMessage);
    },
  });

  // Google signup
  const [googleLoading, setGoogleLoading] = useState(false);
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await api.post('/api/auth/google-signup', {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
        photoURL: user.photoURL
      });
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
      toast.success(`Google Sign-up Successful!`);
      setTimeout(() => router.push('/'), 1500);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (error as { message?: string })?.message
        || 'Google Sign-up Failed';
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div>
        <h2 className="text-3xl sm:text-4xl mb-6 text-black">Create an account</h2>
        <p className="mb-12 text-black">{step === 1 ? 'Enter your details below' : 'Enter the OTP sent to your email'}</p>
        {step === 1 ? (
          <form onSubmit={handleSignupSubmit((data) => signupMutation.mutate(data))} className="space-y-12 w-full">
            <div>
              <input
                type="text"
                {...registerSignup('name')}
                placeholder="Name"
                className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
                required
              />
              {signupErrors.name && <span className="text-red-500 text-xs">{signupErrors.name.message}</span>}
            </div>
            <div>
              <input
                type="email"
                {...registerSignup('email')}
                placeholder="Email"
                className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
                required
              />
              {signupErrors.email && <span className="text-red-500 text-xs">{signupErrors.email.message}</span>}
            </div>
            <div>
              <input
                type="password"
                {...registerSignup('password')}
                placeholder="Password"
                className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
                required
              />
              {signupErrors.password && <span className="text-red-500 text-xs">{signupErrors.password.message}</span>}
            </div>
            <button
              type="submit"
              disabled={signupMutation.status === 'pending'}
              className={`w-full bg-[#DB4444] text-white py-3 rounded hover:bg-[#c03a3a] transition-colors ${
                signupMutation.status === 'pending' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {signupMutation.status === 'pending' ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit((data) => otpMutation.mutate(data))} className="space-y-8 w-full">
            <div>
              <input
                type="text"
                {...registerOtp('emailOtp')}
                placeholder="Enter Email OTP"
                className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
                required
              />
              {otpErrors.emailOtp && <span className="text-red-500 text-xs">{otpErrors.emailOtp.message}</span>}
            </div>
            <button
              type="submit"
              disabled={otpMutation.status === 'pending'}
              className={`w-full bg-[#DB4444] text-white py-3 rounded hover:bg-[#c03a3a] transition-colors ${
                otpMutation.status === 'pending' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {otpMutation.status === 'pending' ? 'Verifying...' : 'Verify OTPs'}
            </button>
            <button
              type="button"
              onClick={() => resendOtpMutation.mutate()}
              disabled={resendOtpMutation.status === 'pending'}
              className="w-full mt-2 bg-gray-200 text-black py-3 rounded hover:bg-gray-300 transition-colors"
            >
              {resendOtpMutation.status === 'pending' ? 'Resending...' : 'Resend OTP'}
            </button>
          </form>
        )}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full border border-gray-300 py-3 rounded mb-3 text-black"
            disabled={googleLoading}
          >
            <Image src="/images/login/google-icon.svg" width={20} height={20} alt="Google" className="mr-2" />
            {googleLoading ? 'Signing up...' : 'Sign up with Google'}
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
