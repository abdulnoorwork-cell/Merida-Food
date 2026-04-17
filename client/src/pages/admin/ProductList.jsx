import React, { useEffect } from 'react'
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import cross_icon from '../../assets/cross_icon.svg'
import { useContext } from 'react';
import loading_animation from '../../../public/loading_animation.svg'
import { BsCartCheck } from 'react-icons/bs';
import { MdDeleteOutline } from 'react-icons/md';

const ProductList = () => {
  const { backendUrl, currency, isAdmin, products, fetchProducts, loading } = useContext(AppContext);

  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/delete/${productId}`, {
        headers: {
          Authorization: `${isAdmin}`
        },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success(response.data.messege)
        await fetchProducts();
      }
    } catch (error) {
      toast.error(error.response.data.messege);
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  console.log(products)

  return (
    <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
      <div className='flex flex-col w-full'>
        <p className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}>Product List</p>
        <div className='admin_products_label grid xl:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] gap-2 sm:py-3 py-2 px-3 text-xs uppercase font-semibold bg-[#111]'>
          <label style={{ fontFamily: "Montserrat" }}>Product</label>
          <label className='mx-auto max-sm:hidden' style={{ fontFamily: "Montserrat" }}>Category</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Price</label>
          <label className='mx-auto max-xl:hidden' style={{ fontFamily: "Montserrat" }}>Date</label>
          <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
        </div>
        <div className='w-full bg-black/30 backdrop-blur-xs'>
          <div className='w-full sm:text-sm text-xs'>
            {loading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
              {products.length > 0 ?
                <div className='overflow-auto max-h-[75vh] scrollbar-hide relative sm:text-sm text-[13px]'>
                  {products?.reverse().map((product, index) => (
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
                </div> :
                <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any products</div>
              }
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList