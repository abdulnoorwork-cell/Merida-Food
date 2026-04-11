import React, { useState } from 'react'
import { User, Mail } from "lucide-react";
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    option: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };
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
          <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">Contact</p>

          <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
            HOME &gt; Contact
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 2xl:py-26 sm:py-24 py-20 flex flex-col gap-16">

        {/* Map Section */}
        <div className="overflow-hidden">

          <iframe
            title="map"
            width="100%"
            height="560"
            loading="lazy"
            src="https://maps.google.com/maps?q=karachi&t=&z=13&ie=UTF8&iwloc=&output=embed"
          ></iframe>

        </div>

        {/* Contact Form */}
        <div className="w-full bg-[#F6F6F6] sm:p-20 p-8">
          <div className="text-center mb-10">
            <p className="sm:text-4xl text-3xl font-semibold mb-2 tracking-tight leading-none">Leave A Message</p>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Lorem ipsum dolor sit amet consectetur adipiscing, elit curae quis libero erat, justo in habitasse aliquet mi. Condimentum inceptos euismod eu nunc ad nisl fermentum erat gravida
            </p>
          </div>

          <form onSubmit={handleSubmit} action="https://api.web3forms.com/submit" method="POST" className="space-y-5 text-sm">
            <input type="hidden" name="access_key" value="44a0df73-c478-46b6-af8f-27518e08c08e" />
            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <Mail className="absolute right-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="relative">
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <textarea
              name="message"
              placeholder="Type Your Message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="w-full bg-white border border-gray-300 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />

            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-semibold py-3 cursor-pointer hover:bg-[#1A1A1A] transition-all duration-300 text-sm sm:text-base"
            >
              SUBMIT MESSAGE
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Contact