'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Image from 'next/image';

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    api.get(`/api/orders/${user._id}`)
      .then(async res => {
        setOrders(res.data);
        setError('');
        // Collect all unique productIds
        const ids = Array.from(new Set(res.data.flatMap((order: { products: { productId: string }[] }) => order.products.map((p: { productId: string }) => p.productId))));
        if (ids.length) {
          const prodRes = await api.get(`/api/products/bulk?ids=${ids.join(',')}`);
          const map: Record<string, { _id: string; image?: string; name?: string }> = {};
          prodRes.data.forEach((prod: { _id: string; image?: string; name?: string }) => {
            map[prod._id] = prod;
          });
          setProductMap(map);
        }
      })
      .catch(() => {
        setError('Failed to fetch orders');
      })
      .finally(() => setLoading(false));
  }, [user?._id]);

  if (!token) {
    return <div className="container mx-auto px-4 py-12 text-center text-black">Please log in to view your orders.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="container mx-auto px-4 py-12 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-8 text-black">My Orders</h1>
        {loading ? (
          <div>Loading orders...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-gray-500">You have no orders yet.</div>
        ) : (
          <div className="space-y-10">
            {orders.map((order: { _id: string; createdAt: string; status: string; streetAddress: string; apartment: string; town: string; paymentMethod: string; products: { productId: string; quantity: number; price: number }[] }) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="text-black font-semibold">Order Date: <span className="font-normal">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                  <div className="text-black">Status: <span className="font-medium capitalize text-blue-600">{order.status}</span></div>
                </div>
                <div className="mb-2 text-black">Delivery Address: <span className="font-normal">{order.streetAddress}, {order.apartment}, {order.town}</span></div>
                <div className="mb-2 text-black">Payment Method: <span className="font-normal">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank'}</span></div>
                <div className="mb-4 text-black font-medium">Products:</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Image</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Quantity</th>
                        <th className="px-4 py-2 text-left text-gray-700 font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((p: { productId: string; quantity: number; price: number }, idx: number) => {
                        const prod = productMap[p.productId];
                        return (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-4 py-2">
                              {prod && prod.image && (
                                <Image src={prod.image} alt={prod.name} width={40} height={40} className="object-contain rounded" />
                              )}
                            </td>
                            <td className="px-4 py-2 text-black">{prod ? prod.name : p.productId}</td>
                            <td className="px-4 py-2 text-black">{p.quantity}</td>
                            <td className="px-4 py-2 text-black">${p.price}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 