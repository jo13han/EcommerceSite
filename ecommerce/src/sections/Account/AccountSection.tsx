"use client";
import Link from "next/link";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function AccountSection() {
  const [activeSection, setActiveSection] = useState<string | null>("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const profile = user
    ? {
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        address: (user as any).address || '',
      }
    : null;

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

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
                  onClick={() => toggleSection("profile")}
                >
                  <span>Manage My Account</span>
                  {activeSection === "profile" ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <ul className={`space-y-2 text-sm transition-all duration-300 ${activeSection === "profile" ? 'block' : 'hidden md:block'}`}>
                  <li className="text-[#DB4444] font-medium py-2 px-3 rounded hover:bg-gray-50">My Profile</li>
                  <li className="text-gray-500 py-2 px-3 rounded hover:bg-gray-50">Address Book</li>
                  <li className="text-gray-500 py-2 px-3 rounded hover:bg-gray-50">My Payment Options</li>
                </ul>
              </div>
              <div>
                <button 
                  className="w-full flex items-center justify-between font-semibold mb-2"
                  onClick={() => toggleSection("orders")}
                >
                  <span>My Orders</span>
                  {activeSection === "orders" ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                <ul className={`space-y-2 text-sm transition-all duration-300 ${activeSection === "orders" ? 'block' : 'hidden md:block'}`}>
                  <li className="text-gray-500 py-2 px-3 rounded hover:bg-gray-50">My Returns</li>
                  <li className="text-gray-500 py-2 px-3 rounded hover:bg-gray-50">My Cancellations</li>
                </ul>
              </div>
              <div>
                <button 
                  className="w-full flex items-center justify-between font-semibold mb-2"
                  onClick={() => toggleSection("wishlist")}
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
              <div className="font-semibold mb-2 text-black">Password Changes</div>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full bg-gray-100 border rounded px-3 sm:px-4 py-2 sm:py-3 outline-none text-black text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">
                <button 
                  type="button" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 border border-gray-400 rounded text-black bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-[#DB4444] text-white rounded hover:opacity-90 font-medium transition-opacity duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
