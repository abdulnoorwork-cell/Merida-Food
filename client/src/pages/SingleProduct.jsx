import React, { useEffect, useRef, useState } from 'react'
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
const ProductCard = React.lazy(() => import('../components/ProductCard'))
import loading_animation from '../../public/loading_animation.svg'
import toast from 'react-hot-toast'
import { FiHeart } from 'react-icons/fi'
import { IoIosPaperPlane } from "react-icons/io";
import { Star } from "lucide-react";
import { LuUpload } from "react-icons/lu";
import { MdOutlineReviews } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import admin_profile from '../assets/admin_profile.png'

const SingleProduct = () => {
    const file = useRef()
    const { product_id } = useParams()
    const [product, setProduct] = useState([])
    const [relatedtems, setRelatedItems] = useState([])
    const [getRating, setGetRating] = useState([])
    const [relatedItemsLoading, setRelatedItemsLoading] = useState(false)
    const [images, setImages] = useState([])
    const [selected, setSelected] = useState();
    const [activeTab, setActiveTab] = useState("description");
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [preview, setPreview] = useState([]);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const { products, currency, backendUrl, token, userId, getCartItems, getTotalCartItems, navigate, toggleWishlist, isInWishlist, addToCart, qty, setQty, fetchAllReviews } = useContext(AppContext);
    const fetchProduct = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/product/product-detail/${product_id}`, { withCredentials: true });
            if (response.data) {
                setProduct(response.data)
                setImages(response.data.images)
                setSelected(response.data.images[0].url)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchRelatedItems = async () => {
        try {
            setRelatedItemsLoading(true)
            let response = await axios.get(`${backendUrl}/api/product/latest-category-products/${product.category}`, { withCredentials: true });
            if (response.data) {
                setRelatedItemsLoading(false)
                setRelatedItems(response.data)
            }
            setRelatedItemsLoading(false)
        } catch (error) {
            setRelatedItemsLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [product_id])

    useEffect(() => {
        if (product?.category) {
            fetchRelatedItems();
        }
    }, [product]);

    const fetchRating = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/review/get-product-rating/${product_id}`, { withCredentials: true })
            if (response.data) {
                setGetRating(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        })
    }

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const filtered = files.filter(file => file.size < 2 * 1024 * 1024)// 2MB
        if (filtered.length !== files.length) {
            toast.error("Some images are too large (max 2MB)");
        }
        const base64Images = await Promise.all(
            files.map((file) => convertToBase64(file))
        )
        setImages(base64Images);
        //previewImage
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setPreview(previewUrls)
    }

    const fetchReviews = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/review/get-reviews/${product_id}`, { withCredentials: true });
            if (response.data) {
                setReviews(response.data);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const submitReview = async () => {
        if (!rating || !comment) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            setLoading(true)
            let response = await axios.post(`${backendUrl}/api/review/add`, { product_id, user_id: userId, rating, comment, images }, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            })
            if (response.data.success) {
                setLoading(false)
                toast.success(response.data.message)
                setRating(0);
                setComment("");
                setImages([]);
                setPreview([])
                fetchReviews()
                fetchAllReviews()
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        fetchReviews()
        fetchRating()
    }, [product_id])

    return (
        <div className='bg-white'>
            {/* Hero Section */}
            <div className="relative 2xl:h-[430px] xl:h-[380px] lg:h-[360px] md:h-[340px] sm:h-[320px] h-[300px] w-full">
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
                    <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">Shop</p>

                    <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold uppercase">
                        HOME &gt; SHOP &gt; {product.name}
                    </p>
                </div>
            </div>

            <div className="container mx-auto py-16 px-4">
                {product ?
                    <>
                        <div className="grid lg:grid-cols-2 md:gap-12 sm:gap-12 gap-10 items-start">

                            {/* LEFT - IMAGE GALLERY */}
                            <div className='overflow-hidden'>
                                {/* Main Image */}
                                <img
                                    src={selected}
                                    alt="product"
                                    className="w-full h-[500px] object-cover rounded"
                                />

                                {/* Thumbnails */}
                                <div className="flex sm:gap-3 gap-2 mt-4">
                                    {images.map((img, index) => (
                                        <figure key={index} className='max-w-24 max-h-24'>
                                            <img
                                                src={img.url}
                                                onClick={() => setSelected(img.url)}
                                                className={`w-full h-full object-cover rounded cursor-pointer border-2 ${selected === img.url
                                                    ? "border-orange-500"
                                                    : "border-transparent"
                                                    }`}
                                            />
                                        </figure>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT - PRODUCT INFO */}
                            <div>
                                <p className="sm:text-4xl text-3xl font-bold mb-2">
                                    {product.name}
                                </p>

                                {/* Rating */}
                                <div className='flex items-center gap-0.5 my-1.5'>
                                    <div className='flex items-center gap-0.5'>
                                        {[...Array(5)].map((_, i) => (
                                            <AiFillStar
                                                size={17}
                                                key={i}
                                                className={
                                                    i < Math.round(getRating.average_rating || 0)
                                                        ? "text-orange-400 fill-orange-400"
                                                        : "text-gray-300 fill-gray-300"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-gray-600 text-sm sm:text-base">({getRating.average_rating ? getRating.average_rating.slice(0,3) : "0 Reviews"})</span>
                                </div>

                                {/* Price */}
                                <h6 className="text-2xl font-semibold mb-3 tracking-[-0.2px]">{currency}.{product.price ? (product.price).toLocaleString() : product.price}</h6>

                                {/* Divider */}
                                <div className="border-t border-gray-200 2xl:mb-4 mb-3"></div>

                                {/* Description */}
                                <p className="text-gray-500 leading-relaxed 2xl:mb-6 mb-4 sm:text-base text-sm" dangerouslySetInnerHTML={{ __html: product.about }}>
                                </p>
                                {/* Divider */}
                                <div className="border-t border-gray-200 mb-6"></div>

                                {/* Wishlist */}
                                <div className='flex items-center gap-1 mb-4 text-gray-700'>
                                    <button onClick={() => toggleWishlist(product._id)} className='text-base w-fit'>
                                        {isInWishlist(product._id) ? <span className='cursor-pointer'>❤️</span> : <span className='cursor-pointer text-lg'><FiHeart /></span>}
                                    </button>
                                    <h6>Add To Wishlist</h6>
                                </div>

                                {/* Quantity + Button */}
                                <div className="flex items-center gap-4 mb-5">
                                    <input
                                        type="number"
                                        value={qty < 1 ? 1 : qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        className="w-16 border border-gray-300 px-3 py-2.5 outline-none"
                                    />

                                    <button onClick={() => addToCart(product._id, qty)} className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-2.5 font-medium transition duration-300 cursor-pointer">
                                        Add to cart
                                    </button>
                                </div>

                                {/* Meta Info */}
                                <div className="text-base text-gray-500 space-y-2">
                                    <p>
                                        <span className="font-medium text-gray-700">SKU:</span> 50
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-700">
                                            Category:
                                        </span>{" "}
                                        {product.category}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-700">Tag:</span>{" "}
                                        Family
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Desription and Reviews */}
                        <div className="border-b border-gray-300 flex gap-8 mt-16">
                            <button
                                onClick={() => setActiveTab("description")}
                                className={`pb-3 text-sm font-medium uppercase tracking-wide cursor-pointer ${activeTab === "description"
                                    ? "border-b-2 border-orange-500 text-black"
                                    : "text-gray-500"
                                    }`}
                            >
                                Description
                            </button>

                            <button
                                onClick={() => setActiveTab("reviews")}
                                className={`pb-3 text-sm font-medium uppercase tracking-wide cursor-pointer ${activeTab === "reviews"
                                    ? "border-b-2 border-orange-500 text-black"
                                    : "text-gray-500"
                                    }`}
                            >
                                Reviews ({reviews.length})
                            </button>
                        </div>

                        {/* Content */}
                        <div className="mt-8">
                            {activeTab === "description" && (
                                <div>
                                    <p className="sm:text-3xl text-2xl font-medium mb-4">Description</p>

                                    <p className="text-gray-500 leading-relaxed mb-4 sm:text-base text-sm" dangerouslySetInnerHTML={{ __html: product.description }}>
                                    </p>
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <div>
                                    <div className='pt-2 flex flex-col lg:flex-row gap-8'>
                                        <div className='w-full'>
                                            {/* Header */}
                                            <div className="flex flex-col sm:flex-row items-center sm:gap-3 gap-2 sm:mb-4 mb-6">
                                                <p className="sm:text-3xl text-2xl font-semibold leading-none">
                                                    Submit Your Review
                                                </p>

                                                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                                                    <span className='bg-green-600 text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-center'>✔</span> Verified Purchase
                                                </span>
                                            </div>

                                            {/* Rating */}
                                            <div className="mb-4">
                                                <h6 className="sm:text-lg text-base mb-2 font-medium">Your Rating</h6>

                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={22}
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHover(star)}
                                                            onMouseLeave={() => setHover(0)}
                                                            className={`cursor-pointer transition ${(hover || rating) >= star
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-gray-400"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Images */}
                                            <div>
                                                <h6 className="sm:text-lg text-base mb-0.5 font-medium">Add Photos (Optional)</h6>
                                                <p className='text-gray-500'>Help other shoppers by adding photos of the product</p>
                                                {preview.length === 0 ? <div onClick={() => file.current.click()} className='bg-gray-50 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center font-medium py-6 rounded-lg mt-3 cursor-pointer gap-1.5'>
                                                    <span className='text-[#FE6A13] text-2xl'><LuUpload /></span>
                                                    <h6 className='text-gray-600 font-semibold sm:text-base text-sm leading-none'>Upload Images</h6>
                                                    <h6 className='sm:text-[13px] text-xs text-gray-500/80'>PNG,JPG,JPEG,WEBP up to 5MB</h6>
                                                </div> : <div className="flex gap-2 mt-3">
                                                    {preview.map((img, index) => (
                                                        <img key={index} src={img} alt='preview image' className='w-20 object-contain' />
                                                    ))}
                                                </div>}
                                                <input type="file" multiple onChange={handleImageChange} ref={file} hidden />
                                            </div>
                                        </div>
                                        <div className='w-full h-full'>
                                            {/* Comment */}
                                            <div className="mb-4">
                                                <h6 className="sm:text-lg text-base mb-2 font-medium">Your Review</h6>

                                                <textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Share your experience..."
                                                    className="w-full h-[180px] border border-[#E2E8F0] bg-gray-50 rounded-lg p-3 focus:outline-[#FE6A13]"
                                                    rows={4}
                                                />
                                            </div>

                                            {/* Buttons */}
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setRating(0);
                                                        setComment("");
                                                    }}
                                                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer sm:text-base text-sm leading-none"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={submitReview}
                                                    disabled={loading}
                                                    className="cursor-pointer flex items-center gap-1 px-6 py-3 bg-[#FE6A13] hover:bg-orange-600 text-white rounded-lg sm:text-base text-sm leading-none"
                                                >
                                                    {loading ? "Submitting..." : "Submit Review"}
                                                    <span className='sm:block hidden'><IoIosPaperPlane /></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white mt-10'>
                                        <p className='sm:text-3xl text-2xl font-medium mb-5 w-full'>All Reviews({reviews.length})</p>
                                        <div className='flex flex-col gap-5 w-full'>
                                            {reviews.length !== 0 ? reviews.map((v, i) => (
                                                <div key={i} className='px-5 py-6 border border-gray-400'>
                                                    <div className='flex sm:flex-row flex-col sm:items-center gap-2'>
                                                        <figure>
                                                            <img src={JSON.parse(v.profile_image).url} alt="profile_image" className='w-12 h-12 rounded-full' />
                                                        </figure>
                                                        <div>
                                                            {/* name */}
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                                                <h4 className='sm:text-base text-sm font-semibold leading-none'>{v.name}</h4>
                                                                <span className="bg-green-100 text-green-600 text-xs px-3 py-0.5 rounded-full w-fit">Verified Purchase
                                                                </span>
                                                            </div>
                                                            {/* rating */}
                                                            <div className='flex items-center gap-1'>
                                                                <div className='flex items-center'>
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <AiFillStar key={i}
                                                                            size={16}
                                                                            className={`cursor-pointer ${i < v.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 fill-gray-300"}}`} />
                                                                    ))}
                                                                </div>
                                                                -
                                                                <h6 className='text-xs text-gray-500/80 font-medium'>{new Date(v.created_at).toDateString()}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className='my-3 text-gray-700 text-sm sm:text-base'>{v.comment}</h6>
                                                    <figure className='flex items-center gap-3'>
                                                        {v.images && v.images.map((img, i) => {
                                                            return <img src={img} key={i} alt="" className='rounded-md bg-gray-50 border border-[#E2E8F0] max-w-[100px]' />
                                                        })}
                                                    </figure>
                                                    {/* Admin Reply */}
                                                    {v.reply &&
                                                        <div className="mt-5 ml-12 border-l-4 border-orange-500 pl-4 bg-orange-50 p-4 rounded">
                                                            <div className="flex gap-3">
                                                                <img
                                                                    src={admin_profile}
                                                                    alt="admin"
                                                                    className="w-11 h-11 rounded-full"
                                                                />

                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <h4 className="font-semibold sm:text-base text-sm tracking-tight">Abdul Noor</h4>
                                                                        <span className="text-xs bg-orange-500 text-white px-2.5 py-0.5 rounded-full">
                                                                            Admin
                                                                        </span>
                                                                        <span className="text-xs text-gray-500/80 font-medium ml-auto">
                                                                            {new Date(v.reply_created_at).toDateString()}
                                                                        </span>
                                                                    </div>

                                                                    <h6 className="text-gray-600 mt-1 text-sm sm:text-base">
                                                                        {v.reply}
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                </div>
                                            )) : <div className='text-center flex items-center gap-1 w-full text-gray-600 min-h-[40px]'>
                                                <span className='text-[#FE6A13] text-lg'><MdOutlineReviews /></span>
                                                <h6 className='leading-none sm:text-lg text-base'>Product doesn,t have any reviews</h6>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                // <div>
                                //     <p className="text-3xl font-medium mb-4">
                                //         Customer Reviews
                                //     </p>
                                //     <p className="text-gray-500">No reviews yet.</p>
                                // </div>
                            )}
                        </div>
                    </> : <img src={loading_animation} alt='loader' className='mx-auto' />}
                {/* Related Products */}
                <div className="mb-10 mt-16 border-t border-gray-300">
                    <h3 className="text-[32px] font-bold mt-2 tracking-tight">
                        Related Products
                    </h3>
                </div>
                {/* Cards */}
                {relatedItemsLoading ? <img src={loading_animation} alt='loader' className='mx-auto' /> :
                    <div>
                        <div className="products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
                            {relatedtems.length > 0 ? relatedtems.map((item, index) => (
                                <ProductCard key={index} product={item} />
                            )) : <div className='font-medium min-h-[100px] text-lg flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any related items</div>}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default React.memo(SingleProduct)