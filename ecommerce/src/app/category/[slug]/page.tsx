'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Sidebar from '@/sections/Homepage/Sidebar';
import api from '@/lib/api';

interface Product {
  id: string;
  productId?: string;
  _id?: string;
  name: string;
  title?: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  rating: number;
  reviews: number;
  discountPercentage: number;
  category: string;
  categoryid: string;
}

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categorySlug = params.slug as string;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/products');
        const data = response.data;
        console.log('API data:', data, 'Slug:', categorySlug);
        const productsArray = Array.isArray(data) ? data : data.products;
        const categoryProducts = productsArray.filter((product: Product) =>
          product.categoryid === categorySlug
        );
        console.log('Category products:', categoryProducts);  
        console.log('Products:', productsArray);
        setProducts(categoryProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <Sidebar />
          <div className="flex-1">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full px-4 py-8">
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-8 capitalize text-black">
            {categorySlug.replace(/-/g, ' ')}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => {
              return (
                <div key={idx}>
                  <Card
                    productId={
                      product.productId ||
                      product.id ||
                      product._id ||
                      (product.title || product.name).replace(/\s+/g, '-').toLowerCase()
                    }
                    image={product.image}
                    title={product.name}
                    price={Number(product.discountedPrice.toFixed(2))}
                    originalPrice={product.originalPrice ? Number(product.originalPrice.toFixed(2)) : undefined}
                    rating={Math.round(product.rating)}
                    reviewCount={product.reviews}
                    discountPercentage={product.discountPercentage ? Math.round(product.discountPercentage) : undefined}
                    alt={product.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 