import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
const ProductCard = React.lazy(() => import('./ProductCard'))
import loading_animation from '../../public/loading_animation.svg'

const LatestItems = () => {

    const { latestProducts, fetchLatestProducts, latestItemsLoading } = useContext(AppContext);

    useEffect(() => {
        fetchLatestProducts()
    }, [])

    return (
        <section>
            <div className='container mx-auto px-4 2xl:pt-20 pt-16 2xl:pb-16 pb-12'>
                {/* Heading */}
                <div className="text-center 2xl:mb-10 sm:mb-9 mb-6.5">
                    <p className="text-orange-500 uppercase tracking-widest mb-2 2xl:text-base text-sm font-semibold">
                        Recently Added
                    </p>
                    <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A]">
                        Recently Added Foods
                    </h2>
                </div>

                {/* Cards */}
                {latestItemsLoading ? <img src={loading_animation} className='mx-auto' alt="loader" /> :
                    <div className='min-h-[50vh]'>{latestProducts.length > 0 ?
                        <div className="products grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
                            {latestProducts.map((item, index) => (
                                <ProductCard key={index} product={item} />
                            ))}
                        </div> : <div className='font-medium min-h-[60vh] text-base sm:text-lg flex items-center justify-center text-center rounded-md w-full'>You don,t have any items</div>}
                    </div>
                }
            </div>
        </section>
    )
}

export default React.memo(LatestItems)