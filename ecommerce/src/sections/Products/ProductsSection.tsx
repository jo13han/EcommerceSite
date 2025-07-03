'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, getProductsByCategory, getCategories } from '@/lib/api';
import Card from '@/components/Card';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  originalPrice?: number;
  discountedPrice?: number;
  rating?: number;
  reviews?: number;
  discountPercentage?: number;
}

interface Category {
  _id: string;
  name: string;
}

const ProductsSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch categories (can also be migrated to useQuery if desired)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        toast.error('Could not load categories. Please refresh.');
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with useQuery
  const {
    data: products = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['products', searchParams.get('category'), searchParams.get('search')],
    queryFn: async () => {
      const category = searchParams.get('category');
      const searchTerm = searchParams.get('search') || '';
      let data = category ? await getProductsByCategory(category) : await getProducts();
      if (searchTerm) {
        data = data.filter((product: Product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return data;
    },
  });

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label htmlFor="category" className="text-black font-medium">
            Filter by Category:
          </label>
          <select
            id="category"
            value={searchParams.get('category') || ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:border-transparent"
          >
            <option value="">All Products</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">Could not load products.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <Card
              key={product._id}
              productId={product._id}
              image={product.image}
              title={product.name}
              price={product.discountedPrice || product.price || 0}
              originalPrice={product.originalPrice}
              rating={product.rating || 0}
              reviewCount={product.reviews || 0}
              discountPercentage={product.discountPercentage}
            />
          ))}
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ProductsSection; 