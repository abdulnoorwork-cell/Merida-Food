import React, { useEffect } from 'react'
import hero_image from '../assets/hero_image.webp'
import hero_image_2 from '../assets/slider-image-2.webp'
import hero_bg from '../assets/hero_bg.webp'
import { useInView } from 'react-intersection-observer'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const Hero = () => {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: false })
    return (
        <div className="flex flex-1 h-screen relative" style={{ backgroundImage: `url(${hero_bg})` }}>

            {/* Content */}
            <div ref={ref} className={`box_3 ${inView ? 'show' : ''} z-10 container px-4 text-white flex flex-col absolute left-[43%] top-1/2 -translate-x-[43%] -translate-y-1/2 sm:pl-16 py-10`}>

                <p className="uppercase mb-4 font-medium flex items-center gap-3 sm:text-base text-sm">
                    Welcome to Merida
                    <div className='bg-white h-[1px] sm:w-[140px] w-[100px]'></div>
                </p>

                <h1 className="2xl:text-[68px] xl:text-[55px] sm:text-[53px] text-[43.8px] font-bold tracking-tight mb-9 shadow">
                    Amazing Tasty <br />
                    Food Cooked By <br />
                    Popular Chef
                </h1>

                <button className="bg-orange-500 px-[30px] 2xl:py-3.5 py-3 w-fit font-semibold hover:bg-orange-600 cursor-pointer transition-all duration-300 flex items-center gap-2 2xl:text-base text-sm">
                    VIEW FULL MENU
                </button>
            </div>

            {/* Left Content */}
            <div className='w-1/2'>

            </div>

            {/* Right Image */}
            <div className="w-1/2">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000 }}
                    loop={true}>
                    <SwiperSlide>
                        <img
                            src={hero_image}
                            alt="burger"
                            className="w-full h-screen object-cover"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src={hero_image_2}
                            alt="burger"
                            className="w-full h-screen object-cover"
                        />
                    </SwiperSlide>
                </Swiper>
            </div>

        </div>
    )
}

export default Hero