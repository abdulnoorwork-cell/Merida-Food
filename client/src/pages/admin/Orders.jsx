import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { AppContext } from '../../context/AppContext'
import parcel_icon from '../../assets/parcel_icon.svg'
import loading_animation from '../../../public/loading_animation.svg'

const Orders = () => {
    const { currency, backendUrl, isAdmin, fetchUserOrders, orderLoading, setOrderLoading, fetchAdminOrders, adminOrders } = useContext(AppContext);

    const updateOrderStatus = async (order_id,event) => {
        try {

            let response = await axios.put(`${backendUrl}/api/order/update-order/${order_id}`, { order_status: event.target.value }, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            });
            if (response.data.success) {
                console.log(response.data)
                await fetchAdminOrders()
                await fetchUserOrders()
                toast.success(response.data.messege);
            } else {
                toast.error(response.data.messege)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAdminOrders()
        fetchUserOrders()
    }, [])

    return (
        <div className="flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]">
            <div className='flex flex-col w-full'>
                <p className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}>Orders List</p>
                <div className='bg-black/30 backdrop-blur-xs'>
                    <div className='xl:grid hidden xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 hidden gap-2 py-3 px-3 text-xs uppercase font-semibold bg-[#111]'>
                        <label style={{ fontFamily: "Montserrat" }}>Order</label>
                        <label className='max-sm:hidden' style={{ fontFamily: "Montserrat" }}>Delivery</label>
                        <label className='' style={{ fontFamily: "Montserrat" }}>Amount</label>
                        <label className='max-xl:hidden' style={{ fontFamily: "Montserrat" }}>Payment</label>
                        <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Status</label>
                    </div>
                    {orderLoading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
                        {adminOrders.length > 0 ?
                            <div className='relative max-h-[75vh] overflow-x-autoscrollbar-hide'>
                                {adminOrders?.map((order, index) => (
                                    <div key={index} className="grid xl:grid-cols-[2fr_2fr_1fr_2fr_1fr] md:grid-cols-[2fr_2fr_1fr] sm:grid-cols-2 items-center gap-4 py-4 px-3 border-b border-gray-600">
                                        <div className="order_image_parent flex gap-2">
                                            <img className="w-12 h-12 object-cover" src={order.images[0].url ? order.images[0].url : parcel_icon} alt="product_image" />
                                            <div className="flex flex-col justify-center">
                                                <h6 className="font-medium text-sm sm:text-base">
                                                    {order?.name} <span className={`text-[#FE6A13]`}>x{order?.quantity}</span>
                                                </h6>
                                                <div className='flex flex-col leading-none gap-1 text-[13.2px] mt-1'>
                                                    <h6 style={{ fontFamily: 'Outfit' }}>{order.size && "Size:"} {order.size && order.size}</h6>
                                                    <h6 style={{ fontFamily: 'Outfit' }}>{order.color && "Color:"} {order.color && order.color}</h6>
                                                    <h6 style={{ fontFamily: 'Outfit' }}>{order.footwear_size && "Size:"} {order.footwear_size && order.footwear_size}</h6>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm">
                                            <h6 className='font-medium mb-1'>{JSON.parse(order.address).firstName} {JSON.parse(order.address).lastName}</h6>
                                            <h6 className='text-xs'>{JSON.parse(order.address).address}, {JSON.parse(order.address).city}, {JSON.parse(order.address).postal_code}</h6>
                                            <h6 className='text-xs'>{JSON.parse(order.address).email}</h6>
                                            <h6 className='text-xs'>{JSON.parse(order.address).phone}</h6>
                                        </div>

                                        <h6 className="font-medium">{currency}. {(order?.total_amount).toLocaleString()}</h6>

                                        <div className="flex flex-col text-xs font-medium">
                                            <h6>Method: {order.payment_method.charAt(0).toUpperCase() + order.payment_method.slice(1).toLowerCase()}</h6>
                                            <h6>Date: {new Date(order.created_at).toDateString()}</h6>
                                            <h6>Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1).toLowerCase()}</h6>
                                        </div>
                                        <select value={order.order_status?.trim()} onChange={(event) => updateOrderStatus( order._id,event)} className='p-2 font-medium text-xs border border-gray-600 focus:border-orange-500 w-fit rounded-sm'>
                                            <option value="PLACED" className='bg-[#1A1A1A]'>Order Placed</option>
                                            <option value="PACKING" className='bg-[#1A1A1A]'>Packing</option>
                                            <option value="SHIPPED" className='bg-[#1A1A1A]'>Shipped</option>
                                            <option value="OUT FOR DELIVERY" className='bg-[#1A1A1A]'>Out for delivery</option>
                                            <option value="DELIVERED" className='bg-[#1A1A1A]'>Delivered</option>
                                        </select>
                                    </div>
                                ))}
                            </div> : <div className='font-medium min-h-[100px] w-full text-sm flex items-center justify-center text-center rounded-md'>You don,t have any customer orders</div>}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Orders