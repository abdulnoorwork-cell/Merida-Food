import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { useContext } from 'react'
import { FaEdit } from 'react-icons/fa'
import loading_animation from '../../../public/loading_animation.svg'
import { MdDeleteOutline, MdOutlineReviews } from 'react-icons/md'
import { BsCartPlus } from "react-icons/bs";
import { TfiWrite } from 'react-icons/tfi'
import { RiBox3Line } from 'react-icons/ri'

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const { backendUrl, navigate, isAdmin, currency, products, fetchProducts, fetchLatestProducts, latestProducts, latestBlogs, blogs, fetchBlogs, fetchUserOrders, fetchLatestBlogs, loading, blogLoading, orderLoading, setOrderLoading, fetchAdminOrders, allReviews } = useContext(AppContext);

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/blog/delete/${blogId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchBlogs();
        await fetchLatestBlogs()
      }
    } catch (error) {
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
      toast.error(error.response.data.message);
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/delete/${productId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchProducts();
        await fetchLatestProducts()
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
    }
  }

  const fetchLatestOrders = async () => {
    try {
      setOrderLoading(true)
      let response = await axios.get(`${backendUrl}/api/order/get-latest-orders`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      })
      if (response.data) {
        setOrders(response.data)
        setOrderLoading(false)
      } else {
        setOrderLoading(false)
        console.log(error.response.data.messege);
      }
    } catch (error) {
      setOrderLoading(false)
      console.log(error)
    }
  }

  const updateOrderStatus = async (order_id, event) => {
    try {

      let response = await axios.put(`${backendUrl}/api/order/update-order/${order_id}`, { order_status: event.target.value }, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        await fetchAdminOrders()
        await fetchUserOrders()
        await fetchLatestOrders()
        toast.success(response.data.messege);
      } else {
        toast.error(response.data.messege)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchLatestBlogs()
    fetchLatestProducts()
    fetchLatestOrders();
  }, [])

  return (
    <div className='flex-1 px-4 py-8 lg:px-10'>
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center gap-3 bg-black/30 backdrop-blur-xs p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <span className='sm:text-2xl text-xl text-white bg-orange-500 sm:w-14 sm:h-14 w-12 h-12 flex items-center justify-center rounded-md'><BsCartPlus /></span>
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{products.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-400 text-sm'>Products</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-black/30 backdrop-blur-xs p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <span className='sm:text-2xl text-xl text-white bg-orange-500 sm:w-14 sm:h-14 w-12 h-12 flex items-center justify-center rounded-md'><TfiWrite /></span>
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{blogs.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-400 text-sm'>Blogs</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-black/30 backdrop-blur-xs p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <span className='sm:text-2xl text-xl text-white bg-orange-500 sm:w-14 sm:h-14 w-12 h-12 flex items-center justify-center rounded-md'><RiBox3Line /></span>
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{orders?.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-400 text-sm'>Orders</h6>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-black/30 backdrop-blur-xs p-4 min-w-54 rounded shadow cursor-pointer hover:scale-105 transition-all'>
          <span className='sm:text-2xl text-xl text-white bg-orange-500 sm:w-14 sm:h-14 w-12 h-12 flex items-center justify-center rounded-md'><MdOutlineReviews /></span>
          <div>
            <p className='sm:text-xl text-lg font-semibold'>{allReviews?.length}</p>
            <h6 style={{ fontFamily: 'Montserrat' }} className='text-gray-400 text-sm'>Reviews</h6>
          </div>
        </div>
      </div>
      {/* Products */}
      <div>
        <div className='flex items-center gap-3 mb-4 mt-6'>
          <h6 className='font-semibold'>Latest Products</h6>
        </div>
        <div className='admin_products_label grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] gap-2 sm:py-3 py-2 px-3 text-xs uppercase font-semibold bg-[#111]'>
          <label style={{ fontFamily: "Montserrat" }}>Product</label>
          <label className='mx-auto max-sm:hidden' style={{ fontFamily: "Montserrat" }}>Category</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Price</label>
          <label className='mx-auto max-xl:hidden' style={{ fontFamily: "Montserrat" }}>Date</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
        </div>
        {loading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
          {latestProducts.length > 0 ?
            <div className='relative w-fulloverflow-x-auto rounded-lg scrollbar-hide bg-black/30 backdrop-blur-xs'>
              <div className='w-full sm:text-[13px] text-xs'>
                <div>
                  {latestProducts?.slice(length - 3).reverse().map((product, index) => (
                    <div key={index} className='product_list border-b border-gray-600 px-2 py-1.5 grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] sm:gap-2 gap-1.5 items-center'>
                      <div className='main_img flex items-center sm:gap-4 gap-3'>
                        <img className='sm:h-14 h-10 w-14 object-contain' src={product?.images[0]?.url} alt="" />
                        <div className='flex flex-col'>
                          <h6 className='leading-[1.3em] font-medium text-base'>{product?.name}</h6>
                        </div>
                      </div>
                      <h6 className='category mx-auto text-center leading-[1.4em] max-sm:hidden'>{product?.category}</h6>
                      <h6 className='category_2 mx-auto text-center leading-[1.4em] text-blue-600 hidden'>{product?.category}</h6>
                      <h6 className='category mx-auto text-center leading-[1.4em] font-medium text-sm'>{currency}.{(product?.price).toLocaleString()}</h6>
                      <h6 className='mx-auto max-xl:hidden text-center leading-[1.4em] text-gray-400 text-[13px]'>{new Date(product?.created_at).toDateString()}</h6>
                      <div className='text-[23px] text-red-500 cursor-pointer mx-auto'>
                        <span onClick={() => deleteProduct(product._id)} className=''><MdDeleteOutline /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center rounded-md w-full'>You don,t have any products</div>}
        </div>}
      </div>
      {/* blogs */}
      <div className='flex items-center gap-3 mb-4 mt-6'>
        <h6 className='font-semibold'>Latest Blogs</h6>
      </div>
      <div className='blog_list_title text-xs uppercase sm:py-3 py-2 px-3 font-semibold grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 bg-[#111]'>
        <label className=' l:px-6' style={{ fontFamily: "Montserrat" }}>Blog</label>
        <label className=' l:px-6 hidden sm:block' style={{ fontFamily: "Montserrat" }}>Description</label>
        <label className=' max-lg:hidden mx-auto' style={{ fontFamily: "Montserrat" }}>Date</label>
        <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
      </div>
      {blogLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
        {latestBlogs.length > 0 ?
          <div className='w-full'>
            <div className='relative w-full text-sm overflow-x-auto rounded-lg scrollbar-hide bg-black/30 backdrop-blur-xs'>
              <div className='w-full sm:text-sm text-xs'>
                <div>
                  {latestBlogs?.slice(length - 3).reverse().map((blog, index) => (
                    <div key={index} className='blog_list sm:text-sm text-[13px] border-b border-gray-600 px-3 py-2.5 grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 items-center'>
                      <div className='flex items-center sm:gap-4 gap-3'>
                        <img className='main_image h-8 w-14' src={blog.image.url} alt="" />
                        <h6 className='font-medium'>{blog.title}</h6>
                      </div>
                      <div className='hidden sm:block'>
                        <h6 className='line-clamp-3' dangerouslySetInnerHTML={{
                          __html: blog?.description
                            ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
                            ?.replace(/color:[^;"]+;?/gi, "")
                        }}></h6>
                      </div>
                      <h6 className='max-lg:hidden mx-auto text-gray-400 text-[13px]'>{new Date(blog.created_at).toDateString()}</h6>
                      <div className=' flex text-sm items-center sm:gap-2 gap-1.5 mx-auto'>
                        <span onClick={() => { navigate(`/admin/updateblog/${blog?._id}`) }} className='lg:text-lg text-[16px] hover:scale-105 transition-all cursor-pointer text-orange-500'>
                          <FaEdit />
                        </span>
                        <span onClick={() => deleteBlog(blog._id)} className='text-[22px] text-red-500 cursor-pointer'><MdDeleteOutline /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center rounded-md w-full'>You don,t have any blogs</div>}
      </div>}
      {/* Orders */}
      <div className='flex items-center gap-3 mb-4 mt-6'>
        <h6 className='font-semibold'>Latest Orders</h6>
      </div>
      <div className='flex flex-col bg-black/30 backdrop-blur-xs'>
        <div className='xl:grid hidden xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 gap-2 py-3 px-3 text-xs uppercase font-semibold bg-[#111]'>
          <label style={{ fontFamily: "Montserrat" }}>Order</label>
          <label className='max-sm:hidden' style={{ fontFamily: "Montserrat" }}>Delivery</label>
          <label className='' style={{ fontFamily: "Montserrat" }}>Amount</label>
          <label className='max-xl:hidden' style={{ fontFamily: "Montserrat" }}>Payment</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Status</label>
        </div>
        {orderLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
          {orders.length > 0 ?
            <div>
              <div className='w-full overflow-auto'>
                {orders?.map((order, index) => (
                  <div key={index} className="grid xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 items-center gap-4 py-4 px-3 border-b border-gray-600">
                    <div className="order_image_parent flex gap-2">
                      <img className="w-12 h-12 object-cover" src={order.images[0].url ? order.images[0].url : parcel_icon} alt="product_image" />
                      <div className="flex flex-col justify-center">
                        <h6 className="font-medium text-sm sm:text-base">
                          {order?.name} <span className={`text-[#FE6A13]`}>x{order?.quantity}</span>
                        </h6>
                        <div className='flex flex-col leading-none gap-1 text-[13.2px] mt-1'>
                          <h6 style={{ fontFamily: 'Outfit' }}>{order.size && "Size:"} {order.size && order.size}</h6>
                          <h6 style={{ fontFamily: 'Outfit' }}>{order.color && "Color:"} {order.color && order.color}</h6>
                          <h6 style={{ fontFamily: 'Outfit' }}>{order.footwear_size && "Size:"} {order.footwear_size && order.footwear_size}</h6>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm">
                      <h6 className='font-medium mb-1'>{JSON.parse(order.address).firstName} {JSON.parse(order.address).lastName}</h6>
                      <h6 className='text-xs'>{JSON.parse(order.address).address}, {JSON.parse(order.address).city}, {JSON.parse(order.address).postal_code}</h6>
                      <h6 className='text-xs'>{JSON.parse(order.address).email}</h6>
                      <h6 className='text-xs'>{JSON.parse(order.address).phone}</h6>
                    </div>

                    <h6 className="font-medium">{currency}. {(order?.total_amount).toLocaleString()}</h6>

                    <div className="flex flex-col text-xs font-medium">
                      <h6>Method: {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1).toLowerCase()}</h6>
                      <h6>Date: {new Date(order.created_at).toDateString()}</h6>
                      <h6>Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).toLowerCase()}</h6>
                    </div>
                    <select value={order.order_status?.trim()} onChange={(event) => updateOrderStatus( order._id,event)} className='p-2 font-medium text-xs border border-gray-600 focus:border-orange-500 w-fit rounded-sm'>
                      <option value="PLACED" className='bg-[#1A1A1A]'>Order Placed</option>
                      <option value="PACKING" className='bg-[#1A1A1A]'>Packing</option>
                      <option value="SHIPPED" className='bg-[#1A1A1A]'>Shipped</option>
                      <option value="OUT FOR DELIVERY" className='bg-[#1A1A1A]'>Out for delivery</option>
                      <option value="DELIVERED" className='bg-[#1A1A1A]'>Delivered</option>
                    </select>
                  </div>
                ))}
              </div>
            </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center rounded-md w-full'>You don,t have any orders</div>}
        </div>}
      </div>
    </div >
  )
}

export default Dashboard