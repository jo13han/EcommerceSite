'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const { login, setToken, setSessionId, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      // Use your context login for side effects, but return API data for error handling
      await login(data.email, data.password);
    },
    onSuccess: () => {
      toast.success('Login Successful!');
      window.location.href = '/';
    },
    onError: (err: unknown) => {
      const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'Login failed';
      toast.error(errorMessage);
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await api.post('/api/auth/google-login', {
        email: user.email,
        googleId: user.uid,
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
      toast.success('Google Login Successful!');
      router.push('/');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (error as { message?: string })?.message
        || 'Google Login Failed';
      toast.error(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div>
        <h2 className="text-3xl sm:text-4xl font-medium text-black mb-6">Log in to ExclusiveIO</h2>
        <p className="text-black mb-12">Enter your details below</p>
        <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="space-y-12 w-full">
          <div>
            <input
              type="email"
              {...register('email')}
              placeholder="Email"
              className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
              required
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>
          <div>
            <input
              type="password"
              {...register('password')}
              placeholder="Password"
              className="w-full border-b border-gray-300 py-2 text-gray-400 focus:outline-none focus:border-[#DB4444]"
              required
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <button 
              type="submit"
              disabled={loginMutation.status === 'pending'}
              className={`w-full sm:w-auto bg-[#DB4444] text-white py-3 px-8 rounded hover:bg-[#c03a3a] transition-colors ${
                loginMutation.status === 'pending' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loginMutation.status === 'pending' ? 'Logging in...' : 'Log In'}
            </button>
            <a href="/forgot-password" className="text-[#DB4444] hover:underline">
              Forget Password?
            </a>
          </div>
        </form>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-2">
        <span className="text-black">Don&apos;t have an account? </span>
        <a href="/signup" className="text-[#DB4444] hover:underline">
          Sign Up
        </a>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full border border-gray-300 py-3 rounded mb-3 text-black"
        >
          <img src="/images/login/google-icon.svg" width={20} height={20} alt="Google" className="mr-2" />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
