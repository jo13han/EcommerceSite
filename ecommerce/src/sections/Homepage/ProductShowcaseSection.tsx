'use client';
import SectionHeader from "../../components/SectionHeader";
import NavigationArrows from "../../components/NavigationArrows";
import Card from "../../components/Card";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const ProductShowcaseSection = () => {  const [sliderRef, instanceRef] = useKeenSlider({
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

  const handlePrevious = () => {
    instanceRef.current?.prev();
  };

  const handleNext = () => {
    instanceRef.current?.next();
  };const products = [
    {
      id: 1,
      image: "/images/products/dogfood.png",
      title: "Breed Dry Dog Food",
      price: 100,
      ratings: 4,
      reviewCount: 35,
      isNew: false,
      colorOptions: []
    },
    {
      id: 2,
      image: "/images/products/dslr.png",
      title: "CANON EOS DSLR Camera",
      price: 360,
      ratings: 4.5,
      reviewCount: 95,
      isNew: false,
      colorOptions: []
    },
    {
      id: 3,
      image: "/images/products/laptop.png",
      title: "ASUS FHD Gaming Laptop",
      price: 700,
      ratings: 5,
      reviewCount: 325,
      isNew: false,
      colorOptions: []
    },
    {
      id: 4,
      image: "/images/products/curology.png",
      title: "Curology Product Set",
      price: 500,
      ratings: 4,
      reviewCount: 145,
      isNew: false,
      colorOptions: []
    },
    {
      id: 5,
      image: "/images/products/electriccar.png",
      title: "Kids Electric Car",
      price: 960,
      ratings: 5,
      reviewCount: 65,
      isNew: true,
      colorOptions: ["#FB1314", "#DB4444"]
    },
    {
      id: 6,
      image: "/images/products/zoomcleats.png",
      title: "Jr. Zoom Soccer Cleats",
      price: 1160,
      ratings: 5,
      reviewCount: 35,
      isNew: false,
      colorOptions: ["#EEFF61", "#DB4444"]
    },
    {
      id: 7,
      image: "/images/products/shooterpad.png",
      title: "GP11 Shooter USB Gamepad",
      price: 550,
      ratings: 4.5,
      reviewCount: 55,
      isNew: true,
      colorOptions: ["#000000", "#DB44440"]
    },
    {
      id: 8,
      image: "/images/products/satinjacket.png",
      title: "Quilted Satin Jacket",
      price: 660,
      ratings: 4.8,
      reviewCount: 55,
      isNew: false,
      colorOptions: ["#184A48", "#DB44440"]
    }
  ];

  return (
    <div className="w-full mt-16 border-t border-gray-200 pt-10">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between mb-6">
          <SectionHeader indicator="" title="Explore Our Products" />
          <NavigationArrows onPrevious={handlePrevious} onNext={handleNext} />
        </div>
        <div ref={sliderRef} className="keen-slider">
          {products.map((product) => (
            <div className="keen-slider__slide min-w-0" key={product.id}>
              <Card
                productId={String(product.id)}
                image={product.image}
                title={product.title}
                price={product.price}
                rating={product.ratings}
                reviewCount={product.reviewCount}
                isNew={product.isNew}
                colorOptions={product.colorOptions}
                alt={product.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShowcaseSection;
