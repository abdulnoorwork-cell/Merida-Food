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
import { IoMdClose } from 'react-icons/io';
import { TbLoader2 } from 'react-icons/tb';
import { LuSearch } from 'react-icons/lu';

const SingleBlog = () => {

    const [blog, setBlog] = useState([]);
    const { blog_id } = useParams();
    const [loading, setLoading] = useState(false)
    const { backendUrl, latestBlogs, latestBlogLoading, handleSearchBlogs, blogQuery, setBlogQuery, blogSuggestions, setBlogSuggestions, handleClearBlogSearch, blogSuggestionLoading, navigate } = useContext(AppContext)
    const fetchBog = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/blog/blog-detail/${blog_id}`, { withCredentials: true });
            if (response.data) {
                setBlog(response.data);
                setLoading(false)
            }
            setLoading(false)
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
                        HOME &gt; BLOGS &gt; {blog.title}
                    </p>
                </div>
            </div>

            <div className="container mx-auto py-16 px-4 min-h-[80vh]">
                {loading ? <img src={loading_animation} className='mx-auto' alt="loader" />
                     : <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* LEFT CONTENT */}
                        <div className="lg:col-span-2">

                            {/* Image */}
                            <img
                                src={blog.image?.url}
                                alt={blog.title}
                                className="w-full sm:h-[400px] h-[300px] object-cover rounded"
                            />

                            {/* Meta */}
                            <div className="flex flex-wrap gap-2 sm:text-sm text-xs mt-7 font-medium text-gray-500">
                                <span className='border-r border-gray-500 pr-2'>Created At</span>
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
                            <div className="relative bg-[#F6F6F7] p-6 rounded">
                                <div className="flex items-center w-full pl-4 h-[45px] outline-none bg-white">
                                    <input
                                        type="text"
                                        value={blogQuery} onChange={(e) => setBlogQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.keyCode === 13) {
                                                e.preventDefault();
                                                handleSearchBlogs();
                                                setBlogQuery('')
                                            }
                                            if (e.key === "Backspace") {
                                                e.preventDefault();
                                                setBlogQuery("")
                                                setBlogSuggestions([])
                                                handleClearBlogSearch()
                                            }
                                        }}
                                        placeholder="Search..."
                                        className="w-full outline-none bg-white"
                                    />
                                    {blogSuggestionLoading ? <span className='text-lg animate-spin mr-1'><TbLoader2 /></span> : <span onClick={(handleClearBlogSearch)} className={`text-lg cursor-pointer text-[#1A1A1A] mr-1 ${blogQuery !== "" ? 'block' : 'hidden'}`}><IoMdClose /></span>}
                                    <button onClick={() => { handleSearchBlogs() }} className="bg-orange-500 text-white px-4 h-full cursor-pointer text-xl">
                                        <LuSearch />
                                    </button>
                                    {blogQuery && blogSuggestions.length > 0 &&
                                        <div className="suggestions absolute top-full shadow left-0 bg-white w-full">
                                            <ul className='px-3 w-full overflow-y-auto max-h-[300px]'>
                                                {blogSuggestions?.map((v, i) => (
                                                    <li key={i} onClick={() => {
                                                        setBlogQuery("");  // select suggestion
                                                        navigate(`/blogs/${v._id}`);
                                                        scrollTo(0, 0)
                                                    }} className='cursor-pointer flex items-center gap-1 w-full border-b border-gray-300'>
                                                        <img src={JSON.parse(v.image).url} className='w-14 h-14 object-contain' alt="" />
                                                        <h6 className='text-[13px] line-clamp-2'>{v.title}</h6>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button onClick={() => { handleSearchBlogs(); setBlogQuery(''); setBlogSuggestions('') }} className='cursor-pointer text-white bg-orange-500 px-4 py-2 mx-auto my-2 text-xs rounded ml-2'>View All Result</button>
                                        </div>
                                    }
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div>
                                {latestBlogLoading ? <img src={loading_animation} className='mx-auto' alt="loader" /> :
                                    <div className='space-y-4'>{latestBlogs.map((item, index) => (
                                        <div key={index} onClick={() => { navigate(`/blogs/${item._id}`); scrollTo(0, 0) }} className="flex gap-3">
                                            <img
                                                src={item?.image?.url}
                                                alt={item.title}
                                                className='w-20 h-14 object-cover leading-none cursor-pointer'
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
                                    ))}</div>}
                            </div>
                        </div>

                    </div>}
            </div>
        </div>
    )
}

export default React.memo(SingleBlog)