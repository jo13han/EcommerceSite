"use client";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

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

const billingSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  companyName: z.string().optional(),
  street: z.string().min(1, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  saveInfo: z.boolean().optional(),
});

const couponSchema = z.object({
  coupon: z.string().min(1, 'Coupon code is required'),
});

export default function BillingSection() {
  const [payment, setPayment] = useState("cod");
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Fetch cart
  const {
    data: cartItems = [],
    isLoading,
    isError,
    error
  } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!token) return [];
      const response = await api.get('/api/cart');
      return response.data;
    },
    enabled: !!token,
  });

  // Billing form
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(billingSchema),
  });

  // Coupon form
  const { register: registerCoupon, handleSubmit: handleCouponSubmit, formState: { errors: couponErrors }, reset: resetCoupon } = useForm({
    resolver: zodResolver(couponSchema),
  });

  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await api.post('/api/order', { ...data, payment });
    },
    onSuccess: () => {
      toast.success('Order placed successfully!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: unknown) => {
      const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'Failed to place order';
      toast.error(errorMessage);
    },
  });

  // Apply coupon mutation
  const couponMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await api.post('/api/cart/apply-coupon', data);
    },
    onSuccess: () => {
      toast.success('Coupon applied!');
      resetCoupon();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: unknown) => {
      const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error
        || (err as { message?: string })?.message
        || 'Failed to apply coupon';
      toast.error(errorMessage);
    },
  });

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
          <form className="space-y-6" onSubmit={handleSubmit((data) => placeOrderMutation.mutate(data))}>
            <div>
              <label className="block mb-2 text-black">First Name<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black " {...register('firstName')} required />
              {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
            </div>
            <div>
              <label className="block mb-2 text-black">Company Name</label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" {...register('companyName')} />
            </div>
            <div>
              <label className="block mb-2 text-black">Street Address<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" {...register('street')} required />
              {errors.street && <span className="text-red-500 text-xs">{errors.street.message}</span>}
            </div>
            <div>
              <label className="block  mb-2 text-black">Apartment, floor, etc. (optional)</label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" {...register('apartment')} />
            </div>
            <div>
              <label className="block  mb-2 text-black">Town/City<span className="text-[#DB4444]">*</span></label>
              <input className="w-full bg-gray-50 border rounded px-4 py-3 outline-none text-black" {...register('city')} required />
              {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
            </div>
            <div className="flex items-center mt-2">
              <input type="checkbox" id="save-info" className="accent-[#DB4444] w-5 h-5 mr-2" {...register('saveInfo')} />
              <label htmlFor="save-info" className="text-black select-none">Save this information for faster check-out next time</label>
            </div>
            <button className="w-full md:w-1/2 bg-[#DB4444] text-white py-4 rounded mt-2 md:mt-4 hover:opacity-90 transition-opacity text-lg font-medium" type="submit" disabled={placeOrderMutation.status === 'pending'}>
              {placeOrderMutation.status === 'pending' ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        {/* Order Summary */}
        <div className="flex-1 max-w-lg w-full">
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-gray-500">Loading cart...</div>
              ) : isError ? (
                <div className="text-red-500">Failed to fetch cart</div>
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
            <form className="flex flex-col md:flex-row gap-2 mt-4" onSubmit={handleCouponSubmit((data) => couponMutation.mutate(data))}>
              <input type="text" placeholder="Coupon Code" className="border rounded px-4 py-3 flex-1 text-black w-full md:w-auto" {...registerCoupon('coupon')} />
              <button className="bg-[#DB4444] text-white px-8 py-3 rounded hover:opacity-90 transition-opacity w-full md:w-auto" type="submit" disabled={couponMutation.status === 'pending'}>
                {couponMutation.status === 'pending' ? 'Applying...' : 'Apply Coupon'}
              </button>
              {couponErrors.coupon && <span className="text-red-500 text-xs">{couponErrors.coupon.message}</span>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
