'use client';
import Link from "next/link";
import { FiSearch, FiHeart, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiUser, FiBox, FiStar, FiLogOut, FiMenu, FiX, FiChevronDown, FiChevronUp, FiClock } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

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
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Search history states
  const [showDesktopHistory, setShowDesktopHistory] = useState(false);
  const [showMobileHistory, setShowMobileHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Handle clicks outside search dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(event.target as Node)) {
        setShowDesktopHistory(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileHistory(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Add search term to history
  const addToHistory = (searchTerm: string) => {
    if (searchTerm.trim()) {
      const newHistory = [
        searchTerm.trim(),
        ...searchHistory.filter(item => item !== searchTerm.trim())
      ].slice(0, 5); // Keep only last 5 items
      setSearchHistory(newHistory);
    }
  };

  // Handle search from history
  const handleHistorySearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    setShowDesktopHistory(false);
    setShowMobileHistory(false);
    setShowMobileSearch(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
    setShowDesktopHistory(false);
    setShowMobileHistory(false);
    setShowMobileSearch(false);
  };

  // Handle desktop search focus
  const handleDesktopSearchFocus = () => {
    if (searchQuery === '' && searchHistory.length > 0) {
      setShowDesktopHistory(true);
    }
  };

  // Handle mobile search focus
  const handleMobileSearchFocus = () => {
    if (searchQuery === '' && searchHistory.length > 0) {
      setShowMobileHistory(true);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Hide history dropdowns when user starts typing
    if (value !== '') {
      setShowDesktopHistory(false);
      setShowMobileHistory(false);
    } else if (searchHistory.length > 0) {
      // Show history when input is cleared and there's history
      setShowDesktopHistory(true);
      setShowMobileHistory(true);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  const { token } = useAuth();

  // Cart and Wishlist counts with queryFn
  const { data: cartItems = [] } = useQuery<any[]>({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!token) return [];
      const response = await api.get('/api/cart');
      return response.data;
    },
    enabled: !!token,
  });
  const { data: wishlistProducts = [] } = useQuery<any[]>({
    queryKey: ['wishlist'],
    queryFn: async () => {
      if (!token) return [];
      const response = await api.get('/api/wishlist');
      return Array.isArray(response.data)
        ? response.data.map(item => item.product || item)
        : [];
    },
    enabled: !!token,
  });

  return (
    <div className="w-full border-b bg-white border-gray-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/images/favicon_io/favicon-32x32.png" 
            alt="Logo" 
            width={32} 
            height={32} 
          />
          <span className="text-xl font-bold text-black">ExclusiveIO</span>
        </Link>
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
        {/* Mobile: Hamburger + Search (right aligned) */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          <button
            className="p-2"
            onClick={() => setShowMobileSearch(true)}
            aria-label="Search"
          >
            <FiSearch className="h-5 w-5 text-black" />
          </button>
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu className="h-6 w-6 text-black" />
          </button>
        </div>
        {/* Desktop Search and Icons */}
        <div ref={desktopSearchRef} className="relative hidden md:block">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input 
              type="text" 
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleDesktopSearchFocus}
              className="bg-gray-100 rounded-md px-4 py-2 w-64 text-sm text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:bg-white"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-black">
              <FiSearch />
            </button>
          </form>
          {/* Desktop Search History Dropdown */}
          {showDesktopHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2 px-2">Recent searches</div>
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistorySearch(item)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-black hover:bg-gray-100 rounded transition-colors"
                  >
                    <FiClock className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 transition-transform hover:scale-110 cursor-pointer relative" aria-label="Wishlist">
            <Link href="/wishlist">
              <FiHeart className="h-5 w-5 text-black" />
              {wishlistProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                  {wishlistProducts.length}
                </span>
              )}
            </Link>
          </button>
          <button className="p-2 transition-transform hover:scale-110 cursor-pointer relative" aria-label="Cart">
            <Link href="/cart">
              <FiShoppingCart className="h-5 w-5 text-black" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                  {cartItems.length}
                </span>
              )}
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
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-50 md:hidden p-4">
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowMobileSearch(false)} aria-label="Close search">
              <FiX className="h-6 w-6 text-black" />
            </button>
          </div>
          <div ref={mobileSearchRef} className="relative">
            <form onSubmit={handleSearch} className="flex items-center border-b border-gray-300">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleMobileSearchFocus}
                className="w-full py-2 text-black text-lg focus:outline-none"
                autoFocus
              />
              <button type="submit" className="p-2">
                <FiSearch className="h-6 w-6 text-black" />
              </button>
            </form>
            {/* Mobile Search History Dropdown */}
            {showMobileHistory && searchHistory.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2 px-2">Recent searches</div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistorySearch(item)}
                      className="w-full flex items-center gap-2 px-2 py-3 text-sm text-black hover:bg-gray-100 rounded transition-colors"
                    >
                      <FiClock className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-4 overflow-y-auto">
            {/* User Info and Actions (Mobile) */}
            {user && (
              <div className="flex flex-col items-center mb-6">
                <Image
                  src={user.photoURL || "/images/user.png"}
                  alt="User"
                  width={56}
                  height={56}
                  className="rounded-full bg-[#DB4444] p-2 mb-2"
                />
                <span className="font-semibold text-black text-base mb-1">
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-black hover:bg-gray-100 rounded w-full justify-center"
                >
                  <FiLogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
            {/* Cart and Wishlist Icons (Mobile) */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="relative">
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} aria-label="Wishlist">
                  <FiHeart className="h-6 w-6 text-black" />
                  {wishlistProducts.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                      {wishlistProducts.length}
                    </span>
                  )}
                </Link>
              </div>
              <div className="relative">
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} aria-label="Cart">
                  <FiShoppingCart className="h-6 w-6 text-black" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white z-10">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>
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
