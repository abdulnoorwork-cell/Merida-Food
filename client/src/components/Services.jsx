import React, { useContext } from 'react'
import service_image from '../assets/service_image.webp'
import service_image2 from '../assets/service_image2.webp'
import service_image3 from '../assets/service_image3.webp'
import about_image from '../assets/about.webp'
import { AppContext } from '../context/AppContext'
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const services = [
    {
        _id: 1,
        title: "Fine Dining",
        img: service_image,
        link: '/shop/category/lunch'
    },
    {
        _id: 2,
        title: "Bar Testing",
        img: service_image2,
        link: '/shop/category/light&digestive'
    },
    {
        _id: 3,
        title: "Fast Food",
        img: service_image3,
        link: '/shop/category/fastfood'

    }
];

const Service = () => {
    const { navigate } = useContext(AppContext);
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });
    return (
        <div className="container mx-auto px-4 2xl:py-24 py-20">

            <div className=''>
                {/* Heading */}
                <div className="text-center 2xl:mb-10 sm:mb-9 mb-6.5">
                    <p className="text-orange-500 uppercase tracking-widest 2xl:text-base text-sm font-semibold mb-2">
                        Why Choose Us?
                    </p>
                    <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A]">
                        Service We Can Provide
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-3 sm:gap-6 gap-5">
                    {services.map((service, index) => (
                        <div
                            onClick={() => { navigate(`${service.link}`); scrollTo(0, 0) }}
                            key={index}
                            className="relative group overflow-hidden transition-all duration-500"
                        >
                            {/* Image */}
                            <figure className='w-full bg-cover bg-center bg-no-repeat object-cover'>
                                <img src={service.img} className='max-h-[570px] w-full transition duration-500 group-hover:scale-110' alt="" />
                            </figure>
                            {/* <h3 className="text-xl font-semibold mb-3 uppercase absolute bottom-0 left-0 text-white">
                            {service.title}
                        </h3> */}

                            {/* Overlay for featured (middle) */}
                            <div className="group-hover:opacity-100 opacity-0 absolute group-hover:inset-0 bg-gradient-to-r from-black/60 to-red-800/60 md:flex hidden items-center justify-center">
                                <div className="border border-white/30 text-white text-center 2xl:px-8 px-6 2xl:py-10 py-8 backdrop-blur-sm w-[90%] mx-auto">

                                    {/* Icon */}
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-white flex items-center justify-center">
                                        🍸
                                    </div>

                                    <p className="text-xl font-bold mb-3 uppercase">
                                        {service.title}
                                    </p>

                                    <p className="text-sm text-gray-200 mb-4">
                                        Magnis vel tortor faucibus, tempor tellus nostra sociis
                                        euismod gravida.
                                    </p>

                                    <button className="text-sm uppercase tracking-wide cursor-pointer hover:text-orange-500 font-semibold transition duration-200">
                                        More Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom */}

            <div className="flex flex-col sm:flex-row items-center 2xl:gap-10 lg:gap-8 gap-6 items-center 2xl:mt-24 sm:mt-[75px] mt-[59px]">

                {/* LEFT CONTENT */}
                <div ref={ref} className={`box flex-1/2 mb-5 sm:mb-0 ${inView ? "show" : ""}`}>
                    <div
                        className={``}
                    >
                        <p className="text-orange-500 uppercase tracking-widest mb-2 2xl:text-base text-sm font-semibold">
                            About Company
                        </p>

                        <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A] sm:mb-6 mb-5">
                            We Serve Quality & Balanced Food
                        </h2>

                        <p className="text-gray-500 mb-7 sm:leading-relaxed sm:text-base text-sm">
                            Lorem ipsum dolor sit amet consectetur adipiscing elit, arcu nam
                            feren ames aliquam gravida praesent susci nibh faucibus magnis
                            condimentum nulla. Ante parturient iaculis orci curae sapien feugiat
                            conubia litora vivamus sociis auctor vestibulum.
                        </p>

                        <button className="uppercase bg-[#FE6A13] text-white px-[30px] 2xl:py-3.5 py-3 2xl:text-base text-sm font-semibold cursor-pointer hover:bg-[#1A1A1A] transition-all duration-300">
                            DISCOVER MENUS
                        </button>
                    </div>
                </div>

                <div ref={ref} style={{transitionDelay:'120ms'}} className={`box flex flex-1/2 justify-end lg:gap-5 gap-4 ${inView ? "show" : ""}`}>
                    {/* STATS BOXES */}
                    <div className="flex flex-col border border-gray-300 divide-y divide-gray-300">

                        <div className="text-center 2xl:pt-6 sm:pt-5">
                            <h3 className="2xl:text-6xl lg:text-5xl sm:text-[42px] text-4xl font-bold text-gray-500 2xl:mb-6 sm:mb-5 leading-none py-1" style={{ fontFamily: "Jost" }}>120</h3>
                            <p className="sm:mt-2 uppercase font-semibold border-t border-gray-300 2xl:px-10 px-4 2xl:py-2.5 sm:py-2 py-1.5 sm:text-[13px] text-xs leading-[1.2em]">
                                Awards Won
                            </p>
                        </div>

                        <div className="text-center 2xl:pt-6 sm:pt-5">
                            <h3 className="2xl:text-6xl lg:text-5xl sm:text-[42px] text-4xl font-bold text-gray-500 2xl:mb-6 sm:mb-5 leading-none py-1" style={{ fontFamily: "Jost" }}>68</h3>
                            <p className="sm:mt-2 uppercase font-semibold border-t border-gray-300 2xl:px-10 px-4 2xl:py-2.5 sm:py-2 py-1.5 sm:text-[13px] text-xs leading-[1.2em]">
                                Location Store
                            </p>
                        </div>

                        <div className="text-center 2xl:pt-6 sm:pt-5">
                            <h3 className="2xl:text-6xl lg:text-5xl sm:text-[42px] text-4xl font-bold text-gray-500 2xl:mb-6 sm:mb-5 leading-none py-1" style={{ fontFamily: "Jost" }}>222</h3>
                            <p className="sm:mt-2 uppercase font-semibold border-t border-gray-300 2xl:px-10 px-4 2xl:py-2.5 sm:py-2 py-1.5 sm:text-[13px] text-xs leading-[1.2em]">
                                Food Specialist
                            </p>
                        </div>

                    </div>

                    {/* RIGHT IMAGE */}
                    <div>
                        <img
                            src={about_image}
                            alt="restaurant"
                            className="w-full 2xl:h-[470px] h-full object-cover"
                        />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Service