import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'

const Checkout = () => {
    const [loading, setLoading] = useState(false)
    const { cartItems, backendUrl, userId, token, getCartItems, shippingFee, currency, discount, getTotalCartItems, fetchAdminOrders,navigate } = useContext(AppContext)

    const [payment, setPayment] = useState("ONLINE");
    const [deliveryInfo, setDeliveryInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        postal_code: "",
        address: ""
    })
    const onChangeHandler = (e) => {
        setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value })
    }
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (token) {
            try {
                if (!cartItems || cartItems.length === 0) {
                    return toast.error("You didn,t have any cart items")
                }
                setLoading(true)
                let response = await axios.post(`${backendUrl}/api/order/place-order`, {
                    user_id: userId,
                    items: cartItems,
                    total_amount: total,
                    payment_method: payment,
                    address: deliveryInfo,
                }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data) {
                    setLoading(false)
                    getCartItems()
                    getTotalCartItems()
                    if (payment === "COD") {
                        toast.success("Order placed successfully!")
                        navigate('/my-account')
                    } else {
                        window.location.href = response.data.url
                    }
                    fetchAdminOrders()
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.log(error)
            }
        } else {
            localStorage.removeItem('User')
            window.location.href = "/user/login";
            window.location.reload()
        }
    }

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const total = subtotal + shippingFee - discount;

    return (
        <div>
            {/* Hero Section */}
            <div className="relative lg:h-[430px] md:h-[380px] h-[300px] w-full">
                {/* Background Image */}
                <img
                    src={breadcrumb_bg}
                    alt="hero"
                    className="w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Content */}
                <div className="container mx-auto absolute inset-0 flex flex-col md:flex-row md:items-center md:justify-between justify-center px-4 text-white">
                    <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">Checkout</p>

                    <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
                        HOME &gt; CHECKOUT
                    </p>
                </div>
            </div>

            <div className="min-h-screen sm:py-24 py-20">

                <form onSubmit={onSubmitHandler} className="container mx-auto px-4 grid lg:grid-cols-3 gap-10">

                    {/* Billing Form */}
                    <div className="lg:col-span-2 bg-white p-8 border border-gray-400">

                        <h3 className="sm:text-3xl text-2xl font-bold mb-6 tracking-tight">
                            Billing Details
                        </h3>

                        <div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <input
                                    type="text"
                                    name='firstName'
                                    value={deliveryInfo.firstName}
                                    onChange={onChangeHandler}
                                    placeholder="First Name"
                                    className="border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />

                                <input
                                    type="text"
                                    name='lastName'
                                    value={deliveryInfo.lastName}
                                    onChange={onChangeHandler}
                                    placeholder="Last Name"
                                    className="border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />

                                <input
                                    type="email"
                                    name='email'
                                    value={deliveryInfo.email}
                                    onChange={onChangeHandler}
                                    placeholder="Email Address"
                                    className="border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />

                                <input
                                    type="number"
                                    name='phone'
                                    value={deliveryInfo.phone}
                                    onChange={onChangeHandler}
                                    placeholder="Phone Number"
                                    className="border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />

                                <input
                                    type="text"
                                    name='city'
                                    value={deliveryInfo.city}
                                    onChange={onChangeHandler}
                                    placeholder="City"
                                    className="border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />

                                <input
                                    type="text"
                                    name='postal_code'
                                    value={deliveryInfo.postal_code}
                                    onChange={onChangeHandler}
                                    placeholder="Postal Code"
                                    className="border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />

                                <input
                                    type="text"
                                    name='address'
                                    value={deliveryInfo.address}
                                    onChange={onChangeHandler}
                                    placeholder="Address"
                                    className="md:col-span-2 border rounded-lg sm:px-4 sm:py-3.5 px-3.5 py-3 focus:ring-2 focus:ring-orange-500 focus:border-none outline-none"
                                    required
                                />
                            </div>

                        </div>

                        {/* Payment Method */}
                        <div className="mt-8">

                            <h5 className="sm:text-2xl text-xl font-bold mb-4 tracking-tight">
                                Payment Method
                            </h5>

                            <div className="space-y-3 text-sm font-medium">

                                <label onChange={() => setPayment("COD")} className="flex items-center gap-3 border sm:px-4 sm:py-3.5 px-3.5 py-3 rounded-lg cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={payment === "COD"}
                                    />
                                    Cash on Delivery
                                </label>

                                <label onChange={() => setPayment("ONLINE")} className="flex items-center gap-3 border sm:px-4 sm:py-3.5 px-3.5 py-3 rounded-lg cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={payment === "ONLINE"}
                                    />
                                    Credit / Debit Card
                                </label>

                            </div>
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 border border-gray-400 h-fit">

                        <h5 className="sm:text-2xl text-xl font-bold mb-6 tracking-tight">
                            Order Summary
                        </h5>

                        <div className="space-y-4 text-[15px]">

                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-3">

                                    <img
                                        src={item.images[0].url}
                                        alt=""
                                        className="w-16 h-16 object-cover bg-gray-50 border border-gray-200 rounded"
                                    />

                                    <div className="flex-1">
                                        <h6 className="font-semibold leading-[1.3em] mb-0.5 line-clamp-2 tracking-tight">{item.name}</h6>
                                        <h6 className="text-[13px] text-gray-600 font-medium">
                                            Qty: {item.quantity}
                                        </h6>
                                    </div>

                                    <h6 className="font-semibold">
                                        {currency}.{(item.price * item.quantity).toFixed(2)}
                                    </h6>

                                </div>
                            ))}

                        </div>

                        <hr className="my-6 opacity-50" />

                        <div className="space-y-2 text-sm sm:text-[15px]">

                            <div className="text-gray-600 flex justify-between font-medium">
                                <span>Subtotal</span>
                                <span>{currency}. {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="text-gray-600 flex justify-between font-medium">
                                <span>Shipping</span>
                                <span>{currency}.{subtotal ? shippingFee.toFixed(2) : "0"}</span>
                            </div>
                            <div className="text-gray-600 flex justify-between font-medium">
                                <span>Discount</span>
                                <span className="text-red-700/90">-{currency}.{subtotal ? discount.toFixed(2) : "0"}</span>
                            </div>

                            <div className="flex justify-between font-bold sm:text-lg text-base">
                                <span>Total</span>
                                <span>{currency}. {subtotal > 0 ? total.toLocaleString() : '0'}</span>
                            </div>

                        </div>

                        <button type='submit' className="w-full cursor-pointer mt-6 bg-orange-600 hover:bg-[#1A1A1A] text-white py-3 font-medium transition sm:text-base text-sm">
                            {loading ? "Order placing..." : 'Place Order'}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    )
}

export default Checkout