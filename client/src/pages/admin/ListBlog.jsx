import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import cross_icon from '../../assets/cross_icon.svg'
import { useContext } from 'react';
import { FaEdit } from "react-icons/fa";
import loading_animation from '../../../public/loading_animation.svg'
import { MdDeleteOutline } from 'react-icons/md'

const ListBlog = () => {
  const { backendUrl, navigate, isAdmin, blogs, fetchBlogs, blogLoading } = useContext(AppContext);

  const deleteBlog = async (blogId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/blog/delete/${blogId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.messege)
        await fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response.data.messege);
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
      <div className='flex flex-col w-full'>
        <p className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}>Blog List</p>
        <div className='relative max-h-[75vh] overflow-x-auto scrollbar-hide bg-black/30 backdrop-blur-xs'>
          <div className='w-full sm:text-sm text-xs'>
            <div className='blog_list_title text-xs uppercase sm:py-3 py-2 px-3 font-semibold grid lg:grid-cols-[2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_1fr] grid-cols-[4fr_1fr] gap-2 bg-[#111]'>
              <label className=' l:px-6' style={{ fontFamily: "Montserrat" }}>Blog</label>
              <label className=' l:px-6 hidden sm:block' style={{ fontFamily: "Montserrat" }}>Description</label>
              <label className=' max-lg:hidden mx-auto' style={{ fontFamily: "Montserrat" }}>Date</label>
              <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
            </div>
            {blogLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
              {blogs.length > 0 ?
                <div>
                  {blogs?.reverse().map((blog, index) => (
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
                </div> : <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-black/30 backdrop-blur-xs rounded-md w-full'>You don,t have any blogs</div>}
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListBlog