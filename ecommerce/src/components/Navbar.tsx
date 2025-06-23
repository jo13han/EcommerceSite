'use client';
import Link from "next/link";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiUser, FiBox, FiXCircle, FiStar, FiLogOut, FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

// Category map (reuse from Sidebar)
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

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!showUserMenu) return;
    
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="w-full border-b bg-white border-gray-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">Exclusive</h1>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 ml-8 flex-1">
          <Link 
            href="/" 
            className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
              pathname === '/' 
                ? 'after:w-full' 
                : 'after:w-0 hover:after:w-full'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/contact" 
            className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
              pathname === '/contact' 
                ? 'after:w-full' 
                : 'after:w-0 hover:after:w-full'
            }`}
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
              pathname === '/about' 
                ? 'after:w-full' 
                : 'after:w-0 hover:after:w-full'
            }`}
          >
            About
          </Link>
          {!user ? (
            <>
              <Link 
                href="/signup" 
                className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                  pathname === '/signup' 
                    ? 'after:w-full' 
                    : 'after:w-0 hover:after:w-full'
                }`}
              >
                Sign Up
              </Link>
              <Link 
                href="/login" 
                className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                  pathname === '/login' 
                    ? 'after:w-full' 
                    : 'after:w-0 hover:after:w-full'
                }`}
              >
                Login
              </Link>
            </>
          ) : null}
        </nav>
        
        {/* Mobile Search Button */}
        <button className="md:hidden p-2 transition-transform hover:scale-110" aria-label="Search">
          <FiSearch className="h-5 w-5 text-black" />
        </button>
        <div className="relative hidden md:flex items-center">
          <input 
            type="text" 
            placeholder="What are you looking for?" 
            className="bg-gray-100 rounded-md px-4 py-2 w-64 text-sm text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:bg-white"
          />
          <FiSearch className="absolute right-3 top-2.5 text-black" />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 transition-transform hover:scale-110 cursor-pointer" aria-label="Wishlist">
            <Link href="/wishlist">
              <FiHeart className="h-5 w-5 text-black" />
            </Link>
          </button>
          <button className="p-2 transition-transform hover:scale-110 cursor-pointer" aria-label="Cart">
            <Link href="/cart">
              <FiShoppingCart className="h-5 w-5 text-black" />
            </Link>
          </button>
          {user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-0 focus:outline-none transition-transform hover:scale-110"
                aria-label="Account"
                type="button"
              >
                <Image src="/images/user.png" alt="User" width={40} height={40} className="rounded-full bg-[#DB4444] p-2 hover:cursor-pointer" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiUser className="h-5 w-5" />
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiBox className="h-5 w-5" />
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiStar className="h-5 w-5" />
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  >
                    <FiLogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu className="h-6 w-6 text-black" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <FiX className="h-6 w-6 text-black" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 mb-8">
              <Link 
                href="/" 
                className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                  pathname === '/' 
                    ? 'after:w-full' 
                    : 'after:w-0 hover:after:w-full'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/contact" 
                className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                  pathname === '/contact' 
                    ? 'after:w-full' 
                    : 'after:w-0 hover:after:w-full'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/about" 
                className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                  pathname === '/about' 
                    ? 'after:w-full' 
                    : 'after:w-0 hover:after:w-full'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              {!user && (
                <>
                  <Link 
                    href="/signup" 
                    className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                      pathname === '/signup' 
                        ? 'after:w-full' 
                        : 'after:w-0 hover:after:w-full'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link 
                    href="/login" 
                    className={`font-medium text-black relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#DB4444] after:transition-all after:duration-300 ${
                      pathname === '/login' 
                        ? 'after:w-full' 
                        : 'after:w-0 hover:after:w-full'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
            {/* Mobile Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-black mb-2">Categories</h3>
              <div className="space-y-4">
                {Object.entries(CATEGORY_MAP).map(([mainCategory, subcategories]) => (
                  <div key={mainCategory} className="border-b border-gray-200 pb-2">
                    <button
                      onClick={() => toggleCategory(mainCategory)}
                      className="flex items-center justify-between w-full text-black text-left font-medium text-base hover:text-[#DB4444]"
                    >
                      <span>{mainCategory}</span>
                      {expandedCategories.includes(mainCategory) ? (
                        <FiChevronUp className="h-4 w-4" />
                      ) : (
                        <FiChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {expandedCategories.includes(mainCategory) && (
                      <div className="mt-2 pl-3 space-y-1">
                        {subcategories.map((subcategory) => (
                          <Link
                            key={subcategory}
                            href={`/category/${subcategory}`}
                            className="block text-gray-600 hover:text-[#DB4444] capitalize text-sm"
                            onClick={() => setMobileMenuOpen(false)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
