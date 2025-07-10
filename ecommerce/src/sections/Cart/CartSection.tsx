'use client';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CartItem {
  productId: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  discountPercentage?: number;
  quantity: number;
}

const CartSection = () => {
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch cart
  const {
    data: cartItems = [],
    isLoading,
    isError
  } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!token) return [];
      const response = await api.get('/api/cart');
      return response.data;
    },
    enabled: !!token,
  });

  // Remove from cart
  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/api/cart/remove/${productId}`);
      return productId;
    },
    onSuccess: (productId: string) => {
      queryClient.setQueryData(['cart'], (old: CartItem[] = []) => old.filter(item => item.productId !== productId));
      toast.success('Item removed from cart');
    },
    onError: () => {
      toast.error('Failed to remove item from cart');
    },
  });

  // Update quantity
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, newQuantity }: { productId: string; newQuantity: number }) => {
      await api.put(`/api/cart/update/${productId}`, { quantity: newQuantity });
      return { productId, newQuantity };
    },
    onSuccess: ({ productId, newQuantity }) => {
      queryClient.setQueryData(['cart'], (old: CartItem[] = []) =>
        old.map(item => item.productId === productId ? { ...item, quantity: newQuantity } : item)
      );
    },
    onError: () => {
      toast.error('Failed to update quantity');
    },
  });

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">Failed to fetch cart</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-medium text-black mb-8">Shopping Cart ({cartItems.length})</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-lg mb-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-black">{item.title}</h3>
                  <p className="text-[#DB4444] font-medium">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantityMutation.mutate({ productId: item.productId, newQuantity: item.quantity - 1 })}
                      className="p-1 hover:bg-gray-100 rounded text-black"
                      disabled={updateQuantityMutation.status === 'pending'}
                    >
                      <FiMinus className="h-4 w-4 text-black" />
                    </button>
                    <span className="w-8 text-center text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantityMutation.mutate({ productId: item.productId, newQuantity: item.quantity + 1 })}
                      className="p-1 hover:bg-gray-100 rounded text-black"
                      disabled={updateQuantityMutation.status === 'pending'}
                    >
                      <FiPlus className="h-4 w-4 text-black" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeMutation.mutate(item.productId)}
                  className="p-2 hover:bg-gray-100 rounded"
                  disabled={removeMutation.status === 'pending'}
                >
                  <FiTrash2 className="h-5 w-5 text-red-500 cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1 text-black">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/billing')}
                className="w-full bg-[#DB4444] text-white py-3 rounded hover:opacity-90 transition-opacity cursor-pointer">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSection;
