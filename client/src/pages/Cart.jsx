import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import cross_icon from '../assets/cross_icon.svg'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import product_bg from '../assets/product_bg.webp'
import { HiMiniMinusSmall } from "react-icons/hi2";
import { FiPlus } from "react-icons/fi";
import { MdDeleteOutline } from 'react-icons/md'

const Cart = () => {
    const { currency, shippingFee, navigate, cartItems, backendUrl, userId, token, getCartItems, discount, getTotalCartItems } = useContext(AppContext);

    const updateQuantity = async (cart_id, quantity) => {
        if (!token) {
            toast.error("Please login first")
        }
        if (token) {
            try {
                let response = await axios.put(`${backendUrl}/api/cart/update-quantity/${userId}`, { cart_id, quantity }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data.success) {
                    toast.success(response.data.message)
                    getCartItems()
                    getTotalCartItems()
                }
            } catch (error) {
                console.log(error)
                if (error.response.status === 500) {
                    localStorage.removeItem('User')
                    window.location.href = "/user/login"
                }
                toast.error(error.response.data.message)
            }
        }
    }
    const removeFomCart = async (cart_id) => {
        if (!token) {
            toast.error("Please login first")
        }
        if (token) {
            try {
                let response = await axios.post(`${backendUrl}/api/cart/removefromcart/${userId}`, { cart_id }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data.success) {
                    console.log(response.data)
                    getCartItems()
                    getTotalCartItems()
                    toast.success(response.data.message)
                }
            } catch (error) {
                console.log(error)
                if (error.response.status === 500) {
                    localStorage.removeItem('User')
                    window.location.href = "/user/login"
                }
                toast.error(error.response.data.message)
            }
        }
    }

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const total = subtotal + shippingFee - discount;

    return (
        <div>

            <div className="bg-[#111] text-white bg-cover bg-no-repeat bg-center py-28 min-h-screen" style={{ backgroundImage: `url(${product_bg})` }}>
                <div className="container mx-auto px-4">
                    <p className="sm:text-4xl text-3xl font-bold mb-7 tracking-tight">Your Cart</p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 bg-black/30 backdrop-blur-xs p-6 h-fit">
                            {cartItems.length > 0 ? cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="sm:grid sm:grid-cols-[3fr_1fr_1fr_1fr] flex flex-col gap-4 sm:items-center border-b border-gray-700 py-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            onClick={() => { navigate(`/shop/${item._id}`); scrollTo(0, 0) }}
                                            src={item.images[0].url}
                                            alt={item.name}
                                            className="w-18 h-18 object-cover cursor-pointer"
                                        />
                                        <div>
                                            <p onClick={() => { navigate(`/shop/${item._id}`); scrollTo(0, 0) }} className="text-lg font-medium leading-tight">{item.name}</p>
                                            <p className="text-gray-400">{currency}.{item.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { updateQuantity(item.cart_id, item.quantity - 1) }} className="md:w-9 md:h-9 w-8 h-8 flex items-center justify-center bg-[#111] rounded cursor-pointer"><HiMiniMinusSmall /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => { updateQuantity(item.cart_id, item.quantity + 1) }} className="md:w-9 md:h-9 w-8 h-8 flex items-center justify-center bg-[#111] rounded cursor-pointer"><FiPlus /></button>
                                    </div>

                                    <div className="font-semibold flex justify-end">
                                        {currency}. {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <span onClick={() => removeFomCart(item.cart_id)} className='text-2xl cursor-pointer text-red-500 flex justify-end'>
                                        <MdDeleteOutline />
                                    </span>
                                </div>
                            )) : <div className="lg:col-span-2 p-6">
                                <h6 className="text-2xl font-semibold mb-3">Cart is Empty</h6>
                                <h6>You don,t have any item in cart.</h6>
                            </div>}

                            {/* <button className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 font-semibold">
                                Update Cart
                            </button> */}
                        </div>

                        {/* Summary */}
                        <div className="bg-black/30 backdrop-blur-xs p-6 shadow-lg h-fit">
                            <p className="sm:text-[28px] text-2xl font-bold mb-4">Cart Summary</p>

                            <div className="flex justify-between mb-2 sm:text-base text-sm">
                                <span>Subtotal</span>
                                <span>{currency}.{subtotal.toFixed(2).toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between mb-2 sm:text-base text-sm">
                                <span>Shipping</span>
                                <span>{currency}.{subtotal ? shippingFee.toFixed(2).toLocaleString() : '00'}</span>
                            </div>

                            <div className="flex justify-between mb-2 sm:text-base text-sm">
                                <span>Discount</span>
                                <span className="text-red-400/90">-{currency}.{subtotal ? discount.toFixed(2) : "0"}</span>
                            </div>

                            <div className="flex justify-between sm:text-xl text-lg font-semibold mt-4 border-t border-gray-700 pt-4">
                                <span>Total</span>
                                <span>{currency}.{subtotal ? total.toFixed(2).toLocaleString() : '00'}</span>
                            </div>

                            {/* <input
                                type="text"
                                placeholder="Enter coupon code"
                                className="w-full mt-6 p-3 rounded-lg bg-[#111] border border-gray-700"
                            />

                            <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 py-3 font-semibold">
                                Apply Coupon
                            </button> */}

                            {token ? <button onClick={() => { navigate('/checkout'); scrollTo(0, 0) }} className="w-full mt-6 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition text-sm sm:text-base">
                                Proceed to Checkout
                            </button> : <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className="w-full mt-6 bg-orange-600 cursor-pointer hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition text-sm sm:text-base">
                                Proceed to Checkout
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart