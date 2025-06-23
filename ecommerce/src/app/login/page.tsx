'use client';
import LoginForm from '@/sections/Login/LoginForm';
import Image from 'next/image';

export default function Login() {
  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/images/login/loginsignin.png" 
              alt="Login" 
              width={500}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
          
          {/* Right side - Login Form */}
          <div className="w-full md:w-1/2">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
