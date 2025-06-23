"use client";

import Image from "next/image";
import StatsSection from "@/components/StatsSection";

const stats = [
	{
		icon: "/images/about/shopicon.png",
		value: "10.5k",
		label: "Sallers active our site",
	},
	{
		icon: "/images/about/saleicon.png",
		value: "33k",
		label: "Monthly Product Sale",
		highlight: true,
	},
	{
		icon: "/images/about/customericon.png",
		value: "45.5k",
		label: "Customer active in our site",
	},
	{
		icon: "/images/about/moneybagicon.png",
		value: "25k",
		label: "Annual gross sale in our site",
	},
];

const team = [
	{
		name: "Tom Cruise",
		title: "Founder & Chairman",
		image: "/images/about/founder.png",
		socials: [
			"/images/footer/twittericon.png",
			"/images/footer/instagramicon.png",
			"/images/footer/linkedinicon.png",
		],
	},
	{
		name: "Emma Watson",
		title: "Managing Director",
		image: "/images/about/director.png",
		socials: [
			"/images/footer/twittericon.png",
			"/images/footer/instagramicon.png",
			"/images/footer/linkedinicon.png",
		],
	},
	{
		name: "Will Smith",
		title: "Product Designer",
		image: "/images/about/designer.png",
		socials: [
			"/images/footer/twittericon.png",
			"/images/footer/instagramicon.png",
			"/images/footer/linkedinicon.png",
		],
	},
];

const features = [
	{
		icon: "/images/about/deliveryicon.png",
		title: "FREE AND FAST DELIVERY",
		desc: "Free delivery for all orders over $140",
	},
	{
		icon: "/images/about/customericon.png",
		title: "24/7 CUSTOMER SERVICE",
		desc: "Friendly 24/7 customer support",
	},
	{
		icon: "/images/about/moneyback.png",
		title: "MONEY BACK GUARANTEE",
		desc: "We return money within 30 days",
	},
];


export default function AboutSection() {
	return (
		<div className="w-full min-h-screen bg-white">
			<div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
				{/* Hero Section */}
				<div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-16">
					<div className="flex-1">
						<div className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-black">
							Our Story
						</div>
						<div className="text-gray-700 text-base md:text-lg mb-6 max-w-xl">
							Launched in 2015, Exclusive is South Asia&apos;s premier online
							shopping marketplace with an active presence in Bangladesh. Supported
							by wide range of tailored marketing, data and service solutions,
							Exclusive has 10,500 sellers and 300 brands and serves 3 million
							customers across the region.
							<br />
							<br />
							Exclusive has more than 1 Million products to offer, growing at a
							very fast rate. Exclusive offers a diverse assortment in categories
							ranging from consumer.
						</div>
					</div>
					<div className="flex-1 flex justify-center w-full max-w-xs md:max-w-md lg:max-w-lg">
						<Image
							src="/images/about/abouthero.png"
							alt="Our Story"
							width={320}
							height={260}
							className="rounded-xl object-cover w-full"
						/>
					</div>
				</div>
				
				<StatsSection stats={stats} className="mb-12 md:mb-20" />

				<div className="flex flex-col items-center mb-12 md:mb-20">
					<div className="text-2xl md:text-3xl font-bold mb-6 md:mb-10 text-black">
						Meet Our Team
					</div>
					<div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center items-center md:items-stretch">
						{team.map((member, i) => (
							<div
								key={i}
								className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md w-full max-w-xs group"
							>
								<div className="w-full h-[320px] flex items-center justify-center mb-4 overflow-hidden">
									<Image
										src={member.image}
										alt={member.name}
										width={180}
										height={220}
										className="object-contain rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-125"
									/>
								</div>
								<div className="text-xl font-semibold text-black mb-1">
									{member.name}
								</div>
								<div className="text-gray-500 mb-3">{member.title}</div>
								<div className="flex gap-3">
									{member.socials.map((icon, j) => (
										<Image
											src={icon}
											alt="social"
											width={22}
											height={22}
											key={j}
											className="filter invert"
										/>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="flex gap-2 mt-6 md:mt-8">
						<span className="w-3 h-3 bg-[#DB4444] rounded-full inline-block" />
						<span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />
						<span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />
						<span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />
						<span className="w-3 h-3 bg-gray-300 rounded-full inline-block" />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
					{features.map((feature, i) => (
						<div key={i} className="flex flex-col items-center text-center gap-4">
							<span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black">
								<Image src={feature.icon} alt={feature.title} width={36} height={36} />
							</span>
							<div className="text-lg font-bold text-black">{feature.title}</div>
							<div className="text-gray-500 text-base">{feature.desc}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
