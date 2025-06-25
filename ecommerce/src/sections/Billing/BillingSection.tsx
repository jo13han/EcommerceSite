"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { AxiosError } from "axios";

const paymentIcons = [
  "/images/billing/bkash.png",
  "/images/billing/visa.png",
  "/images/billing/mastercard.png",
  "/images/billing/nagad.png",
];

interface CartItem {
  productId: string;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

export default function BillingSection() {
  const [payment, setPayment] = useState("cod");
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/cart');
        setCartItems(response.data);
        setError(null);
      } catch (error) {
        const axiosError = error as AxiosError;
        setError('Failed to fetch cart');
        console.error('Error fetching cart:', axiosError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4 md:mb-8 flex flex-wrap gap-x-2 gap-y-1 items-center">
        <span>Account</span>
        <span>/</span>
        <span>My Account</span>
        <span>/</span>
        <span>Product</span>
        <span>/</span>
        <span>View Cart</span>
        <span>/</span>
        <span className="text-black font-semibold">Checkout</span>
      </div>
      <div className="flex flex-col md:flex-row gap-12">
        {/* Billing Form */}
        <div className="flex-1">
          <h2 className="text-3xl mb-8 text-black">Billing Details</h2>
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-black">First Name<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black " required />
            </div>
            <div>
              <label className="block mb-2 text-black">Company Name</label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" />
            </div>
            <div>
              <label className="block mb-2 text-black">Street Address<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" required />
            </div>
            <div>
              <label className="block  mb-2 text-black">Apartment, floor, etc. (optional)</label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" />
            </div>
            <div>
              <label className="block  mb-2 text-black">Town/City<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" required />
            </div>
            <div>
              <label className="block  mb-2 text-black">Phone Number<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" required />
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" id="save-info" className="accent-[#DB4444] w-5 h-5 mr-2" />
              <label htmlFor="save-info" className="text-black select-none">Save this information for faster check-out next time</label>
            </div>
          </form>
        </div>
        {/* Order Summary */}
        <div className="flex-1 max-w-lg w-full">
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-gray-500">Loading cart...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : cartItems.length === 0 ? (
                <div className="text-gray-500">Your cart is empty</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <Image src={item.image} alt={item.title} width={40} height={40} className="object-contain" />
                    <span className="flex-1 text-black">{item.title}</span>
                    <span className="font-medium text-black">${item.price} x {item.quantity}</span>
                  </div>
                ))
              )}
            </div>
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-black"><span>Subtotal:</span><span>${calculateTotal().toFixed(2)}</span></div>
              <div className="flex justify-between text-black"><span>Shipping:</span><span>Free</span></div>
              <div className="flex justify-between text-black font-semibold"><span>Total:</span><span>${calculateTotal().toFixed(2)}</span></div>
            </div>
            {/* Payment Methods */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input type="radio" id="bank" name="payment" checked={payment === 'bank'} onChange={()=>setPayment('bank')} className="accent-black" />
                <label htmlFor="bank" className="text-black">Bank</label>
                <div className="flex gap-1 ml-2">
                  {paymentIcons.map((icon, i) => (
                    <Image key={i} src={icon} alt="pay" width={32} height={32} className="object-contain" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="radio" id="cod" name="payment" checked={payment === 'cod'} onChange={()=>setPayment('cod')} className="accent-black" />
                <label htmlFor="cod" className="text-black">Cash on delivery</label>
              </div>
            </div>
            {/* Coupon & Place Order Buttons Responsive */}
            <div className="flex flex-col md:flex-row gap-2 mt-4">
              <input type="text" placeholder="Coupon Code" className="border rounded px-4 py-3 flex-1 text-black w-full md:w-auto" />
              <button className="bg-[#DB4444] text-white px-8 py-3 rounded hover:opacity-90 transition-opacity w-full md:w-auto">Apply Coupon</button>
            </div>
            <button className="w-full md:w-1/2 bg-[#DB4444] text-white py-4 rounded mt-2 md:mt-4 hover:opacity-90 transition-opacity text-lg font-medium">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
