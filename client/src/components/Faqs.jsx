import React, { useState, useEffect } from 'react'
import faqs_bg from '../assets/faqs_bg.webp'
import chef_image from '../assets/chef_image.webp'
import { useInView } from 'react-intersection-observer';

const faqs = [
    {
        question: "What Are Your Operating Hours?",
        answer:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit, dictum faucibus bibendum est eget imperdiet, vel venenatis inceptos vivamus torquent pellentesque. Turpis non dapibus pulvinar consequat suscipit himenaeos nam.",
    },
    {
        question: "Do You Offer Vegetarian and Vegan Options?",
        answer:
            "Yes, we offer a variety of vegetarian and vegan dishes prepared with fresh ingredients.",
    },
    {
        question: "Can I Make a Reservation?",
        answer:
            "Absolutely! You can reserve a table online or by calling us directly.",
    },
];

const Faqs = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const {ref,inView}=useInView({threshold:0.2,triggerOnce:false});

    return (
        <div style={{ backgroundImage: `url(${faqs_bg})` }} className="bg-no-repeat bg-center bg-cover 2xl:pt-[70px] pt-[50px] pb-24 px-4">
            <div className="container mx-auto px-4 grid md:grid-cols-2 md:gap-10 gap-8 items-center">
                {/* Image */}
                <div ref={ref} className={`box ${inView ? "show" : ""}`}>
                    <img
                        src={chef_image}
                        alt="Chef Cooking"
                        className="w-full rounded-lg shadow-lg 2xl:max-w-[583px] xl:max-w-[560px] sm:max-w-[500px] max-w-[450px]"
                    />
                </div>

                {/* Content */}
                <div ref={ref} style={{transitionDelay:"120ms"}} className={`box ${inView ? "show" : ""} mt-5 md:mt-0`}>
                    <p className="text-orange-500 font-semibold uppercase 2xl:text-base text-sm mb-2">
                        Some Question Answer
                    </p>
                    <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A] mb-6">
                        Frequently Asked <br /> Questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-[rgb(222,226,230)] rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className={`w-full text-left px-5 2xl:py-4 xl:py-3.5 py-3 font-medium cursor-pointer transition-all duration-200 sm:text-base text-sm ${activeIndex === index
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {faq.question}
                                </button>

                                {activeIndex === index && (
                                    <div className="px-5 py-4 bg-white text-gray-500 text-sm sm:text-[15px]">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Faqs