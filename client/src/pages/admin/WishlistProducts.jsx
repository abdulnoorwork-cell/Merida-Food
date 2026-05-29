import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import loading_animation from '../../../public/loading_animation.svg'
import { FaHeart } from "react-icons/fa";
import toast from 'react-hot-toast';
import { MdDeleteOutline } from 'react-icons/md';

const WishlistProducts = () => {
    const [wishlistLoading,setWishlistLoading]=useState(false)
    const { backendUrl, isAdmin, currency, fetchProducts,wishlistProducts,fetchWishlistProducts } = useContext(AppContext);

    const deleteWishlistProduct = async (productId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/wishlist/remove-wishlist-product/${productId}`, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            });
            if (response.data.success) {
                toast.success(response.data.messege)
                await fetchWishlistProducts()
                await fetchProducts()
            }
        } catch (error) {
            toast.error(error.response.data.messege);
            console.log(error)
        }
    }

    useEffect(() => {
        fetchWishlistProducts()
    }, [])

    console.log(wishlist)

    return (
        <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
            <div className='flex flex-col w-full'>
                <p className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}>Wishlist</p>
                <div className='w-full shadow bg-black/30 backdrop-blur-xs'>
                    <div className='w-full sm:text-sm text-xs'>
                        <div className='admin_products_label grid lg:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] items-center gap-2 sm:py-3 py-2 px-3 text-xs uppercase font-semibold bg-[#111]'>
                            <label>Product</label>
                            <label className='mx-auto hidden sm:block' style={{ fontFamily: "Montserrat" }}>Category</label>
                            <label className='mx-auto hidden lg:block' style={{ fontFamily: "Montserrat" }}>Price</label>
                            <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Total Wishlist</label>
                            <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
                        </div>
                        {wishlistLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
                            {wishlistProducts.length > 0 ?
                                <div className='overflow-auto max-h-[75vh] scrollbar-hide relative sm:text-sm text-[13px]'>
                                    {wishlist?.reverse().map((w, i) => (
                                        <div key={i} className='product_list border-b border-gray-600 px-2 py-1.5 grid lg:grid-cols-[3fr_1fr_1fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] sm:gap-2 gap-1.5 items-center'>
                                            <div className='main_img flex items-center sm:gap-4 gap-3'>
                                                <img className='sm:h-14 h-10 w-14 object-contain' src={w.images[0].url} alt="" />
                                                <div className='flex flex-col'>
                                                    <h6 className='leading-[1.3em] font-medium text-base'>{w?.name}</h6>
                                                </div>
                                            </div>
                                            <h6 className='category mx-auto text-center leading-[1.4em] hidden sm:block'>{w?.category}</h6>
                                            <h6 className='category_2 mx-auto text-center leading-[1.4em] text-blue-600 hidden'>{w?.category}</h6>
                                            <h6 className='category mx-auto text-center font-medium leading-[1.4em] hidden lg:block'>{currency}.{w?.price}</h6>
                                            <h6 className='mx-auto text-center leading-[1.4em] font-medium flex items-center gap-1'><span className='text-red-500 text-[15px]'><FaHeart /></span> {w?.total_wishes < 10 ? "0" + w?.total_wishes : 1}</h6>
                                            <div className='text-[23px] text-red-500 cursor-pointer mx-auto'>
                                                <span onClick={() => deleteWishlistProduct(w._id)} className=''><MdDeleteOutline /></span>
                                            </div>
                                        </div>
                                    ))}
                                </div> :
                                <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center rounded-md w-full'>You don,t have any wishlist products</div>
                            }
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishlistProducts