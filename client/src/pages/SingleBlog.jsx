import React from 'react'
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useEffect } from 'react';
const BlogCard = React.lazy(() => import('../components/BlogCard'))
import loading_animation from '../../public/loading_animation.svg'

const SingleBlog = () => {

    const [blog, setBlog] = useState([]);
    const { blog_id } = useParams();
    const { backendUrl, latestBlogs } = useContext(AppContext)
    const fetchBog = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/blog/blog-detail/${blog_id}`, { withCredentials: true });
            if (response.data) {
                setBlog(response.data[0]);
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchBog();
    }, [blog_id])

    const cleanHTML = blog?.description
        ?.replace(/style="[^"]*color:[^";]+;?[^"]*"/gi, "")
        ?.replace(/color:[^;"]+;?/gi, "");

    console.log(latestBlogs)

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
                    <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">Blog Details</p>

                    <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
                        HOME &gt; BLOGS &gt; Most Leading the Way in Eco-Friendly and Zero-Waste Practices
                    </p>
                </div>
            </div>

            <div className="container mx-auto 2xl:py-24 sm:py-20 py-16 px-4">
                {blog ?
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2">

                            {/* Image */}
                            <img
                                src={blog.image && JSON.parse(blog.image).url}
                                alt={blog.title}
                                className="w-full sm:h-[400px] h-[300px] object-cover rounded"
                            />

                            {/* Meta */}
                            <div className="flex flex-wrap gap-2 sm:text-sm text-xs mt-7 font-medium text-gray-500">
                                <span className='border-r border-gray-500 pr-2'>Created At</span>
                                <span className='border-r border-gray-500 pr-2'>Admin</span>
                                <span>{new Date(blog.created_at).toDateString()}</span>
                            </div>

                            {/* Title */}
                            <p className="xl:text-4xl sm:text-3xl text-[28px] font-semibold mt-3 leading-[1.1em]">
                                {blog.title}
                            </p>

                            {/* Content */}
                            <p className="text-gray-500 mt-4 leading-relaxed sm:text-base text-sm" dangerouslySetInnerHTML={{ __html: blog.description }}>
                            </p>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="space-y-8">

                            {/* Search */}
                            <div className="bg-[#F6F6F7] p-6 rounded">
                                <div className="flex text-sm">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-full px-4 py-3 outline-none bg-white"
                                    />
                                    <button className="bg-orange-500 text-white px-4 font-medium">
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
                        </div>

                    </div> : <img src={loading_animation} alt='loader' className='mx-auto' />}
            </div>
        </div>
    )
}

export default React.memo(SingleBlog)