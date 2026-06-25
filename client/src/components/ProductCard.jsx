import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { PiHeartStraightBold } from "react-icons/pi";
import { FiHeart } from 'react-icons/fi';
import { Star } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { useInView } from 'react-intersection-observer';

const ProductCard = ({ product }) => {
    const { currency, navigate, toggleWishlist, isInWishlist, addToCart, qty } = useContext(AppContext);
    // const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
    return (
        <div
            className={`group relative bg-white text-black overflow-hidden border border-gray-400`}
        >
            {/* Image */}
            <figure onClick={() => { navigate(`/shop/${product?._id}`); scrollTo(0, 0) }} className='relative overflow-hidden sm:h-[200px] h-[165px]'>

                <img
                    src={`${product.images[0].url}`}
                    alt={product?.name}
                    className="w-full h-full object-cover transform group-hover:scale-115 transition duration-500"
                />
                {/* Hover Image */}
                {product?.images?.[1]?.url && <img
                    src={product?.images?.[1]?.url}
                    alt="hover"
                    className="sm:block hidden bg-gray-100 cursor-pointer absolute top-0 left-0 h-full w-full object-contain opacity-0 group-hover:opacity-100 transition duration-300"
                />}
            </figure>

            {/* Content */}
            <div className="sm:p-5 p-4">
                <p className='bg-[#FE6A13] text-white w-fit sm:px-4 px-3 py-1.5 rounded-tr-full rounded-br-full sm:text-sm text-xs absolute top-2 left-0'>{product.category}</p>
                <p onClick={() => toggleWishlist(product._id)} className='bg-[#FE6A13] text-white sm:w-9 sm:h-9 w-8 h-8 cursor-pointer rounded-full mb-1 font-medium absolute top-2 right-2 flex items-center justify-center sm:text-lg text-base'>{isInWishlist(product._id) ? <FaHeart /> : <FiHeart />}</p>
                {/* Rating */}
                <div className="rating flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                    ))}
                </div>
                <p onClick={() => { navigate(`/shop/${product?._id}`); scrollTo(0, 0) }} className="xl:text-lg text-base font-semibold leading-[1.3em] mt-2 sm:line-clamp-2 line-clamp-3">{product.name}</p>
                <p className="text-orange-500 font-semibold mt-1">
                    {currency}.{(product.price).toLocaleString()}
                </p>

                <p className="text-gray-500 sm:text-sm text-xs mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: product.description }}>
                </p>

                <button onClick={() => addToCart(product?._id, qty)} className="mt-4 cursor-pointer bg-[#FE6A13] text-white sm:px-6 px-5 py-2 sm:text-sm text-xs hover:bg-[#1A1A1A] transition duration-200 font-medium">
                    Add To Cart
                </button>
            </div>
        </div>
    )
}

export default ProductCard