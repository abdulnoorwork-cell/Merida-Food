import React, { useContext, useEffect, useState } from "react";
import product_bg from '../assets/product_bg.webp'
import { AppContext } from "../context/AppContext";
import axios from "axios";
const ProductCard = React.lazy(()=>import("./ProductCard"));

const categories = ["All", "Breakfast", "Lunch", "Light & Digestive","Fast Food"];

export default function FoodMenu() {
    const [active, setActive] = useState("All");
    const [categoryProducts, setCategoryProducts] = useState([])
    const [limitedProducts, setLimitedProducts] = useState([])
    const [loading, setLoading]=useState(false)

    const {backendUrl} = useContext(AppContext)

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/product/category-products/${active}`, { withCredentials: true });
            if (response.data) {
                setLoading(false)
                setCategoryProducts(response.data)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const fetchLimitedProducts = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/product/getLimitProducts`, { withCredentials: true });
            if (response.data) {
                setLoading(false)
                setLimitedProducts(response.data)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(()=>{
        fetchLimitedProducts()
    },[])

    useEffect(() => {
        if (active) {
            fetchCategoryProducts();
        }
    }, [active]);

    const filtered =
        active === "All"
            ? limitedProducts
            : categoryProducts;

    console.log(filtered)

    return (
        <section style={{ backgroundImage: `url(${product_bg})` }} className="bg-center bg-no-repeat bg-cover text-white">
            <div className="container mx-auto px-4 2xl:py-24 sm:py-20 py-16">

                {/* Heading */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between 2xl:mb-10 sm:mb-9 mb-6.5">
                    <div>
                        <p className="text-orange-500 uppercase tracking-widest mb-2 2xl:text-base text-sm font-semibold">
                            Food Menus
                        </p>
                        <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight">
                            Delicious Food Menu
                        </h2>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`px-5 py-2 border text-sm uppercase transition font-medium cursor-pointer ${active === cat
                                    ? "bg-orange-500 border-orange-500 text-white"
                                    : "border-gray-600 text-gray-300 hover:border-orange-500"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards */}
                <div className="products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
                    {filtered?.map((item, index) => (
                        <ProductCard key={index} product={item} />
                    ))}
                </div>

            </div>
        </section>
    );
}