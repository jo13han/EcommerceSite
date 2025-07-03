"use client";
import Link from "next/link";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function AccountSection() {
  const [activeSection, setActiveSection] = useState<string | null>("profile");
  const [activeSubSection, setActiveSubSection] = useState<string | null>("profile");
  const [isMobileMenuOpen] = useState(false);
  const { user, token } = useAuth();

  // Fetch profile from backend (example endpoint: /api/auth/profile)
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!token) return null;
      const res = await api.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
      return res.data;
    },
    enabled: !!token,
    initialData: user ? {
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      address: user.address || '',
    } : null,
  });

  const handleSidebarClick = (section: string, subSection: string) => {
    setActiveSection(section);
    setActiveSubSection(subSection);
  };

  // Password change form
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      await api.post('/api/auth/change-password', data, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      toast.success('Password changed successfully!');
      reset();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || 'Failed to change password';
      toast.error(errorMessage);
    },
  });

  return (
    <div className="container mx-auto px-4 py-6 sm:py-12">
      <div className="text-sm text-gray-500 mb-6 sm:mb-8 flex gap-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-black">My Account</span>
      </div>

      {/* If not logged in, show a message instead of the profile form */}
      {!user ? (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 border text-center">
          <h2 className="text-2xl font-semibold text-[#DB4444] mb-4">Please log in to view your account.</h2>
          <Link href="/login" className="text-[#DB4444] underline">Go to Login</Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`w-full md:w-1/4 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="space-y-6 text-black bg-white rounded-lg border p-4 md:p-6">
              <div>
                <button 
                  className="w-full flex items-center justify-between font-semibold mb-2"
                  onClick={() => setActiveSection("profile")}
                >
                  <span>Manage My Account</span>
                  {activeSection === "profile" ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <ul className={`space-y-2 text-sm transition-all duration-300 ${activeSection === "profile" ? 'block' : 'hidden md:block'}`}>
                  <li className={`${activeSubSection === "profile" ? "text-[#DB4444] font-medium" : "text-gray-500"} py-2 px-3 rounded hover:bg-gray-50 cursor-pointer`} onClick={() => handleSidebarClick("profile", "profile")}>My Profile</li>
                  <li className={`${activeSubSection === "address" ? "text-[#DB4444] font-medium" : "text-gray-500"} py-2 px-3 rounded hover:bg-gray-50 cursor-pointer`} onClick={() => handleSidebarClick("profile", "address")}>Address Book</li>
                  <li className={`${activeSubSection === "payment" ? "text-[#DB4444] font-medium" : "text-gray-500"} py-2 px-3 rounded hover:bg-gray-50 cursor-pointer`} onClick={() => handleSidebarClick("profile", "payment")}>My Payment Options</li>
                </ul>
              </div>
              <div>
                <button 
                  className="w-full flex items-center justify-between font-semibold mb-2"
                  onClick={() => setActiveSection("orders")}
                >
                  <span>My Orders</span>
                  {activeSection === "orders" ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <ul className={`space-y-2 text-sm transition-all duration-300 ${activeSection === "orders" ? 'block' : 'hidden md:block'}`}>
                  <li className={`${activeSubSection === "returns" ? "text-[#DB4444] font-medium" : "text-gray-500"} py-2 px-3 rounded hover:bg-gray-50 cursor-pointer`} onClick={() => handleSidebarClick("orders", "returns")}>My Returns</li>
                  <li className={`${activeSubSection === "cancellations" ? "text-[#DB4444] font-medium" : "text-gray-500"} py-2 px-3 rounded hover:bg-gray-50 cursor-pointer`} onClick={() => handleSidebarClick("orders", "cancellations")}>My Cancellations</li>
                </ul>
              </div>
              <div>
                <button 
                  className="w-full flex items-center justify-between font-semibold mb-2"
                  onClick={() => setActiveSection("wishlist")}
                >
                  <span>My WishList</span>
                  {activeSection === "wishlist" ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-2xl flex justify-end mb-4">
              <span className="text-black">Welcome! <span className="text-[#DB4444] font-medium">{profile ? `${profile.firstName} ${profile.lastName}` : ''}</span></span>
            </div>
            {/* Main content area switches based on activeSection and activeSubSection */}
            {activeSection === "profile" && activeSubSection === "profile" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-10 border">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#DB4444]">Edit Your Profile</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block mb-2 text-sm sm:text-base text-black">First Name</label>
                    <input 
                      value={profile ? profile.firstName : ''} 
                      disabled 
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm sm:text-base text-black">Last Name</label>
                    <input 
                      value={profile ? profile.lastName : ''} 
                      disabled 
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm sm:text-base text-black">Email</label>
                    <input 
                      value={profile ? profile.email : ''} 
                      disabled 
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm sm:text-base text-black">Address</label>
                    <input 
                      value={profile ? profile.address : ''} 
                      disabled 
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base" 
                    />
                  </div>
                </div>
                <form onSubmit={handleSubmit((data) => passwordMutation.mutate(data))} className="mt-8">
                  <div className="font-semibold mb-2 text-black">Password Changes</div>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      {...register('currentPassword')}
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
                    />
                    {errors.currentPassword && <span className="text-red-500 text-xs">{errors.currentPassword.message}</span>}
                    <input
                      type="password"
                      placeholder="New Password"
                      {...register('newPassword')}
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
                    />
                    {errors.newPassword && <span className="text-red-500 text-xs">{errors.newPassword.message}</span>}
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      {...register('confirmPassword')}
                      className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
                    <button 
                      type="button" 
                      className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 border border-gray-400 rounded text-black bg-white hover:bg-gray-50 transition-colors duration-300"
                      onClick={() => reset()}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-[#DB4444] text-white rounded hover:opacity-90 font-medium transition-opacity duration-300"
                      disabled={passwordMutation.status === 'pending'}
                    >
                      {passwordMutation.status === 'pending' ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeSection === "profile" && activeSubSection === "address" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-lg font-semibold mb-4 text-[#DB4444]">Address Book</h2>
                <div className="text-gray-500">No addresses saved yet.</div>
              </div>
            )}
            {activeSection === "profile" && activeSubSection === "payment" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-lg font-semibold mb-4 text-[#DB4444]">My Payment Options</h2>
                <div className="text-gray-500">No payment methods added yet.</div>
              </div>
            )}
            {activeSection === "orders" && activeSubSection === "returns" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-lg font-semibold mb-4 text-[#DB4444]">My Returns</h2>
                <div className="text-gray-500">You have no returns.</div>
              </div>
            )}
            {activeSection === "orders" && activeSubSection === "cancellations" && (
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm p-6 border">
                <h2 className="text-lg font-semibold mb-4 text-[#DB4444]">My Cancellations</h2>
                <div className="text-gray-500">You have no cancellations.</div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
