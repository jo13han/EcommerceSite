'use client';
import Image from 'next/image';
import { FiStar } from 'react-icons/fi';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  reviews: number;
  discountPercentage: number;
}

const ProductCard = ({
  name,
  image,
  originalPrice,
  discountedPrice,
  rating,
  reviews,
  discountPercentage,
}: ProductCardProps) => {
  return (
    <div className="group relative">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{name}</h3>
          <div className="mt-1 flex items-center">
            <FiStar className="h-4 w-4 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-500">{rating}</span>
            <span className="ml-1 text-sm text-gray-500">({reviews})</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">${discountedPrice}</p>
          <p className="text-sm text-gray-500 line-through">${originalPrice}</p>
        </div>
      </div>
      {discountPercentage > 0 && (
        <div className="absolute top-2 left-2 bg-[#DB4444] text-white px-2 py-1 rounded text-sm">
          -{discountPercentage}%
        </div>
      )}
    </div>
  );
};

export default ProductCard; 