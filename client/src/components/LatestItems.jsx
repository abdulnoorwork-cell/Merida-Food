import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
const ProductCard = React.lazy(() => import('./ProductCard'))
import loading_animation from '../../public/loading_animation.svg'
import { useInView } from 'react-intersection-observer';

const LatestItems = () => {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
    const { latestProducts, fetchLatestProducts, latestItemsLoading } = useContext(AppContext);

    useEffect(() => {
        fetchLatestProducts()
    }, [])

    return (
        <section>
            <div className='container mx-auto px-4 2xl:pt-24 pt-20'>
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
                    <div className='max-w-7xl mx-auto min-h-[50vh]'>{latestProducts.length > 0 ?
                        <div className="products grid grid-cols-2 lg:grid-cols-3 gap-8">
                            {latestProducts.map((item, index) => (
                                <div key={index} style={{transitionDelay:`${index * 120}ms`}} ref={ref} className={`box ${inView ? "show" : ""}`}>
                                    <ProductCard key={index} product={item} />
                                </div>
                            ))}
                        </div> : <div className='font-medium min-h-[60vh] text-base sm:text-lg flex items-center justify-center text-center rounded-md w-full'>You don,t have any items</div>}
                    </div>
                }
            </div>
        </section>
    )
}

export default React.memo(LatestItems)