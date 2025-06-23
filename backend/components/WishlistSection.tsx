'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/Card';
import NavigationArrows from '@/components/NavigationArrows';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  reviews: number;
  discountPercentage: number;
}

const WishlistSection = () => {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Fetching wishlist with token:', token);
        const response = await api.get('/api/wishlist', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Wishlist response:', response.data);
        setWishlistProducts(response.data.map((item: any) => item.product));
        setError(null);
      } catch (error: any) {
        console.error('Error fetching wishlist:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to fetch wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!token) return;

    try {
      await api.delete(`/api/wishlist/remove/${productId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setWishlistProducts(prev => prev.filter(p => p._id !== productId));
      setError(null);
    } catch (error: any) {
      console.error('Error removing from wishlist:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'Failed to remove from wishlist');
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
                  key={product._id}
                  productId={product._id}
                  image={product.image}
                  title={product.name}
                  price={Number(product.discountedPrice.toFixed(2))}
                  originalPrice={product.originalPrice ? Number(product.originalPrice.toFixed(2)) : undefined}
                  rating={Math.round(product.rating)}
                  reviewCount={product.reviews}
                  discountPercentage={product.discountPercentage ? Math.round(product.discountPercentage) : undefined}
                  isWishlistItem={true}
                  onRemoveFromWishlist={() => handleRemoveFromWishlist(product._id)}
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