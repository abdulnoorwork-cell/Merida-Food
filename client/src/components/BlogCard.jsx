import React from 'react'
import { useContext,useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useInView } from "react-intersection-observer";

const BlogCard = ({blog}) => {
    const {navigate}=useContext(AppContext)
    const {ref,inView}=useInView({threshold:0.2,triggerOnce:true})
    return (
        <div
            className={`bg-[#F6F6F7] overflow-hidden group`}
        >
            {/* Image */}
            <div onClick={()=>{navigate(`/blogs/${blog._id}`);scrollTo(0,0)}} className="overflow-hidden">
                <img
                    src={blog.image?.url}
                    alt={blog.title}
                    className="w-full 2xl:h-[240px] sm:h-[220px] h-[160px] object-cover transform group-hover:scale-115 transition duration-500"
                />
            </div>

            {/* Content */}
            <div className="xl:p-6 sm:p-5 p-4 pb-5">
                {/* Meta */}
                <div className="created_at flex items-center xl:text-sm text-xs text-gray-500 gap-2 mb-3">
                    <span>{new Date(blog.created_at).toDateString()}</span>
                    <div className="bg-orange-500 w-1.5 h-1.5 rounded-full"></div>
                    <span>Admin</span>
                </div>

                {/* Title */}
                <p className="xl:text-xl sm:text-lg text-base font-medium sm:mb-5 mb-4 leading-snug line-clamp-3 sm:line-clamp-2">
                    {blog.title}
                </p>

                {/* Button */}
                <button onClick={()=>{navigate(`/blogs/${blog._id}`);scrollTo(0,0)}} className="cursor-pointer bg-orange-500 text-white text-xs 2xl:text-sm font-medium uppercase sm:px-5 px-4 sm:py-2.5 py-2 flex items-center gap-2 hover:bg-[#1A1A1A] transition-all duration-300">
                    Read Details
                    <span className="sm:block hidden">→</span>
                </button>
            </div>
        </div>
    )
}

export default BlogCard