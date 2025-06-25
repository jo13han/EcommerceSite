'use client';
import { useEffect, useState, useCallback } from 'react';
import Card from '@/components/Card';
import NavigationArrows from '@/components/NavigationArrows';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface Product {
  productId: string;
  id?: string;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discountPercentage?: number;
}

const WishlistSection = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.get('/api/wishlist');
      const products = Array.isArray(response.data)
        ? response.data.map(item => item.product || item)
        : [];
      setWishlistProducts(products);
      setError(null);
    } catch (error) {
      setError('Failed to fetch wishlist');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!token) return;

    try {
      await api.delete(`/api/wishlist/remove/${productId}`);
      setWishlistProducts(prev => prev.filter(p => p.productId !== productId));
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      console.error('Error removing from wishlist:', axiosError.response?.data || (error as Error).message);
      setError(axiosError.response?.data?.error || 'Failed to remove from wishlist');
    }
  };

  // ... rest of your component code ...

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-medium text-black">Wishlist ({wishlistProducts.length})</h1>
            <button className="bg-white text-black border-1 px-8 py-2 rounded hover:opacity-90 transition-opacity">
              Move All To Bag
            </button>
          </div>
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <Card
                  key={String(product.productId ?? product.id ?? '')}
                  productId={String(product.productId ?? product.id ?? '')}
                  image={product.image}
                  title={product.title}
                  price={Number(product.price.toFixed(2))}
                  originalPrice={product.originalPrice ? Number(product.originalPrice.toFixed(2)) : undefined}
                  rating={Math.round(product.rating)}
                  reviewCount={product.reviewCount}
                  discountPercentage={product.discountPercentage ? Math.round(product.discountPercentage) : undefined}
                  isWishlistItem={true}
                  onRemoveFromWishlist={() => handleRemoveFromWishlist(String(product.productId ?? product.id ?? ''))}
                  onWishlistChange={fetchWishlist}
                />
              ))}
            </div>
          )}
        </div>

        {/* Rest of your component (Just For You section) */}
      </div>
    </>
  );
};

export default WishlistSection;