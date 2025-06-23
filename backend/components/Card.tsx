'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface CardProps {
  productId: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  discountPercentage?: number;
  isWishlistItem?: boolean;
  onRemoveFromWishlist?: () => void;
}

const Card = ({
  productId,
  image,
  title,
  price,
  originalPrice,
  rating = 0,
  reviewCount = 0,
  discountPercentage,
  isWishlistItem = false,
  onRemoveFromWishlist
}: CardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  // Check if product is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!token || !productId) return;
      
      try {
        const response = await api.get(`/api/wishlist/check/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsWishlisted(response.data.isWishlisted);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [productId, token]);

  const handleWishlistToggle = async () => {
    if (!token || !productId) {
      // Handle not logged in state (e.g., show login modal)
      return;
    }

    setIsLoading(true);
    try {
      if (isWishlisted) {
        // Remove from wishlist
        await api.delete(`/api/wishlist/remove/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (onRemoveFromWishlist) {
          onRemoveFromWishlist();
        }
      } else {
        // Add to wishlist
        await api.post('/api/wishlist/add', 
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      console.log('No token available - user not logged in');
      return;
    }

    try {
      const productData = {
        productId,
        image,
        title,
        price,
        originalPrice,
        rating,
        reviewCount,
        discountPercentage
      };

      console.log('Adding to cart:', productData);
      const response = await api.post('/api/cart', 
        { product: productData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Add to cart response:', response.data);
    } catch (error: any) {
      console.error('Error adding to cart:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            -{discountPercentage}%
          </div>
        )}
        <button
          onClick={handleWishlistToggle}
          disabled={isLoading}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600'
          } hover:bg-red-500 hover:text-white transition-colors duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card; 