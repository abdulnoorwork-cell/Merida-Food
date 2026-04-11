import React, { useState } from 'react'
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import video_bg from '../assets/video_bg.webp'
import ReactPlayer from 'react-player';
import { IoRestaurantOutline } from "react-icons/io5";
import { GrRestaurant } from "react-icons/gr";
import { FaAward } from "react-icons/fa";
import Team from '../components/Team'

const About = () => {
  const [startVideo, setStartVideo] = useState(false)
  const data = [
    {
      title: "Fresh Authentic Flavors",
      desc: "Vehicula placerat eleifend facilisi tortor, interdum feugiat arcu habitasse iaculis ultricies ornare ridiculus.",
      icon: <FaAward />,
    },
    {
      title: "Inviting Atmosphere",
      desc: "Vehicula placerat eleifend facilisi tortor, interdum feugiat arcu habitasse iaculis ultricies ornare ridiculus.",
      icon: <IoRestaurantOutline />,
    },
    {
      title: "Experience Chefs",
      desc: "Vehicula placerat eleifend facilisi tortor, interdum feugiat arcu habitasse iaculis ultricies ornare ridiculus.",
      icon: <GrRestaurant />,
    },
  ];
  return (
    <div>
      {/* Hero Section */}
      <div className="relative 2xl:h-[430px] xl:h-[380px] lg:h-[360px] md:h-[340px] sm:h-[320px] h-[300px] w-full">
        {/* Background Image */}
        <img
          src={breadcrumb_bg}
          alt="hero"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="container mx-auto absolute inset-0 flex flex-col md:flex-row md:items-center md:justify-between justify-center px-4 text-white">
          <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">About</p>

          <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
            HOME &gt; About
          </p>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">

          {/* SMALL TITLE */}
          <p className="text-orange-500 uppercase tracking-widest 2xl:text-base text-sm font-semibold mb-2">
            About Company
          </p>

          {/* MAIN HEADING */}
          <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A] sm:mb-6 mb-5">
            Provide Global Cuisine At Your <br />
            FingerTips
          </h2>

          {/* DESCRIPTION */}
          <p className="text-gray-500 mb-7 sm:leading-relaxed sm:text-base text-sm">
            Bring the world to your table with our “Global Cuisine at Your Fingertips” experience. From rich, aromatic Asian delicacies to classic European favorites and vibrant Middle Eastern flavors, we offer a diverse menu crafted to satisfy every craving. Each dish is thoughtfully prepared using high-quality ingredients, authentic recipes, and modern culinary techniques to deliver an unforgettable taste journey. Whether you're exploring new flavors or indulging in familiar classics, our platform makes it effortless to enjoy international cuisine anytime, anywhere. Experience convenience, variety, and excellence—all just a click away.
          </p>

          {/* BUTTON */}
          <button className='uppercase 2xl:text-base text-sm bg-[#FE6A13] text-white px-[30px] 2xl:py-3.5 py-3 font-semibold cursor-pointer hover:bg-[#1A1A1A] transition-all duration-300 sm:block hidden mx-auto'>Contact Now</button>
        </div>

        {/* VIDEO SECTION */}
        <div className="container mx-auto px-4 mt-20">
          <div className="relative group overflow-hidden h-[500px]">

            {startVideo ? <ReactPlayer src='https://youtu.be/xPPLbEFbCAo' width={'100%'} height={'100%'} controls /> : <img
              src={video_bg}
              alt="restaurant"
              className="w-full h-full object-cover"
            />}

            {/* PLAY BUTTON */}
            {!startVideo && <div onClick={() => setStartVideo(true)} className="absolute inset-0 flex items-center justify-center">
              <div className="sm:w-24 sm:h-24 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition">
                <span className="text-white text-3xl">▶</span>
              </div>
            </div>}

          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto px-4 text-center">

          {/* TOP SMALL TEXT */}
          <p className="text-orange-500 uppercase tracking-widest 2xl:text-base text-sm font-semibold mb-2">
            We Service Provide
          </p>

          {/* HEADING */}
          <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A] 2xl:mb-10 sm:mb-9 mb-6.5">
            Why People Choose Us
          </h2>

          {/* CARDS */}
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-5">
            {data.map((item, i) => (
              <div
                key={i}
                className={`pt-[60px] px-10 pb-[51px] shadow-[0px_4px_52px_0px_#00000012] transition bg-white`}
              >
                {/* ICON */}
                <div className="2xl:w-[120px] 2xl:h-[120px] sm:w-24 sm:h-24 w-20 h-20 rounded-full mx-auto sm:mb-6 mb-4 flex items-center justify-center bg-[#FE6A13] text-white 2xl:text-[55px] sm:text-5xl text-4xl">
                  {item.icon}
                </div>

                {/* TITLE */}
                <p className="2xl:text-2xl text-xl font-semibold sm:mb-3 mb-2">
                  {item.title}
                </p>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm sm:leading-relaxed sm:text-base">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
      <section className='mb-10 mt-4'>
        <Team />
      </section>

    </div>
  )
}

export default About