import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import loading_animation from '../../public/loading_animation.svg'
import { useInView } from 'react-intersection-observer';

const MenuItems = () => {
    const {ref,inView}=useInView({threshold:0.2,triggerOnce:true});
    const [brreakfastProducts, setBreakfastProducts] = useState([])
    const [lunchProducts, setLunchProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const { backendUrl, currency,navigate } = useContext(AppContext);

    const fetchBreakfastProducts = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/product/latest-category-products/Breakfast`, { withCredentials: true });
            if (response.data) {
                setLoading(false)
                setBreakfastProducts(response.data)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const fetchLunchProducts = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/product/latest-category-products/Lunch`, { withCredentials: true });
            if (response.data) {
                setLoading(false)
                setLunchProducts(response.data)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBreakfastProducts();
        fetchLunchProducts()
    }, []);

    return (
        <section className="bg-[#111] py-20">
            <div className='container mx-auto px-4'>

                {/* Heading */}
                <div className="text-center 2xl:mb-10 mb-9">
                    <p className="text-orange-500 uppercase tracking-widest mb-2 2xl:text-base text-sm font-semibold">
                        Our Menus
                    </p>
                    <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-white">
                        Main Food Dishes
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-10">

                    {/* LEFT COLUMN */}
                    <div className={``}>
                        <p className="text-white text-lg font-medium mb-6 tracking-wide border-b border-gray-700 pb-2">
                            BREAKFAST MENU
                        </p>

                        {loading ? <img src={loading_animation} className='mx-auto' alt="loader" /> :
                            <div>
                                {brreakfastProducts.length > 0 ? brreakfastProducts.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={()=>{navigate(`/shop/${item?._id}`);scrollTo(0,0)}}
                                        className="flex items-center gap-4 py-4 border-b border-gray-700"
                                    >
                                        <img
                                            src={item.images?.[0]?.url}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />

                                        <div className="flex-1">
                                            <p onClick={()=>{navigate(`/shop/${item?._id}`);scrollTo(0,0)}} className="cursor-pointer text-white font-semibold text-lg hover:text-orange-500">
                                                {item.name}
                                            </p>
                                            <p className="text-gray-400 sm:text-base text-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: item.description }}>
                                            </p>
                                        </div>

                                        <span className="text-orange-500 font-semibold">
                                            {currency}.{item.price}
                                        </span>
                                    </div>
                                )) : <div className='font-medium min-h-[60vh] text-base sm:text-lg flex items-center justify-center text-center rounded-md w-full'>You don,t have any items</div>}
                            </div>}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={``}>
                        <p className="text-white text-lg font-medium mb-6 tracking-wide border-b border-gray-700 pb-2">
                            LUNCH MENU
                        </p>

                        {loading ? <img src={loading_animation} className='mx-auto' alt="loader" /> :
                            <div>
                                {lunchProducts.length > 0 ? lunchProducts.map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={()=>{navigate(`/shop/${item?._id}`);scrollTo(0,0)}}
                                        className="flex items-center gap-4 py-4 border-b border-gray-700"
                                    >
                                        <img
                                            src={item.images?.[0]?.url}
                                            alt={item.name}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />

                                        <div className="flex-1">
                                            <p onClick={()=>{navigate(`/shop/${item?._id}`);scrollTo(0,0)}} className="cursor-pointer text-white font-semibold text-lg hover:text-orange-500">
                                                {item.name}
                                            </p>
                                            <p className="text-gray-400 sm:text-base text-sm line-clamp-1" dangerouslySetInnerHTML={{ __html: item.description }}>
                                            </p>
                                        </div>

                                        <span className="text-orange-500 font-semibold">
                                            {currency}.{item.price}
                                        </span>
                                    </div>
                                )) : <div className='font-medium min-h-[60vh] text-base sm:text-lg flex items-center justify-center text-center rounded-md w-full'>You don,t have any items</div>}
                            </div>}
                    </div>

                </div>
            </div>
        </section>
    );
};

const MenuColumn = () => {
    return (
        <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide">
                BREAKFAST MENU
            </h4>

            {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} />
            ))}
        </div>
    );
};

const MenuSection = () => {
    return (
        <section className="bg-[#111] py-16 px-6 md:px-16">
            <div className="max-w-6xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-12">
                    <p className="text-orange-500 uppercase text-sm tracking-widest">
                        Our Menus
                    </p>
                    <h2 className="text-4xl md:text-5xl text-white font-serif mt-2">
                        Main Food Dishes
                    </h2>
                </div>

                {/* Menu Grid */}
                <div className="grid md:grid-cols-2 gap-10">
                    <MenuColumn />
                    <MenuColumn />
                </div>

            </div>
        </section>
    )
}

export default MenuItems