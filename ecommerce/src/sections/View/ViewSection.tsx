"use client";
import Image from "next/image";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import NavigationArrows from '@/components/NavigationArrows';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const product = {
    name: "PS5 Controller",
    price: 192.0,
    inStock: true,
    rating: 4.5,
    reviews: 100,
    description:
        "PlayStation 5 Controller Skin.High quality vinyl with air channel adhesive for easy bubble-free install & mess free removal! Pressure sensitive.",
    colours: ["#A0BCE0","#DB4444"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
        "/images/view/controller1.png",
        "/images/view/controller2.png",
        "/images/view/controller3.png",
        "/images/view/controller4.png",
        "/images/view/controller.png",
    ],
    mainImage: "/images/view/controller.png",
};

const relatedItems = [
  {
    name: "HAVIT HV-G92 Gamepad",
    price: 120,
    oldPrice: 180,
    discount: "-40%",
    image: "/images/view/flashgamepad.png",
    rating: 88,
  },
  {
    name: "AK-900 Wired Keyboard",
    price: 960,
    oldPrice: 1160,
    discount: "-35%",
    image: "/images/view/flashkeyboard.png",
    rating: 75,
  },
  {
    name: "IPS LCD Gaming Monitor",
    price: 370,
    oldPrice: 400,
    discount: "-30%",
    image: "/images/view/flashmonitor.png",
    rating: 99,
  },
  {
    name: "RGB Liquid CPU Cooler",
    price: 160,
    oldPrice: 170,
    discount: "-20%",
    image: "/images/view/bestsellercpu.png",
    rating: 65,
  },
];

export default function ViewSection() {
  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const [selectedColour, setSelectedColour] = useState(product.colours[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]);
  const [quantity, setQuantity] = useState(2);

  // Repeat items for carousel effect
  const repeatedItems = [...relatedItems, ...relatedItems];
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: { perView: 2, spacing: 16 },
      },
      '(min-width: 1024px)': {
        slides: { perView: 4, spacing: 24 },
      },
    },
    loop: true,
  });

  const handlePrevious = () => instanceRef.current?.prev();
  const handleNext = () => instanceRef.current?.next();

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm text-gray-500 mb-8 flex gap-2">
          <span>Account</span>
          <span>/</span>
          <span>Gaming</span>
          <span>/</span>
          <span className="text-black">PS5 Controller</span>
        </div>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex gap-8">
            <div className="flex flex-col gap-6">
              {product.images.map((img) => (
                <button
                  key={img}
                  className={`border rounded-lg p-1 ${selectedImage === img ? "border-[#DB4444] bg-gray-100" : "border-gray-200 bg-gray-50"}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image src={img} alt="thumb" width={80} height={80} className="object-contain rounded" />
                </button>
              ))}
            </div>
            <div className="bg-gray-100 rounded-lg flex items-center justify-center w-[500px] h-[500px]">
              <Image src={selectedImage} alt="main" width={440} height={440} className="object-contain" />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 max-w-lg md:ml-32">
            <div className="text-2xl font-semibold mb-2 text-black">{product.name}</div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <span className="text-yellow-400">★</span>
              <span className="font-medium text-black">{product.rating}</span>
              <span className="text-gray-400">({product.reviews} Reviews)</span>
              <span className="ml-2 text-green-600 font-medium">{product.inStock ? "In Stock" : "Out of Stock"}</span>
            </div>
            <div className="text-2xl font-bold text-black mb-2">${product.price.toFixed(2)}</div>
            <div className="text-gray-600 mb-4">{product.description}</div>
            <div className="flex items-center gap-4 mb-2">
              <span className="font-medium text-black">Colours:</span>
              {product.colours.map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full border-2 border-black cursor-pointer ${selectedColour === c ? "border-[#DB4444]" : "border-gray-200"}`}
                  style={{ background: c }}
                  onClick={() => setSelectedColour(c)}
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mb-2">
              <span className="font-medium text-black">Size:</span>
              {product.sizes.map((s) => (
                <button
                  key={s}
                  className={`px-3 py-1 rounded border text-sm font-medium ${selectedSize === s ? "bg-[#DB4444] text-white border-[#DB4444]" : "bg-white border-gray-200 text-black"}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-2 text-lg text-gray-500 hover:text-black"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  type="button"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  className="w-12 text-center outline-none border-0 text-black"
                  readOnly
                />
                <button
                  className="px-3 py-2 text-lg text-gray-500 hover:text-black"
                  onClick={() => setQuantity((q) => q + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
              <button className="bg-[#DB4444] text-white px-8 py-3 rounded font-medium hover:opacity-90 transition-opacity">Buy Now</button>
              <button className="border rounded p-3 hover:bg-gray-50">
                <FiHeart className="text-xl text-black" />
              </button>
            </div>
            <div className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <Image src="/images/view/freedelivery.png" alt="Free Delivery" width={32} height={32} />
                <div>
                  <div className="font-medium text-black">Free Delivery</div>
                  <div className="text-xs text-black">Enter your postal code for Delivery Availability</div>
                </div>
              </div>
              <hr className="my-1 border-gray-200" />
              <div className="flex items-center gap-2">
                <Image src="/images/view/return.png" alt="Return Delivery" width={32} height={32} />
                <div>
                  <div className="font-medium text-black">Return Delivery</div>
                  <div className="text-xs text-black">Free 30 Days Delivery Returns. Details</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-[#DB4444] rounded mr-2" />
              <span className="text-lg font-semibold text-[#DB4444]">Related Item</span>
            </div>
            <NavigationArrows
              onPrevious={handlePrevious}
              onNext={handleNext}
              variant="circular"
            />
          </div>
          <div ref={sliderRef} className="keen-slider">
            {repeatedItems.map((item, idx) => (
              <div className="keen-slider__slide min-w-0" key={idx}>
                <div className="border rounded-lg relative group overflow-hidden">
                  <div className="bg-[#F5F5F5] p-4 pb-6 relative">
                    <div className="bg-[#DB4444] text-white text-xs px-2 py-1 rounded-sm absolute left-3 top-3">
                      {item.discount}
                    </div>
                    <button className="absolute right-1 top-3 bg-white rounded-full p-1.5">
                      <FiHeart className="h-4 w-4 text-black hover:cursor-pointer hover:opacity-60" />
                    </button>
                    <div className="flex justify-center">
                      <div className="h-[140px] sm:h-[180px] w-[140px] sm:w-[180px] relative transition-transform duration-500 ease-in-out group-hover:scale-125 group-hover:rotate-6">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-black line-clamp-2">{item.name}</h3>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-sm font-medium text-[#DB4444]">${item.price}</span>
                      <span className="text-sm text-gray-400 line-through">${item.oldPrice}</span>
                    </div>
                    <div className="flex items-center mt-1.5">
                      <div className="flex text-[#FFAD33]">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`${i < Math.floor(item.rating / 20) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 ml-2">({item.rating})</span>
                    </div>
                    <button 
                      className="w-full bg-black text-white text-sm py-2 rounded hover:opacity-80 transition-all mt-3 cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
