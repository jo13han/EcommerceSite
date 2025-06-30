'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts, getProductsByCategory, getCategories } from '@/lib/api';
import Card from '@/components/Card';
import toast from 'react-hot-toast';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch categories
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

  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      setIsLoading(true);
      try {
        const category = searchParams.get('category');
        const searchTerm = searchParams.get('search') || '';
        setSelectedCategory(category || '');
        
        const data = category 
          ? await getProductsByCategory(category)
          : await getProducts();
        
        setProducts(data);

        if (searchTerm) {
          const filtered = data.filter((product: Product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(data);
        }

      } catch (err) {
        toast.error('Could not load products. Please refresh.');
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilterProducts();
  }, [searchParams]);

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
            value={selectedCategory}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ProductsSection; 