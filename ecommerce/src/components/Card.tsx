'use client';
import Image from "next/image";
import { FiHeart } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface CardProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  discountPercentage?: number;
  alt?: string;
  isNew?: boolean;
  colorOptions?: string[];
  isWishlistItem?: boolean;
  productId: string;
  onRemoveFromWishlist?: () => void;
  onWishlistChange?: () => void;
}

const Card = ({
  image,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  discountPercentage,
  isNew,
  colorOptions,
  isWishlistItem = false,
  productId,
  onRemoveFromWishlist,
  onWishlistChange
}: CardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  // Log props when component mounts
  useEffect(() => {
    console.log('Card component mounted with props:', {
      productId,
      title,
      isWishlistItem,
      hasToken: !!token
    });
  }, [productId, title, isWishlistItem, token]);

  // Check if product is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!token || !productId) {
        console.log('Skipping wishlist check - missing token or productId:', { 
          token: !!token, 
          productId,
          title
        });
        return;
      }
      
      try {
        console.log('Checking wishlist status for product:', { productId, title });
        const response = await api.get(`/api/wishlist/check/${productId}`);
        setIsWishlisted(response.data.isWishlisted);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };

    checkWishlistStatus();
  }, [productId, token, title]);

  // Check if product is in cart when component mounts
  useEffect(() => {
    const checkCartStatus = async () => {
      if (!token || !productId) return;
      try {
        const response = await api.get('/api/cart');
        const cartItems = Array.isArray(response.data) ? response.data : [];
        const found = cartItems.some(item => item.product && item.product.productId === productId);
        setIsInCart(found);
      } catch {
        // Optionally handle error
      }
    };
    checkCartStatus();
  }, [productId, token]);

  const handleWishlistToggle = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      if (isWishlisted) {
        await api.delete(`/api/wishlist/remove/${productId}`);
        if (onRemoveFromWishlist) onRemoveFromWishlist();
      } else {
        // First check if product is already in wishlist
        const checkResponse = await api.get(`/api/wishlist/check/${productId}`);
        
        if (checkResponse.data.isWishlisted) {
          alert('This product is already in your wishlist!');
          return;
        }

        await api.post('/api/wishlist', {
          product: {
            productId,
            image,
            title,
            price,
            originalPrice,
            rating,
            reviewCount,
            discountPercentage,
          }
        });
      }
      setIsWishlisted(!isWishlisted);
      if (onWishlistChange) onWishlistChange();
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    if (isInCart) return;
    // Defensive check for productId
    if (!productId) {
      console.error('Add to cart aborted: productId is missing!', {
        productId,
        image,
        title,
        price,
        originalPrice,
        rating,
        reviewCount,
        discountPercentage
      });
      alert('Cannot add to cart: productId is missing! Please contact support.');
      return;
    }
    setIsLoading(true);
    console.log('Add to cart payload:', {
      productId,
      image,
      title,
      price,
      originalPrice,
      rating,
      reviewCount,
      discountPercentage,
      quantity: 1
    });
    try {
      await api.post('/api/cart', {
        product: {
          productId,
          image,
          title,
          price,
          originalPrice,
          rating,
          reviewCount,
          discountPercentage,
          quantity: 1
        }
      });
      setIsInCart(true);
      alert('Product added to cart!');
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        setIsInCart(true);
        alert('Product already in cart!');
      } else if (axiosError.response?.status === 401) {
        alert('Please login to add items to cart');
        router.push('/login');
      } else {
        alert('Failed to add product to cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="border rounded-lg bg-white shadow-sm flex flex-col h-auto relative group overflow-hidden transition-transform transition-shadow duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[#F5F5F5] p-4 pb-6 relative">
        {discountPercentage && (
          <div className="bg-[#DB4444] text-white text-xs px-2 py-1 rounded-sm absolute left-3 top-3">
            -{discountPercentage}%
          </div>
        )}
        {isNew && (
          <div className="bg-[#00FF66] text-white text-xs px-2 py-1 rounded-sm absolute left-3 top-3">
            NEW
          </div>
        )}
        {isWishlistItem ? (
          <button
            onClick={handleWishlistToggle}
            className="absolute right-1 top-3 bg-white rounded-full p-1.5 z-20 pointer-events-auto"
          >
            <Image src="/images/bin.png" alt="Remove from wishlist" width={24} height={24} className="hover:opacity-70 cursor-pointer" />
          </button>
        ) : (
          <>
            <button 
              onClick={handleWishlistToggle}
              className="absolute right-1 top-3 bg-white rounded-full p-1.5 z-20 pointer-events-auto"
            >
              <FiHeart 
                className={`h-4 w-4 ${isWishlisted ? 'text-[#DB4444] fill-[#DB4444]' : 'text-black'} hover:cursor-pointer hover:opacity-60`} 
              />
            </button>
            <button className="absolute right-1 top-12 bg-white rounded-full p-1.5 hover:cursor-pointer hover:opacity-60">
              <Image src="/images/filleye.png" alt="Quick view" width={16} height={16} />
            </button>
          </>
        )}
        <div className="relative w-full aspect-square mb-4">
          <Image
            src={image}
            alt={title}
            fill
            className={"object-contain transition-transform duration-1000 ease-in-out"}
            style={{
              transform: isHovered
                ? 'scale(1.18) translateY(-8px) rotate(3deg)'
                : 'scale(1) translateY(0) rotate(0)'
            }}
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-black mb-2">{title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#DB4444] font-medium">${price}</span>
          {originalPrice && (
            <span className="text-gray-500 line-through text-sm">${originalPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <AiFillStar
                key={i}
                className={`h-4 w-4 ${i < rating ? 'text-[#FFAD33]' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
        </div>
        {colorOptions && colorOptions.length > 0 && (
          <div className="flex gap-1 mt-2">
            {colorOptions.map((color, index) => (
              <div 
                key={index}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
        <button 
          onClick={handleAddToCart}
          disabled={isLoading || isInCart}
          className={`w-full bg-black text-white text-sm py-2 rounded hover:opacity-80 transition-all mt-3 cursor-pointer ${
            isWishlistItem ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {isInCart ? 'In Cart' : isLoading ? 'Adding...' : 'Add To Cart'}
        </button>
      </div>
    </div>
  );
};

export default Card;
