'use client';
import SectionHeader from '../../components/SectionHeader';
import FlashSalesTimer from '../../components/FlashSalesTimer';
import NavigationArrows from '../../components/NavigationArrows';
import Card from '../../components/Card';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const flashSalesProducts = [
	{
		id: 1,
		productId: '1',
		image: '/images/flashsales/flashgamepad.png',
		title: 'HAVIT HV-G92 Gamepad',
		price: 120,
		originalPrice: 160,
		rating: 5,
		reviewCount: 88,
		discountPercentage: 40,
	},
	{
		id: 2,
		productId: '2',
		image: '/images/flashsales/flashkeyboard.png',
		title: 'AK-900 Wired Keyboard',
		price: 960,
		originalPrice: 1160,
		rating: 5,
		reviewCount: 75,
		discountPercentage: 35,
	},
	{
		id: 3,
		productId: '3',
		image: '/images/flashsales/flashmonitor.png',
		title: 'IPS LCD Gaming Monitor',
		price: 370,
		originalPrice: 400,
		rating: 5,
		reviewCount: 99,
		discountPercentage: 30,
	},
	{
		id: 4,
		productId: '4',
		image: '/images/flashsales/flashchair.png',
		title: 'S-Series Comfort Chair',
		price: 375,
		originalPrice: 400,
		rating: 5,
		reviewCount: 99,
		discountPercentage: 25,
	},
];

const FlashSalesSection = () => {	// Repeat products for carousel effect
	const repeatedProducts = [...flashSalesProducts, ...flashSalesProducts];
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
		<div className="w-full mt-12 border-t border-gray-200 pt-10">
			<div className="container mx-auto px-2 sm:px-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
					<div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-12">
						<SectionHeader indicator="Today's" title="Flash Sales" />
						<FlashSalesTimer />
					</div>
					<NavigationArrows
						onPrevious={handlePrevious}
						onNext={handleNext}
						variant="circular"
					/>
				</div>
				<div ref={sliderRef} className="keen-slider">
					{repeatedProducts.map((product, idx) => (
						<div className="keen-slider__slide min-w-0" key={idx}>
							<Card
								productId={product.productId || String(product.id)}
								image={product.image}
								title={product.title}
								price={product.price}
								originalPrice={product.originalPrice}
								rating={product.rating}
								reviewCount={product.reviewCount}
								discountPercentage={product.discountPercentage}
								alt={product.title}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FlashSalesSection;
