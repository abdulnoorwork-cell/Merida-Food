import React, { useState,useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { LuSearch } from "react-icons/lu";
import { RiUserLine } from "react-icons/ri";
import { FiHeart } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { RiMenu3Fill } from "react-icons/ri";
import { HiMiniPlusCircle } from "react-icons/hi2";
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const [sticky, setSticky] = useState(false);
    const [mobile, setMobile] = useState(false)
    const {navigate,token,totalCartItems,wishlist} = useContext(AppContext)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            setSticky(true)
        } else {
            setSticky(false)
        }
    })
    return (
        <>
            {/* Top */}
            <div className='bg-[#FE6A13] text-white sm:block hidden'>
                <div className="container mx-auto px-4 flex items-center justify-between font-medium 2xl:text-base text-sm 2xl:py-2 py-1.5">
                    <div>Mon-Wed: 11a-9p / Thurs-Sat: 11a-10p</div>
                    <div>123 456 7899 /  296 Ridao Avenie Mor Berlin 251584</div>
                </div>
            </div>
            {/* Navbar */}
            <div className={`navbar bg-white py-3 lg:py-0 sticky top-0 left-0 z-30 min-h-[70px] flex items-center border-b border-gray-200 ${sticky ? 'shadow-[0_10px_30px_rgba(0,0,0,0.1)]' : 'shadow-none'}`}>
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Logo */}
                    <div onClick={()=>{navigate('/');scrollTo(0,0)}} className="logo 2xl:text-[42px] text-4xl font-bold uppercase text-[#1A1A1A] cursor-pointer text-[#FE6A13] sm:text-[#1A1A1A] hover:text-[#FE6A13] transition-all duration-200 tracking-tight">Merida</div>
                    {/* Navbar */}
                    <ul className={`lg:font-semibold font-medium text-base uppercase flex flex-col lg:flex-row fixed lg:static max-lg:w-full max-lg:max-w-[310px] max-lg:h-screen bg-white justify-center items-center lg:gap-10 gap-0 text-[#1A1A1A] max-lg:border-r-3 border-[#FE6A13] max-lg:top-0 px-6 lg:px-0 z-50 transition-all duration-300 ${mobile ? 'max-lg:left-0' : 'max-lg:left-[-100%]'}`}>
                        <span onClick={() => setMobile(false)} className='close flex lg:hidden absolute top-[25px] right-[-16.5px] bg-[#1A1A1A] text-white w-[33px] h-[33px] rounded-full items-center justify-center cursor-pointer text-lg z-10'><MdClose /></span>
                        <NavLink onClick={()=>{scrollTo(0,0);setMobile(false)}} to={'/'} className={`hover:text-[#FE6A13] transition-all duration-200 2xl:py-[34px] lg:py-7 px-4 lg:px-0 py-3 2xl:text-[15px] text-sm border-b lg:border-none max-lg:w-full`}>Home</NavLink>
                        <NavLink onClick={()=>{scrollTo(0,0);setMobile(false)}} to={'/about'} className={`hover:text-[#FE6A13] transition-all duration-200 2xl:py-[34px] lg:py-7 px-4 lg:px-0 py-3 2xl:text-[15px] text-sm border-b lg:border-none max-lg:w-full`}>About</NavLink>
                        <NavLink onClick={()=>{scrollTo(0,0);setMobile(false)}} to={'/shop'} className={`hover:text-[#FE6A13] transition-all duration-200 2xl:py-[34px] lg:py-7 px-4 lg:px-0 py-3 2xl:text-[15px] text-sm border-b lg:border-none max-lg:w-full flex items-center justify-between lg:justify-start gap-0.5`}>Shop</NavLink>
                        <NavLink onClick={()=>{scrollTo(0,0);setMobile(false)}} to={'/blogs'} className={`hover:text-[#FE6A13] transition-all duration-200 2xl:py-[34px] lg:py-7 px-4 lg:px-0 py-3 2xl:text-[15px] text-sm border-b lg:border-none max-lg:w-full`}>Blogs</NavLink>
                        <NavLink onClick={()=>{scrollTo(0,0);setMobile(false)}} to={'/contact'} className={`hover:text-[#FE6A13] transition-all duration-200 2xl:py-[34px] lg:py-7 px-4 lg:px-0 py-3 2xl:text-[15px] text-sm border-b lg:border-none max-lg:w-full`}>Contact us</NavLink>
                    </ul>
                    {/* Icons and Button */}
                    <div className='icons_button flex items-center sm:gap-8 gap-5'>
                        <div className='icons flex items-center gap-3 text-[#1A1A1A]'>
                            <span className='2xl:text-[22px] text-xl cursor-pointer'><LuSearch /></span>
                            {token ? <span onClick={()=>{navigate('/wishlist');scrollTo(0,0)}} className='2xl:text-[22px] text-xl cursor-pointer relative'><FiHeart /><small className='absolute top-1.5 -right-1 bg-orange-600 text-white sm:text-[11px] text-[10px] rounded-full px-[3px] py-[2px] min-w-[14px] text-center leading-none'>{wishlist.length > 0 ? wishlist.length : "0"}</small></span> : 
                            <span onClick={()=>{navigate('/login');scrollTo(0,0)}} className='2xl:text-[22px] text-xl cursor-pointer relative'><FiHeart /><small className='absolute top-1.5 -right-1 bg-orange-600 text-white sm:text-[11px] text-[10px] rounded-full px-[3px] py-[2px] min-w-[14px] text-center leading-none'>{wishlist.length > 0 ? wishlist.length : "0"}</small></span>}
                            {token ? <span onClick={()=>{navigate('/cart');scrollTo(0,0)}} className='2xl:text-[22px] text-xl cursor-pointer relative'><HiOutlineShoppingBag /><small className='absolute top-1.5 -right-1.5 bg-orange-600 text-white sm:text-[11px] text-[10px] rounded-full px-[3px] py-[2px] min-w-[14px] text-center leading-none'>{totalCartItems > 0 ? totalCartItems : "0"}</small></span> : <span onClick={()=>{navigate('/login');scrollTo(0,0)}} className='2xl:text-[22px] text-xl cursor-pointer relative'><HiOutlineShoppingBag /><small className='absolute top-1.5 -right-1.5 bg-orange-600 text-white sm:text-[11px] text-[10px] rounded-full px-[3px] py-[2px] min-w-[14px] text-center leading-none'>{totalCartItems > 0 ? totalCartItems : "0"}</small></span>}
                            {token ? <span onClick={()=>{navigate('/my-account');scrollTo(0,0)}} className='2xl:text-[22px] text-xl cursor-pointer'><RiUserLine /></span> : <span onClick={()=>{navigate('/login');scrollTo(0,0)}} className='2xl:text-[22px] text-xl cursor-pointer'><RiUserLine /></span>}
                        </div>
                        <button className='uppercase 2xl:text-base text-sm bg-[#FE6A13] text-white px-[30px] 2xl:py-3.5 py-3 font-semibold cursor-pointer hover:bg-[#1A1A1A] transition-all duration-300 sm:block hidden'>Get Started</button>

                        {/* hamburger */}
                        <span onClick={() => setMobile(true)} className='hamburger text-white bg-[#1A1A1A] sm:w-[45px] w-10 h-10 sm:h-[45px] lg:hidden block sm:text-xl text-lg flex items-center justify-center cursor-pointer'><RiMenu3Fill /></span>
                    </div>
                </div>
                {/* Overlay */}
                <div className={`w-full h-screen fixed top-0 left-0 bg-[#24231dc4] z-30 ${mobile ? 'block' : 'hidden'}`}></div>
            </div>
        </>
    )
}

export default Navbar