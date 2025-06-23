'use client';
import Image from "next/image";
import { useState } from "react";

interface NewArrivalCardProps {
  title: string;
  description: string;
  imageSrc: string;
  height?: string;
  width?: string;
}

const NewArrivalCard = ({ title, description, imageSrc, height = "full", width = "full" }: NewArrivalCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if this is the woman image to apply mirroring
  const isWomanImage = imageSrc.includes('woman.jpg');
  // Determine if this is the PS5 image to apply better quality settings
  const isPS5Image = imageSrc.includes('ps5.png');
  // Determine if this is the speakers image to center it
  const isSpeakerImage = imageSrc.includes('speakers.png');
  
  return (
    <div 
      className={`relative bg-black text-white overflow-hidden rounded-md h-${height} w-${width}`} 
      style={{ minHeight: '320px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >      <Image 
        src={imageSrc}
        alt={title}
        fill
        quality={isPS5Image ? 100 : 85}
        className={`
          ${isSpeakerImage ? 'object-contain' : 'object-cover'}
          transition-transform duration-1000 ease-in-out
        `}
        style={
          isWomanImage
            ? {
                transform: `scaleX(-1) scale(${isHovered ? 1.18 : 1}) translateY(${isHovered ? '-8px' : '0'}) rotate(${isHovered ? '3deg' : '0deg'})`,
              }
            : {
                transform: `${isHovered ? 'scale(1.18) translateY(-8px) rotate(3deg)' : 'scale(1) translateY(0) rotate(0)'}`,
              }
        }
        priority={true}
      />
      <div className="absolute bottom-6 left-6 z-10">
        <h3 className="font-bold text-xl mb-1">{title}</h3>
        <p className="text-sm text-gray-200 mb-4">{description}</p>
        <button className="text-sm font-medium bg-transparent border border-white px-4 py-2 hover:bg-white hover:text-black cursor-pointer transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
};

const NewArrivalSection = () => {  return (
    <div className="w-full my-16 bg-white">
      <div className="container mx-auto px-4">
        
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-5 h-10 bg-[#DB4444] rounded"></div>
            <span className="text-[#DB4444] font-medium">Featured</span>
          </div>
          <h2 className="text-4xl font-semibold text-black">New Arrival</h2>
        </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div className="flex flex-col h-auto">
            <div className="flex-1" style={{ height: "665px" }}>
              <NewArrivalCard
                title="PlayStation 5"
                description="Black and White version of the PS5 coming out on sale."
                imageSrc="/images/newarrivals/ps5.png"
                height="full"
              />
            </div>
          </div>

          {/* Right Column - 3 Cards */}
          <div className="grid grid-rows-2 gap-6">
            
            <div style={{ height: "320px" }}>
              <NewArrivalCard
                title="Women's Collections"
                description="Featured woman collections that give you another vibe."
                imageSrc="/images/newarrivals/woman.jpg"
              />
            </div>

            
            <div className="grid grid-cols-2 gap-6">
              
              <div style={{ height: "320px" }}>
                <NewArrivalCard
                  title="Speakers"
                  description="Amazon wireless speakers"
                  imageSrc="/images/newarrivals/speakers.png"
                />
              </div>
              
             
              <div style={{ height: "320px" }}>
                <NewArrivalCard
                  title="Perfume"
                  description="GUCCI INTENSE OUD EDP"
                  imageSrc="/images/newarrivals/perfumes.png"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 mb-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-200 rounded-full p-3 mb-5">
                <div className="bg-black rounded-full p-2">
                  <Image 
                    src="/images/newarrivals/deliveryicon.png" 
                    alt="Delivery" 
                    width={24} 
                    height={24}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-black">FREE AND FAST DELIVERY</h3>
              <p className="text-black">Free delivery for all orders over $140</p>
            </div>

            
            <div className="flex flex-col items-center text-center text-black">
              <div className="bg-gray-200 rounded-full p-3 mb-5">
                <div className="bg-black rounded-full p-2">
                  <Image 
                    src="/images/newarrivals/customericon.png" 
                    alt="Customer Service" 
                    width={24} 
                    height={24}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">24/7 CUSTOMER SERVICE</h3>
              <p className="text-black">Friendly 24/7 customer support</p>
            </div>

            
            <div className="flex flex-col items-center text-center text-black">
              <div className="bg-gray-200 rounded-full p-3 mb-5">
                <div className="bg-black rounded-full p-2">
                  <Image 
                    src="/images/newarrivals/moneyback.png" 
                    alt="Guarantee" 
                    width={24} 
                    height={24}
                  />
                </div>
              </div>
              <h3 className="font-semibold text-xl mb-2">MONEY BACK GUARANTEE</h3>
              <p className="text-black">We return money within 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalSection;