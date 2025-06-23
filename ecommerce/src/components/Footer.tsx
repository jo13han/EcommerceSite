"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import api from '@/lib/api';

const Footer = () => {
  const { user, token } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!user || !user.email) return;
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/subscribe', { email: user.email });
      setSubscribed(true);
    } catch (err: any) {
      setError('Failed to subscribe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white pt-10 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-x-8 gap-y-10 mb-10">
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-6">Exclusive</h3>
            <p className="mb-4">Subscribe</p>
            <p className="mb-4 text-sm font-light">
              Get 10% off your first order
            </p>
            <div className="relative mt-4 max-w-xs mx-auto sm:mx-0">
              <input
                type="email"
                placeholder={user ? user.email : 'Login to subscribe'}
                className="bg-black border border-white rounded-md px-4 py-2 w-full pr-10 text-sm"
                value={user ? user.email : ''}
                disabled
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleSubscribe}
                disabled={!user || !user.email || subscribed || loading}
                style={{ opacity: (!user || !user.email || subscribed || loading) ? 0.5 : 1 }}
              >
                <Image className="cursor-pointer"
                  src="/images/footer/sendicon.png"
                  alt="Send"
                  width={24}
                  height={24}
                />
              </button>
              {subscribed && (
                <div className="text-green-400 text-xs mt-2">Thank you for subscribing!</div>
              )}
              {error && (
                <div className="text-red-400 text-xs mt-2">{error}</div>
              )}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-6">Support</h3>
            <p className="mb-4 font-light text-sm">
              111 Bijoy sarani, Dhaka,
              <br />
              DH 1515, Bangladesh.
            </p>
            <p className="mb-4 text-sm font-light">exclusive@gmail.com</p>
            <p className="text-sm font-light">+88015-88888-9999</p>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-6">Account</h3>
            <ul className="space-y-2 font-light text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Login / Register
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-6">Quick Link</h3>
            <ul className="space-y-2 font-light text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold mb-6">Download App</h3>
            <p className="text-xs text-gray-400 mb-4">
              Save $3 with App New User Only
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <Link href="#" className="w-full max-w-[200px]">
                <Image
                  src="/images/footer/frame.png"
                  alt="App Store"
                  width={200}
                  height={100}
                  className="w-full h-auto"
                />
              </Link>
            </div>

            <div className="flex gap-6 mt-8 items-center justify-center sm:justify-start">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/footer/facebookicon.png"
                  alt="Facebook"
                  width={30}
                  height={30}
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/footer/twittericon.png"
                  alt="Twitter"
                  width={30}
                  height={30}
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/footer/instagramicon.png"
                  alt="Instagram"
                  width={30}
                  height={30}
                />
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/images/footer/linkedinicon.png"
                  alt="Linkedin"
                  width={30}
                  height={30}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs sm:text-sm">
          <p>© Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
