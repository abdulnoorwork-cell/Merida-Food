import React, { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import profile_image from '../assets/profile_image.png'
import { IoClose } from "react-icons/io5";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { RiBox3Line, RiEdit2Fill } from "react-icons/ri";
import { FiPackage, FiMapPin } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { FiHeart } from "react-icons/fi";
import { RiUserLine } from "react-icons/ri";
import { MdOutlineReviews } from "react-icons/md";
import { Heart, Star } from 'lucide-react';
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import ProductCard from '../components/ProductCard'

const MyAccount = () => {
  const [label, setLabel] = useState("Dashboard");
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState(profile_image);
  const { token, userId, backendUrl, currency, navigate, wishlist, toggleWishlist, fetchUserOrders, orders } = useContext(AppContext)
  const file = useRef();

  const statusColor = (order_status) => {
    switch (order_status) {
      case "PACKING":
        return "bg-yellow-100 text-yellow-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "OUT FOR DELIVERY":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-400";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && userId) {
        try {
          let response = await axios.get(`${backendUrl}/api/user/user-data/${userId}`, {
            headers: {
              Authorization: `${token}`
            },
            withCredentials: true
          })
          console.log(response.data)
          if (response.data) {
            setName(response.data[0].name)
            setEmail(response.data[0].email);
            setPhone(response.data[0].phone);
            setPreviewImage(JSON.parse(response?.data[0]?.profile_image).url)
            await fetchUserOrders()
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
    fetchUserData()
  }, [token, userId])

  const logout = () => {
    localStorage.removeItem('User');
    toast.success("Logout successfully")
    setTimeout(() => {
      navigate('/login')
      window.location.reload()
    }, 1000)
  }

  const updateUserHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('profile_image', image || '');
      let response = await axios.put(`${backendUrl}/api/user/update/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`
        },
        withCredentials: true
      })
      if (response.data) {
        console.log(response.data)
        setLoading(false)
        setModel(false)
        toast.success(response.data.messege);
        fetchUser();
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error(error.response.data.messege);
    }
  }

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      setImage(file)
      setPreviewImage(fileReader?.result)
    }
  }

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
          <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">My Account</p>

          <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
            HOME &gt; My Account
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 min-h-[95vh] sm:py-24 py-20 lg:grid grid-cols-4 gap-8">

        {/* Sidebar */}
        <div>

          <div className="bg-orange-50 p-6 flex flex-col items-center">
            <img
              src={previewImage}
              className="w-[70px] h-[70px] rounded-full"
            />

            <h3 className="mt-2 font-semibold text-xl tracking-tight leading-none">
              {name}
            </h3>

            <h6 className="text-gray-500 text-sm sm:text-[15px]">
              {email}
            </h6>
            <button onClick={() => setModel(true)} className='text-white bg-[#FE6A13] px-8 py-2 text-sm font-medium cursor-pointer mt-2'>Edit Profile</button>
          </div>

          <div className="mt-4">

            <button onClick={() => setLabel("Dashboard")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-3 ${label === "Dashboard" ? "bg-orange-50 text-[#FE6A13] border-r-4 border-[#FE6A13]" : ""}`}>
              <span className='text-lg'><RxDashboard /></span>Dashboard
            </button>

            <button onClick={() => setLabel("Orders")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-3 ${label === "Orders" ? "bg-orange-50 text-[#FE6A13] border-r-4 border-[#FE6A13]" : ""}`}>
              <span className='text-lg'><RiBox3Line /></span>Orders
            </button>

            <button onClick={() => setLabel("Wishlist")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-3 ${label === "Wishlist" ? "bg-orange-50 text-[#FE6A13] border-r-4 border-[#FE6A13]" : ""}`}>
              <span className='text-lg'><FiHeart /></span>Wishlist
            </button>

            <button onClick={() => setLabel("Account Details")} className={`cursor-pointer w-full flex items-center gap-2 text-left px-4 py-3 ${label === "Account Details" ? "bg-orange-50 text-[#FE6A13] border-r-4 border-[#FE6A13]" : ""}`}>
              <span className='text-lg'><RiUserLine /></span>Account Details
            </button>

            <button onClick={logout} className="cursor-pointer border-t border-gray-300 w-full text-left px-4 pt-3 pb-3.5 text-red-500 mt-3 font-medium">
              Logout
            </button>

          </div>
        </div>

        {/* Dashboard */}
        {label === "Account Details" ?
          <div className="lg:col-span-3 space-y-6 w-full">

            {/* Account Info */}
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-2xl font-semibold leading-none">
                  Personal Information
                </p>

                <button onClick={() => setModel(true)} className="bg-[#FE6A13] text-white px-4 py-[5px] cursor-pointer text-sm font-medium flex items-center gap-1">
                  <RiEdit2Fill size={16} />
                  Edit
                </button>
              </div>

              {/* Info List */}
              <div>
                {/* Name */}
                <div className="flex items-start gap-4 p-3 border border-b-[0] border-gray-400">
                  <FiUser className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="text-gray-500">Full Name</p>
                    <p>{name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-3 border border-b-[0] border-gray-400">
                  <FiMail className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p>{email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-3 border border-gray-400">
                  <FiPhone className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p>{phone}</p>
                  </div>
                </div>
                <img src={previewImage} className='w-[60px] h-[60px] rounded-full cursor-pointer mt-4' alt="profile image" />
              </div>

            </div>
          </div> :
          label === "Orders" ?
            <div className="lg:col-span-3 space-y-6 w-full max-h-[630px] overflow-y-auto">
              {orders.length === 0 ? <div className="text-center py-20 border border-gray-400">
                <p className="text-xl font-semibold">
                  Your orders is empty
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  You don,t have any orders
                </p>
              </div> : orders.map((order, index) => (
                <div
                  key={index}
                  className="w-full p-4.5"
                >
                  {/* Top */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">
                        Order #{order._id}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1).toLowerCase()}
                      </span>
                    </div>

                    <h6 className="text-sm text-gray-700">
                      {new Date(order.created_at).toDateString()}
                    </h6>
                  </div>

                  {/* Middle */}
                  <div className="flex gap-4 items-center border-b border-gray-400 pb-4">
                    <img
                      src={order.images[0].url}
                      alt="product"
                      className="w-16 h-16 rounded-md object-cover border border-gray-400 bg-gray-100"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium">
                        {order.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Qty: {order.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <h6 className="text-lg font-semibold">
                        {currency}.{order.price.toLocaleString()}
                      </h6>

                      {/* <button className="mt-2 bg-[#FE6A13] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
                        View Order
                      </button> */}
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="flex flex-wrap gap-6 mt-3 text-sm text-gray-700 font-medium">
                    <div className="flex items-center gap-2">
                      <FiMapPin />
                      {JSON.parse(order.address).city} {JSON.parse(order.address).postal_code} {JSON.parse(order.address).address}
                    </div>

                    <div className="flex items-center gap-2">
                      <FiPhone />
                      {JSON.parse(order.address).phone}
                    </div>

                    {order.order_status === "DELIVERED" && <div onClick={() => { navigate(`/shop/${order.product_id}`); scrollTo(0, 0) }} className="flex items-center gap-2 cursor-pointer">
                      <MdOutlineReviews />
                      Submit Review
                    </div>}
                  </div>
                </div>
              ))}
            </div> :
            label === "Wishlist" ?
              <div className="lg:col-span-3 space-y-6 w-full max-h-[630px] overflow-y-auto">
                {wishlist.length === 0 ? (
                  <div className="text-center py-20 border border-gray-400">
                    <p className="text-xl font-semibold">
                      Your wishlist is empty 💔
                    </p>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Start adding products you love
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Grid */}
                    <div className="products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-[18px] gap-4">
                      {wishlist.map((item,index) => (
                        <ProductCard key={index} product={item} />
                      ))}
                    </div>
                  </>
                )}
              </div> :
              <div className="lg:col-span-3 space-y-6 w-full">

                {/* Account Info */}
                <div className="sm:px-6 sm:py-7 p-5 border border-gray-400">

                  <div className="flex justify-between">

                    <p className="font-semibold text-xl leading-none">
                      Account Information
                    </p>

                    <button onClick={() => setModel(true)} className="cursor-pointer h-fit bg-[#FE6A13] text-white text-sm py-1 px-4 font-medium hover:bg-orange-600 transition duration-200">
                      Edit
                    </button>

                  </div>

                  <div className="mt-4 text-gray-600">
                    <p>{name}</p>
                    <p>{email}</p>
                    <p>{phone}</p>
                  </div>

                </div>

                {/* Orders + Wishlist */}
                <div className="grid md:grid-cols-2 gap-6">
                  {orders.length > 0 ? orders.map((order, index) => (
                    <div key={index} className="sm:px-6 sm:py-7 p-5 border border-gray-400">
                      <p className="font-semibold text-xl mb-2">
                        My Orders
                      </p>

                      <p className="text-gray-600">
                        Order #{order._id}
                      </p>

                      <p className="text-green-600 text-sm">
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1).toLowerCase()}
                      </p>

                      <button onClick={() => setLabel("Orders")} className="mt-3 text-[#FE6A13] cursor-pointer text-sm font-medium">
                        View Orders
                      </button>
                    </div>
                  )) : <div className="sm:px-6 sm:py-7 p-5 border border-gray-400">
                    You have not any order item
                  </div>}

                  <div className="sm:px-6 sm:py-7 p-5 border border-gray-400">
                    <p className="font-semibold text-xl mb-2">
                      My Wishlist
                    </p>

                    <p className="text-gray-600">
                      {wishlist?.length} items saved
                    </p>

                    <button onClick={() => setLabel("Wishlist")} className="mt-3 text-[#FE6A13] cursor-pointer text-sm font-medium">
                      View Wishlist
                    </button>
                  </div>

                </div>

                {/* Address */}
                {orders.length > 0 ? orders.map((order, index) => (
                  <div className="sm:px-6 sm:py-7 p-5 border border-gray-400">

                    <div key={index} className="flex justify-between">

                      <p className="font-semibold text-xl">
                        Shipping Address
                      </p>

                      {/* <button className="bg-[#FE6A13] text-white px-4 py-[5px] cursor-pointer text-sm font-medium">
                        Edit
                      </button> */}

                    </div>

                    <p className="mt-3 text-gray-600">
                      {JSON.parse(order.address).firstName} {JSON.parse(order.address).lastName}
                    </p>

                    <p className="text-gray-600">
                      {JSON.parse(order.address).address}
                    </p>

                    <p className="text-gray-600">
                      {JSON.parse(order.address).city} {JSON.parse(order.address).postal_code}
                    </p>

                    <p className="text-gray-600">
                      {JSON.parse(order.address).phone}
                    </p>

                  </div>
                )) : <div className="sm:px-6 sm:py-7 p-5 border border-gray-400">

                  <div className="flex justify-between">

                    <p className="font-semibold text-xl">
                      Shipping Address
                    </p>

                    <button className="bg-[#FE6A13] text-white px-4 py-[5px] cursor-pointer text-sm font-medium">
                      Edit
                    </button>

                  </div>

                  <p className="mt-3 text-gray-600">
                    Ahmed Sheikh
                  </p>

                  <p className="text-gray-600">
                    123 Green St
                  </p>

                  <p className="text-gray-600">
                    Karachi, Pakistan
                  </p>

                  <p className="text-gray-600">
                    +92 303 1234567
                  </p>

                </div>}

              </div>}

      </div>
      {/* User Update */}
      <div className={`relative ${model ? 'block' : 'hidden'}`}>
        <form onSubmit={updateUserHandler} className='bg-white sm:p-10 p-8 z-50 fixed rounded-lg top-[50%] left-[50%] max-w-[500px] w-[93%] mx-auto h-fit shadow-[0px_4px_40px_0px_rgba(0,0,0,0.06)]' style={{ transform: 'translate(-50%,-50%)' }}>
          <span onClick={() => setModel(false)} className='absolute top-0 right-0 bg-red-500 text-white text-xl cursor-pointer p-1'><IoClose /></span>
          <h3 className='text-xl sm:text-2xl font-bold tracking-tight'>Update Profile</h3>
          <div className='sm:text-base text-sm flex flex-col gap-4 mt-5'>
            <div className='flex flex-col gap-1  w-full'>
              <label className='ml-1'>Full Name</label>
              <input required onChange={(e) => setName(e.target.value)} name='name' value={name} className='border border-gray-400 py-[10px] rounded px-3.5 w-full outline-none' type="name" placeholder='Full Name' />
            </div>
            <div className='flex flex-col gap-1  w-full'>
              <label className='ml-1'>Email Address</label>
              <input required onChange={(e) => setEmail(e.target.value)} name='email' value={email} className='border border-gray-400 py-[10px] rounded px-3.5 w-full outline-none' type="email" placeholder='Email Address' />
            </div>
            <div className='flex flex-col gap-1  w-full'>
              <label className='ml-1'>Phone</label>
              <input required onChange={(e) => setPhone(e.target.value)} name='phone' value={phone} className='border border-gray-400 py-[10px] rounded px-3.5 w-full outline-none' type="number" placeholder='Phone' />
            </div>
            <img src={previewImage} onClick={() => file.current.click()} className='w-[70px] h-[70px] rounded-full cursor-pointer mt-1' alt="profile image" />
            <input type="file" ref={file} onChange={imageHandler} hidden />
            <button type='submit' className='cursor-pointer bg-[#FE6A13] mt-4 text-white px-8 py-3 text-sm sm:text-base font-medium hover:bg-orange-600 transition duration-200'>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
      {/* Overlay */}
      <div onClick={() => setModel(false)} className={`w-full h-screen fixed top-0 left-0 bg-[#24231dc4] z-30 ${model ? 'block' : 'hidden'}`}></div>

    </div >
  )
}

export default MyAccount