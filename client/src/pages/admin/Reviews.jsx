import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios';
import loading_animation from '../../../public/loading_animation.svg'
import { TfiCommentAlt } from "react-icons/tfi";
import profile_image from '../../assets/profile_image.png'
import { AiFillStar } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa6";
import toast from 'react-hot-toast';

const Reviews = () => {
    const [model, setModel] = useState(false)
    const [singleReview, setSingleReview] = useState([]);
    const [reply, setReply] = useState('')
    const [replyLoading, setReplyLoading] = useState(false);
    const { backendUrl, isAdmin, currency, fetchAllReviews, loading, allReviews } = useContext(AppContext);

    const fetchSingleReview = async (review_id) => {
        try {
            let response = await axios.get(`${backendUrl}/api/review/get-single-review/${review_id}`, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })
            if (response.data) {
                setModel(true)
                setSingleReview(response.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleReply = async (review_id) => {
        try {
            setReplyLoading(true)
            let response = await axios.post(`${backendUrl}/api/review/reply/add`, { review_id, reply }, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })
            if (response.data.success) {
                toast.success(response.data.messege)
                setReply('')
                setModel(false)
                setReplyLoading(false);
                fetchAllReviews()
            }
            setReplyLoading(false)
        } catch (error) {
            console.log(error)
            setReplyLoading(false)
            toast.error(error.response.data.messege)
        }
    }

    return (
        <div className='flex w-full justify-center px-4 py-8 md:px-8 lg:py-10 h-full min-h-[95vh]'>
            <div className='flex flex-col w-full'>
                <p className='font-semibold sm:text-[22px] text-xl flex items-center gap-2 mb-4' style={{ fontFamily: 'Montserrat' }}>Reviews List</p>
                <div className='w-full bg-black/30 backdrop-blur-xs'>
                    <div className='w-full sm:text-sm text-xs'>
                        <div className='sm:grid hidden xl:grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_2fr_1fr] gap-2 sm:py-3 py-2 px-3 text-xs uppercase font-semibold bg-[#111]'>
                            <label style={{ fontFamily: "Montserrat" }}>Customer</label>
                            <label style={{ fontFamily: "Montserrat" }}>Review</label>
                            <label style={{ fontFamily: "Montserrat" }}>Product</label>
                            <label className='mx-auto xl:block hidden' style={{ fontFamily: "Montserrat" }}>Price</label>
                            <label className='mx-auto lg:block hidden' style={{ fontFamily: "Montserrat" }}>Date</label>
                            <label className='mx-auto' style={{ fontFamily: "Montserrat" }}>Action</label>
                        </div>
                        {loading ? <img src={loading_animation} alt="" className='mx-auto' /> : <div>
                            {allReviews.length > 0 ?
                                <div className='overflow-auto max-h-[75vh] scrollbar-hide relative sm:text-sm text-[13px]'>
                                    {allReviews?.reverse().map((review, index) => (
                                        <div key={index} className='border-b border-gray-600 sm:p-3 p-5 sm:grid flex flex-col text-center sm:text-start xl:grid-cols-[2fr_2fr_2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_2fr_2fr_1fr_1fr] sm:grid-cols-[2fr_2fr_2fr_1fr] gap-2 items-center'>
                                            <div className='flex flex-col 2xl:flex-row max-sm:items-center 2xl:items-center 2xl:gap-3 gap-2'>
                                                <img className='h-12 w-12 object-cover rounded-full' src={review.profile_image ? JSON.parse(review?.profile_image).url : profile_image} alt="profile_image" />
                                                <div className='flex flex-col'>
                                                    <h5 className='leading-[1.3em] font-medium text-base'>{review?.name}</h5>
                                                    <h6 className='text-sm text-gray-400'>{review?.email}</h6>
                                                </div>
                                            </div>
                                            {/* Reviews */}
                                            <div>
                                                <div className='flex items-center max-sm:justify-center gap-[1px] text-yellow-500 text-base'>
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <AiFillStar key={i} />
                                                    ))}
                                                </div>
                                                <h6 className='text-sm mt-0.5'>{review?.comment}</h6>
                                            </div>
                                            <div className='flex flex-col lg:flex-row lg:items-center sm:gap-2 gap-1.5'>
                                                <img src={review?.images?.[0]} className='sm:w-14 sm:h-14 w-20 h-20 max-sm:mx-auto object-cover' alt="" />
                                                <h5 className='font-medium leading-[1.2em] text-sm tracking-[-0.2px]'>{review.product_name}</h5>
                                            </div>
                                            <div className="mx-auto xl:block hidden">
                                                <h6 className='category mx-auto text-center leading-[1.4em] font-medium'>{currency}. {review?.price}</h6>
                                            </div>
                                            <div className="mx-auto lg:block hidden">
                                                <p className='mx-auto text-center leading-[1.4em] text-gray-400 text-sm'>{new Date(review?.created_at).toDateString()}</p>
                                            </div>
                                            <div className='flex items-center gap-2 mx-auto max-sm:mt-2'>
                                                <div onClick={() => fetchSingleReview(review._id)} className='bg-[#FE6A13] text-white rounded hover:bg-orange-600 transition duration-200 cursor-pointer flex items-center gap-1 py-1.5 px-3 text-xs font-medium'>
                                                    <span className='text-lg'><FaRegCommentDots /></span>
                                                    Reply
                                                </div>
                                                {/* <div className='bg-red-50 text-red-500 text-xl p-1 rounded-md cursor-pointer'>
                                                    <span onClick={() => deleteProduct(product._id)} className=''><MdDeleteOutline /></span>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </div> :
                                <div className='font-medium min-h-[100px] text-sm flex items-center justify-center text-center rounded-md w-full'>You don,t have any reviews</div>
                            }
                        </div>}
                    </div>
                </div>
            </div >
            
            {/* ================= ADMIN REPLY SECTION ================= */}
            {/* Modal */}
            <div className={`fixed top-1/2 left-1/2 -translate-1/2 inset-0 z-50 flex flex-col w-full max-w-lg rounded bg-black/30 backdrop-blur-xs h-fit ${model && singleReview ? "flex" : "hidden"}`}>

                {/* Header */}
                <div className="w-full flex justify-between items-center px-5 py-2 rounded-tl rounded-tr bg-orange-600">
                    <h2 className="text-base font-medium tracking-[-0.2px]">
                        Reply to Review
                    </h2>
                    <button
                        onClick={() => setModel(false)}
                        className="hover:text-red-500 text-lg cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="w-full p-5">

                    {/* Customer Info */}
                    <div className="flex gap-3 items-center mb-4">
                        <img
                            src={singleReview.profile_image ? JSON.parse(singleReview?.profile_image).url : profile_image}
                            alt="user"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h5 className="text-sm sm:text-base font-medium">
                                {singleReview.name}
                            </h5>
                            <p className="text-sm text-gray-400">
                                {singleReview.email}
                            </p>
                        </div>
                    </div>

                    {/* Review Box */}
                    <div className="p-3 rounded-lg text-sm sm:text-base text-gray-200 mb-4">
                        {singleReview.comment}
                    </div>

                    {/* Textarea */}
                    <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Write your reply..."
                        rows={4}
                        className="w-full border border-gray-500 focus:border-none rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                    ></textarea>
                </div>

                {/* Footer */}
                <div className="w-full flex justify-end gap-2 px-5 text-sm sm:text-base mb-6">
                    <button
                        onClick={() => setModel(false)}
                        className="cursor-pointer px-4 py-1.5 bg-[#111] border border-gray-800"
                    >
                        Cancel
                    </button>
                    <button onClick={() => handleReply(singleReview._id)} className="cursor-pointer px-4 py-1.5 bg-orange-600 text-white rounded">
                        {replyLoading ? "loading..." : "Send Reply"}
                    </button>
                </div>
            </div>
            {/* Overlay */}
            {model && <div
                className="fixed top-0 left-0 w-full h-screen inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={() => setModel(false)}
            ></div>}
        </div >
    )
}

export default Reviews