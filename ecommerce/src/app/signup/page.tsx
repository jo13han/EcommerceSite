'use client';
import { Poppins } from 'next/font/google';
import SignUpForm from '@/sections/Login/SignUpForm';
import Image from 'next/image';

const poppins = Poppins({
  weight: ['200','300','400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function SignUp() {
  return (
    <div className={`min-h-screen w-full bg-white ${poppins.className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/images/login/loginsignin.png" 
              alt="Sign Up" 
              width={500}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
          
          {/* Right side - Sign Up Form */}
          <div className="w-full md:w-1/2">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
