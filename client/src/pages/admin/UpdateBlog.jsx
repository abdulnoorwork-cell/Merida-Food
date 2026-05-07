import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import upload_area from '../../assets/upload_area.svg'
import { useContext } from 'react';
import Quill from 'quill';

const UpdateBlog = () => {
  const [blog, setBlog] = useState([]);
  const { blogId } = useParams();
  const editorRef = useRef(null);
  const quillRef = useRef(null)
  const navigate = useNavigate()

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');

  const { backendUrl, isAdmin,fetchBlogs } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const fetchBog = async () => {
    try {
      let response = await axios.get(`${backendUrl}/api/blog/blog-detail/${blogId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data) {
        console.log(response.data)
        setBlog(response.data)
        setTitle(response.data.title);
        quillRef.current.root.innerHTML = response.data.description
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchBog();
  }, [])

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', quillRef.current.root.innerHTML);
      formData.append('image', image || '');

      const response = await axios.put(`${backendUrl}/api/blog/update/${blogId}`, formData, {
        headers: {
          Authorization: `${isAdmin}`
        }
      })
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        await fetchBlogs()
        setTimeout(() => {
          navigate('/admin/listblog')
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
    <form onSubmit={onSubmitHandler} className='flex items-center w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[85vh]'>
      <div className='bg-black/30 backdrop-blur-xs flex flex-col w-full h-fit max-w-[700px] p-6 md:p-10 shadow rounded'>
        <label htmlFor="image">
          <img src={!image ? blog.image && blog.image.url : URL.createObjectURL(image)} className='rounded cursor-pointer max-h-24 max-w-24' alt="" />
          <input type="file" onChange={(e) => setImage(e.target.files[0])} hidden id='image' />
        </label>
        <h6 className='mt-4'>Blog title</h6>
        <input type="text" placeholder='Type...' value={title} onChange={(e) => setTitle(e.target.value)} className='w-full mt-2 p-2 min-h-10 placeholder:font-light border border-gray-300 outline-none rounded text-sm' required />
        <h6 className='mt-4 mb-2'>Blog Description</h6>
        <div ref={editorRef} className='w-full relative border border-gray-300 min-h-[160px] max-h-[360px] overflow-y-auto'></div>
        <button type='submit' className='mt-7 flex items-center gap-1 sm:text-sm text-xs px-8 w-fit py-[10px] bg-orange-600 text-white rounded-md cursor-pointer'>{loading ? 'Updating...' : 'Save Changes'}</button>
      </div>
    </form>
  )
}

export default UpdateBlog