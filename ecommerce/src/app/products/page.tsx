import ProductsSection from '@/sections/Products/ProductsSection';
import { Suspense } from 'react';

function ProductsSkeleton() {
  return <div>Loading...</div>;
}

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      <main className="flex-1">
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsSection />
        </Suspense>
      </main>
    </div>
  );
} 