import React, { useEffect, useState } from 'react'
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
const ProductCard = React.lazy(() => import('../components/ProductCard'))
import { RiArrowRightLongLine } from "react-icons/ri";
import { RiArrowLeftLongLine } from "react-icons/ri";

const Shop = () => {
    const { products } = useContext(AppContext)
    const [sortType, setSortType] = useState('latest');
    const [category, setCategory] = useState('All');
    const [itemsPerPage, setItemsPerPage] = useState(8)
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        const updateItems = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(4)
            }
            else if (window.innerWidth < 1024) {
                setItemsPerPage(6)
            }
            else if (window.innerWidth < 1280) {
                setItemsPerPage(8)
            }
            else {
                setItemsPerPage(8)
            }
        }
        updateItems()
        window.addEventListener('resize', updateItems);
        return () => window.removeEventListener('resize', updateItems)
    }, [])
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const filterProducts = products.filter((item) => {
        if (category === 'All') {
            return true
        } else {
            return item.category === category;
        }
    })
    const sortedProducts = [...filterProducts].sort((a, b) => {
        if (sortType === "latest") {
            return new Date(b.created_at) - new Date(a.created_at);
        }
        if (sortType === "low-high") {
            return a.price - b.price;
        }
        if (sortType === "high-low") {
            return b.price - a.price;
        }
        return 0;
    })
    const currentProducts = sortedProducts.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(products?.length / itemsPerPage);

    return (
        <div className='pb-20 sm:pb-24'>
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
                    <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">Shop</p>

                    <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
                        HOME &gt; SHOP
                    </p>
                </div>
            </div>
            {/* FILTER BAR */}
            <div className='container mx-auto px-4 mt-12'>
                <div className="filterbar_parent bg-[#F6F6F7] p-4 flex justify-between items-center mt-6 mb-10 rounded-[5px]">
                    <span className="text-gray-600 text-sm sm:block hidden">
                        Showing {currentPage}–{totalPages} of {products.length} results
                    </span>
                    <div className="filterbar flex items-center justify-between gap-5 max-sm:w-full">
                        <select value={category} onChange={(e) => { setCategory(e.target.value) }} className="px-3 py-2 rounded text-sm bg-white focus:outline-1 focus:outline-[#FE6A13]">
                            <option value='All'>Sort by Category</option>
                            <option value='Breakfast'>Breakfast</option>
                            <option value='Lunch'>Lunch</option>
                            <option value='Fast Food'>Fast Food</option>
                            <option value='Light & Digestive'>Light & Digestive</option>
                            <option value='Best Seller'>Best Seller</option>
                        </select>
                        <select value={sortType} onChange={(e) => { setSortType(e.target.value) }} className="px-3 py-2 rounded text-sm bg-white focus:outline-1 focus:outline-[#FE6A13]">
                            <option value='latest'>Sort by Latest</option>
                            <option value='low-high'>Price Low to High</option>
                            <option value='high-low'>Price High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
            {/* PRODUCTS */}
            <div className="products container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentProducts.map((item, index) => (
                    
                    <ProductCard key={index} product={item} />
                ))}
            </div>
            {/* Pagination Buttons */}
            {totalPages > 1 ? (
                <div className='flex items-center justify-center gap-2 mt-10 flex-wrap'>

                    {/* Prev */}
                    <button
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage(currentPage - 1); scrollTo(0, 0) }}
                        className='bg-[#FE6A13] text-white w-10 h-10 flex items-center justify-center cursor-pointer disabled:opacity-50 text-lg rounded-full'
                    >
                        <RiArrowLeftLongLine />
                    </button>

                    {/* Pages */}
                    {[
                        1,

                        ...(currentPage > 3 ? ["..."] : []),

                        ...Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                            Math.max(currentPage - (window.innerWidth < 640 ? 1 : 2), 0),
                            currentPage + (window.innerWidth < 640 ? 2 : 2)
                        ),

                        ...(currentPage < totalPages - 2 ? ["..."] : []),

                        totalPages
                    ]
                        .filter((item, index, arr) => arr.indexOf(item) === index)
                        .map((page, index) => (
                            <button
                                key={index}
                                onClick={() => { typeof page === "number" && setCurrentPage(page); scrollTo(0, 0) }}
                                className='sm:w-10 sm:h-10 w-9 h-9 sm:text-base text-sm rounded-full border-none flex items-center justify-center'
                                style={{
                                    background: currentPage === page ? "#1A1A1A" : "#F3F4F6",
                                    color: currentPage === page ? "white" : "#1A1A1A",
                                    cursor: page === "..." ? "default" : "pointer",
                                }}
                            >
                                {page}
                            </button>
                        ))}

                    {/* Next */}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => { setCurrentPage(currentPage + 1); scrollTo(0, 0) }}
                        className='bg-[#FE6A13] text-white sm:w-10 sm:h-10 w-9 h-9 flex items-center justify-center cursor-pointer disabled:opacity-50 sm:text-lg text-sm rounded-full'
                    >
                        <RiArrowRightLongLine />
                    </button>

                </div>
            ) : null}
        </div>
    )
}

export default Shop