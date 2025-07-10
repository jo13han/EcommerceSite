import React from 'react';

export default function OrderConfirmation() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  const formattedDate = deliveryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-8 rounded shadow border">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Your order is placed!</h1>
        <p className="text-lg text-black mb-2">Thank you for shopping with us.</p>
        <p className="text-md text-gray-700">Expected delivery: <span className="font-semibold">{formattedDate}</span></p>
      </div>
    </div>
  );
} 