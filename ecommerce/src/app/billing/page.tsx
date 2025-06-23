'use client';
import BillingSection from '@/sections/Billing/BillingSection';

export default function BillingPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-1">
        <BillingSection />
      </main>
    </div>
  );
}
