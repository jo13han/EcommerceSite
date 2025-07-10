'use client';
import SectionHeader from '../../components/SectionHeader';
import Card from '../../components/Card';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const bestSellingProducts = [
	{
		id: 1,
		productId: 'b1',
		image: '/images/bestsellers/bestsellercoat.png',
		title: 'The north coat',
		price: 260,
		originalPrice: 350,
		rating: 5,
		reviewCount: 65,
	},
	{
		id: 2,
		productId: 'b2',
		image: '/images/bestsellers/bestsellerbag.png',
		title: 'Gucci duffle bag',
		price: 960,
		originalPrice: 1160,
		rating: 5,
		reviewCount: 65,
	},
	{
		id: 3,
		productId: 'b3',
		image: '/images/bestsellers/bestsellercpu.png',
		title: 'RGB liquid CPU Cooler',
		price: 160,
		originalPrice: 170,
		rating: 5,
		reviewCount: 65,
	},
	{
		id: 4,
		productId: 'b4',
		image: '/images/bestsellers/bestsellerbookshelf.png',
		title: 'Small BookSelf',
		price: 360,
		originalPrice: undefined,
		rating: 5,
		reviewCount: 65,
	},
];

const BestSellingSection = () => {
	// Repeat products for carousel effect
	const repeatedProducts = [...bestSellingProducts, ...bestSellingProducts];	const [sliderRef] = useKeenSlider({
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
	return (
		<div className="w-full mt-16 border-t border-gray-200 pt-10">
			<div className="container mx-auto px-2 sm:px-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
					<SectionHeader indicator="This Month" title="Best Selling Products" />

					<div>
						<button className="px-6 py-2 bg-[#DB4444] text-white rounded cursor-pointer w-full sm:w-auto">
							View All
						</button>
					</div>
				</div>
				<div ref={sliderRef} className="keen-slider">
					{repeatedProducts.map((product, idx) => (
						<div className="keen-slider__slide min-w-0" key={idx}>
							<Card
								productId={product.productId}
								image={product.image}
								title={product.title}
								price={product.price}
								originalPrice={product.originalPrice}
								rating={product.rating}
								reviewCount={product.reviewCount}
								alt={product.title}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BestSellingSection;
