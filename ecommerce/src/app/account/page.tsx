'use client';
import AccountSection from '@/sections/Account/AccountSection';

export default function AccountPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">

      <main className="flex-1">
        <AccountSection />
      </main>
    </div>
  );
}
