import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import upload_area from '../../assets/upload_area.svg'
import { useContext } from 'react';
import Quill from 'quill';
import { LuPlus, LuUpload } from 'react-icons/lu';

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null)
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');

  const { backendUrl, isAdmin,fetchBlogs, fetchLatestBlogs} = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', quillRef.current.root.innerHTML);
      formData.append('image', image);

      const response = await axios.post(`${backendUrl}/api/blog/add`, formData, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      })
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchBlogs()
        await fetchLatestBlogs()
        setLoading(false);
        setImage(false);
        setTitle('');
        quillRef.current.innerHTML = '';
        setTimeout(() => {
          navigate('/admin/listblog')
          // window.location.reload()
        }, 1000)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      if (error.response.status === 500) {
        localStorage.removeItem('token');
        window.location.href = "/admin"
      }
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[85vh]'>
      <div className='bg-black/30 backdrop-blur-xs flex flex-col w-full h-fit max-w-[700px] p-6 md:p-10 shadow rounded-xl'>
        <label htmlFor="image">
          {!image ? <span className='sm:text-2xl text-xl border border-gray-300 bg-black/10 sm:w-20 w-18 sm:h-17 h-15 flex items-center justify-center cursor-pointer rounded-md'><LuUpload /></span> : <img src={URL.createObjectURL(image)} className='rounded cursor-pointer max-h-24 max-w-24' alt="" />}
          <input type="file" onChange={(e) => setImage(e.target.files[0])} hidden id='image' />
        </label>
        <label className="block sm:text-sm text-xs font-medium mt-4">
          Blog Title
        </label>
        <input type="text" placeholder='Type...' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full mt-2 p-2 min-h-10 border border-gray-300 outline-none rounded-md text-sm' required />
        <label className="block sm:text-sm text-xs font-medium mt-4 mb-2">
          Blog Description
        </label>
        <div ref={editorRef} placeholder='Type Here...' className='w-full relative border border-gray-300 min-h-[160px] max-h-[360px] overflow-y-auto outline-none'></div>
        <button type='submit' style={{fontFamily:"Poppins"}} className='mt-7 flex items-center gap-1 sm:text-sm text-xs px-8 w-fit py-[10px] bg-orange-600 text-white rounded-md cursor-pointer'><span className='text-white text-base'><LuPlus /></span>{loading ? 'Ading...' : 'Add Blog'}</button>
      </div>
    </form>
  )
}

export default AddBlog