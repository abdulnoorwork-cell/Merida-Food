import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar';
import toast from 'react-hot-toast'
import { BiLogOut } from "react-icons/bi";
import backgroundImage from '../../assets/product_bg.webp'

const Layout = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    toast.success('Logout Successfully')
    setTimeout(() => {
      window.location.href = '/admin'
    }, 1000)
  }
  return (
    <div className='bg-no-repeat bg-cover text-white' style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className='flex items-center justify-between py-3 px-4 sm:px-10 gap-2 bg-black/30 backdrop-blur-xs min-h-[75px]'>
        <div style={{fontFamily:'Poppins'}} onClick={() => { navigate('/admin'); scrollTo(0, 0) }} className="logo leading-none sm:text-[32px] text-2xl cursor-pointer text-white tracking-tight">
          <span className='font-semibold'>Dashboard</span>
        </div>
        <button style={{fontFamily:'Poppins'}} onClick={logout} type='submit' className='sm:text-sm text-xs px-7 w-fit py-[10px] bg-orange-600 hover:bg-orange-600 text-white rounded-md cursor-pointer font-medium flex items-center gap-1'><span className='text-lg'><BiLogOut /></span>Logout</button>
      </div>
      <div className='flex min-h-screen'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout