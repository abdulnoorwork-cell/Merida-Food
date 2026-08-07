import React,{useEffect} from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import team_1 from '../assets/team-1.webp'
import team_2 from '../assets/team-2.webp'
import team_3 from '../assets/team-3.webp'
import { useInView } from 'react-intersection-observer';

const team = [
  {
    name: "Edward Robert",
    role: "Senior Chef",
    image: team_3,
  },
  {
    name: "Markus Daniel",
    role: "Senior Chef",
    image: team_1,
  },
  {
    name: "Thomas Samuel",
    role: "Senior Chef",
    image: team_2,
  },
];

const Team = () => {

  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section className="container mx-auto 2xl:pt-20 pt-16 pb-16 px-4">
      <div>

        {/* Heading */}
        <div className="text-center 2xl:mb-10 mb-9">
          <p className="text-orange-500 uppercase tracking-widest mb-2 2xl:text-base text-sm font-semibold">
            Team Members
          </p>
          <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A]">
            Meet Our Professionals
          </h2>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 grid-cols-2 gap-5">
          {team.map((member, index) => (
            <div
              key={index}
              className={`team group relative overflow-hidden`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full xl:h-[500px] sm:h-[450px] h-full object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-start pl-6 space-y-3">

                  {/* Social Icons */}
                  <div className="flex flex-col sm:gap-3 gap-2.5">
                    <span className="bg-white sm:w-10 sm:h-10 w-8 h-8 flex items-center justify-center text-orange-500 cursor-pointer">
                      <FaFacebookF />
                    </span>
                    <span className="bg-white sm:w-10 sm:h-10 w-8 h-8 flex items-center justify-center text-orange-500 cursor-pointer">
                      <FaTwitter />
                    </span>
                    <span className="bg-white sm:w-10 sm:h-10 w-8 h-8 flex items-center justify-center text-orange-500 cursor-pointer">
                      <FaLinkedinIn />
                    </span>
                    <span className="bg-white sm:w-10 sm:h-10 w-8 h-8 flex items-center justify-center text-orange-500 cursor-pointer">
                      <FaInstagram />
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="sm:p-5 p-4 text-center bg-white absolute bottom-[5%] left-0 right-0 w-[90%] mx-auto">
                <p className="sm:text-xl text-base font-semibold leading-tight">
                  {member.name}
                </p>
                <p className="text-orange-500 font-normal sm:text-base text-sm">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Team;