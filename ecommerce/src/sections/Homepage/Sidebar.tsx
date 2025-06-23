'use client';
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";

const CATEGORY_MAP: { [key: string]: string[] } = {
  "Women's Fashion": [
    'tops',
    'womens-bags',
    'womens-dresses',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches',
  ],
  "Men's Fashion": [
    'mens-shirts',
    'mens-watches',
    'mens-shoes',
  ],
  "Electronics": [
    'laptops',
    'mobile-accessories',
    'smartphones',
    'tablets',
  ],
  "Home & Living": [
    'furniture',
    'home-decoration',
    'kitchen-accessories',
  ],
  "Beauty & Personal Care": [
    'beauty',
    'fragrances',
    'skin-care',
    'sunglasses',
  ],
  "Sports & Outdoors": [
    'motorcycle',
    'sports-accessories',
    'vehicle',
  ],
};

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="hidden md:block w-64 lg:w-72 pr-8 border-r border-gray-300 self-start relative">
      <h2 className="text-xl text-black font-semibold mb-6">Categories</h2>
      <div className="space-y-6">
        {Object.entries(CATEGORY_MAP).map(([mainCategory, subcategories]) => (
          <div key={mainCategory} className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleCategory(mainCategory)}
              className="flex items-center justify-between w-full text-black text-left font-semibold text-lg hover:text-[#DB4444]"
            >
              <span>{mainCategory}</span>
              {expandedCategories.includes(mainCategory) ? (
                <FiChevronUp className="h-5 w-5" />
              ) : (
                <FiChevronDown className="h-5 w-5" />
              )}
            </button>
            {expandedCategories.includes(mainCategory) && (
              <div className="mt-2 pl-4 space-y-2">
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/category/${subcategory}`}
                    className="block text-gray-600 hover:text-[#DB4444] capitalize"
                  >
                    {subcategory.replace(/-/g, ' ')}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
