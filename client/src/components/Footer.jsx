import React, { useContext } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { ImPhone } from "react-icons/im";
import { AppContext } from "../context/AppContext";

export default function Footer() {
  const hours = [
    { day: "Mon - Wed", time: "11:00 AM - 09:00 PM" },
    { day: "Thu - Sat", time: "11:00 AM - 10:00 PM" },
    { day: "Sunday", time: "Closed" },
  ];
  const {navigate} = useContext(AppContext);
  return (
    <footer className="relative text-white bg-[#1A1A1A] xl:min-h-[380px] flex flex-col justify-center">

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-[100px] pb-[90px] grid md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <div className="logo 2xl:text-[42px] text-4xl font-semibold tracking-tight mb-3 leading-[1.1em] uppercase">Merida</div>
          <p className="text-gray-300 2xl:text-base text-sm leading-relaxed">
            An IT consultancy can help you assess your technology needs and
            develop a technology strategy that aligns with your business.
          </p>
        </div>

        {/* Menu Links */}
        <div>
          <p className="text-xl font-semibold mb-4">Explore Menu</p>
          <ul className="space-y-2 text-gray-300 2xl:text-base text-sm">
            <li onClick={()=>{navigate('/shop/category/breakfast');scrollTo(0,0)}} className="hover:text-orange-500 cursor-pointer transition">
              → Breakfast
            </li>
            <li onClick={()=>{navigate('/shop/category/lunch');scrollTo(0,0)}} className="hover:text-orange-500 cursor-pointer transition">
              → Lunch
            </li>
            <li onClick={()=>{navigate('/shop/category/fastfood');scrollTo(0,0)}} className="hover:text-orange-500 cursor-pointer transition">
              → Fast Food
            </li>
            <li onClick={()=>{navigate('/shop/category/light&digestive');scrollTo(0,0)}} className="hover:text-orange-500 cursor-pointer transition">
              → Light & Digestive
            </li>
            <li onClick={()=>{navigate('/shop/category/bestseller');scrollTo(0,0)}} className="hover:text-orange-500 cursor-pointer transition">
              → Best Seller
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xl font-semibold mb-4">Get in Touch</p>
          <div className="flex gap-[15px]">
            <div className="bg-[#2c2c2c] text-white w-10 h-10 rounded-full flex items-center justify-center"><IoLocationSharp /></div>
            <p className="2xl:text-base text-sm text-gray-300 mb-3">
              <span className="text-orange-500 font-medium">Location:</span><br />
              Silk St, Barbican, London E2Y, UK
            </p>
          </div>

          <div className="flex gap-[15px]">
            <div className="bg-[#2c2c2c] text-white w-10 h-10 rounded-full flex items-center justify-center"><ImPhone /></div>
            <p className="2xl:text-base text-sm text-gray-300">
              <span className="text-orange-500 font-medium">Phone Number:</span><br />
              +123 456 7890
            </p>
          </div>

        </div>

        {/* Gallery Images (IMPORTANT PART) */}
        <div>
          <p className="text-xl font-semibold mb-4">Opening Hours</p>
          <div className="text-white">

            {/* Hours List */}
            <div className="space-y-3">
              {hours.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-700 pb-2 2xl:text-base text-sm"
                >
                  <span className="text-gray-300">{item.day}</span>
                  <span
                    className={`font-medium text-sm ${item.time === "Closed"
                        ? "text-red-400"
                        : "text-gray-100"
                      }`}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="relative text-center py-4 2xl:text-base text-sm bg-[#161616]">
        © 2026 Merida Restaurant. All Rights Reserved.
      </div>
    </footer>
  );
}