import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import upload_area from '../../assets/upload_area.svg'
import { useContext } from 'react';
import Quill from 'quill'
import { MdCloudUpload } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
import { LuPlus } from "react-icons/lu";

const AddProduct = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null)
  const editorRef2 = useRef(null);
  const quillRef2 = useRef(null)
  const navigate = useNavigate()
  const { backendUrl, isAdmin,fetchProducts } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState();
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState([])

  const file = useRef()

  const imagesHandler = async (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewImage(previewUrls)
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
        reader.onload = error => reject(error);
      }
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const base64Images = [];

      for (const img of images) {
        const base64 = await convertBase64(img);
        base64Images.push(base64);
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('about', quillRef.current.root.innerHTML);
      formData.append('description', quillRef2.current.root.innerHTML);
      base64Images.forEach((img) => {
        formData.append("images", img);
      })

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      })
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        setImages(upload_area);
        setName('');
        setCategory('');
        setPrice('');
        quillRef.current.root.innerHTML = ''
        quillRef2.current.root.innerHTML = ''
        await fetchProducts()
        setTimeout(() => {
          navigate('/admin/listproduct')
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

  // initiate Quill only once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' })
    }
    if (!quillRef2.current && editorRef2.current) {
      quillRef2.current = new Quill(editorRef2.current, { theme: 'snow' })
    }
  }, [])

  return (
    <form onSubmit={onSubmitHandler} className='flex items-center w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[85vh]'>
      <div className='w-full h-fit max-w-5xl bg-black/30 backdrop-blur-xs rounded-2xl shadow-lg sm:p-8 p-6'>
        {/* Header */}
        <div className="mb-6 lg:block hidden">
          <div>
            <h3 className="text-[26px] font-bold tracking-[-0.2px]">
              Add Product
            </h3>
            <h6 className=''>Fill in the details below to add new product</h6>
          </div>
        </div>
        <div className="flex flex-col sm:gap-5 gap-4">
          <div className='grid sm:grid-cols-2 sm:gap-5 gap-4 h-full'>
            {/* Upload */}
            <div className='h-full w-full'>
              {previewImage.length < 1 ? <div onClick={() => file.current.click()} className="flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center hover:border-[#FE6A13] transition cursor-pointer">
                <span className='text-3xl'><MdCloudUpload /></span>
                <h6 className=" leading-none sm:text-sm text-xs mb-1">Drag & drop images here</h6>
                <button className="sm:block hidden mt-2 px-4 py-2 bg-white text-[#FE6A13] rounded-lg sm:text-xs text-[11px] font-medium cursor-pointer border border-[#E2E8F0]">
                  Upload Images
                </button>
              </div> : <div className='grid grid-cols-3 items-center gap-2'>{previewImage.map((img, index) => (
                <figure><img key={index} src={img} className='rounded cursor-pointer w-full h-full max-h-[70px] object-cover' alt="" /></figure>
              ))}</div>}
              <input type="file" ref={file} multiple onChange={imagesHandler} hidden id='image' />
            </div>

            {/* Product Name */}
            {/* CATEGORY
            SUBCATEGORY */}
            <div className='flex flex-col gap-3.5 w-full'>
              <div>
                <label className="block sm:text-sm text-xs font-medium mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id='name' name='name' value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FE6A13] outline-none sm:text-[13.4px] text-xs"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block sm:text-sm text-xs font-medium mb-1">
                  Category
                </label>
                <select defaultValue={0} onChange={(e) => setCategory(e.target.value)} name="category" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FE6A13] outline-none sm:text-[13px] text-xs">
                  <option disabled value={0}>--Select Category--</option>
                  <option id='Breakfast' value="Breakfast">Breakfast</option>
                  <option id="Lunch" value="Lunch">Lunch</option>
                  <option id="Best Seller" value="Best Seller">Best Seller</option>
                  <option id="Fast Food" value="Fast Food">Fast Food</option>
                  <option id="Light & Digestive" value="Light & Digestive">Light & Digestive</option>
                </select>
              </div>

            </div>
          </div>

          <div className='grid sm:grid-cols-2 items-center sm:gap-5 gap-3 h-full -mt-0.5'>
            {/* About */}
            <div className="w-full">
              <label className="block sm:text-sm text-xs font-medium mb-1.5">
                About Product
              </label>
              <div>
                <div
                  ref={editorRef}
                  className="w-full relative border border-gray-300 sm:min-h-[160px] min-h-[120px] sm:max-h-[160px] max-h-[120px] overflow-y-auto"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block sm:text-sm text-xs font-medium mb-1.5">
                Description
              </label>
              <div>
                <div
                  ref={editorRef2}
                  className="w-full relative border border-gray-300 sm:min-h-[160px] min-h-[120px] sm:max-h-[160px] max-h-[120px] overflow-y-auto"
                  style={{ fontFamily: "Poppins" }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center sm:gap-5 gap-4 -mt-1">
            {/* Price */}
            <div className='w-fit'>
              <label className="block sm:text-sm text-xs font-medium mb-1">
                Price
              </label>
              <input
                type='number' placeholder='Rs.120' id='price' name='price' value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-[#FE6A13] outline-none sm:text-[13.4px] text-xs"
              />
            </div>
          </div>

        </div>
        
        <button style={{ fontFamily: 'Poppins' }} type='submit' className='mt-7 flex items-center gap-1 sm:text-sm text-xs px-6 w-fit py-[10px] bg-orange-600 text-white rounded cursor-pointer'><span className='text-white text-base'><LuPlus /></span>{loading ? 'Ading...' : 'Add Product'}</button>
      </div>
    </form>
  )
}

export default AddProduct