import React from 'react'
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const BlogCard = React.lazy(() => import('../components/BlogCard'))
import loading_animation from '../../public/loading_animation.svg'

const Blogs = () => {
  const { blogs, blogLoading, latestBlogs } = useContext(AppContext);

  return (
    <div className='bg-white'>
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
          <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">Blogs</p>

          <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
            HOME &gt; BLOGS
          </p>
        </div>
      </div>

      <div className="container mx-auto sm:py-24 py-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT CONTENT */}
          {blogLoading ? <img src={loading_animation} alt='loader' className='mx-auto' /> : <div className="lg:col-span-2">
            {/* Blog Cards */}
            {blogs.length > 0 ? <div className="blogs grid grid-cols-2 gap-5">
              {blogs.map((blog, index) => (
                <BlogCard key={index} blog={blog} />
              ))}
            </div> : <div className='font-medium min-h-[100px] text-lg flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any related items</div>}
          </div>}

          {/* RIGHT SIDEBAR */}
          <div className="space-y-8">

            {/* Search */}
            <div className="bg-[#F6F6F7] p-6 rounded">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-3 outline-none bg-white"
                />
                <button className="bg-orange-500 text-white px-4">
                  Search
                </button>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-[#F6F6F7] p-6 rounded">
              <p className="text-2xl font-semibold mb-5">Recent Posts</p>

              <div className="space-y-4">
                {latestBlogs.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={JSON.parse(item?.image).url}
                      alt={item.title}
                      className='w-20 h-14 object-cover leading-none'
                    />
                    <div>
                      <p className="text-sm font-medium leading-tight line-clamp-1">
                        {item.title}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(item.created_at).toDateString()}
                      </span>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Categories */}
            <div className="bg-[#F6F6F7] p-6 rounded">
              <p className="text-2xl font-semibold mb-4">Categories</p>

              <ul className="space-y-3 text-gray-700">
                <li className="hover:text-orange-500 cursor-pointer">
                  → Lunch Specials
                </li>
                <li className="hover:text-orange-500 cursor-pointer">
                  → Seasonal Dishes
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Scroll to top button */}
        {/* <button className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded shadow-lg hover:bg-orange-600">
          ↑
        </button> */}
      </div>
    </div>
  )
}

export default Blogs