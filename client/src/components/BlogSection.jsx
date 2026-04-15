import React, { useEffect } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
const BlogCard = React.lazy(() => import('./BlogCard'))
import loading_animation from '../../public/loading_animation.svg'

const BlogSection = () => {
  const { latestBlogs, latestBlogLoading } = useContext(AppContext);

  return (
    <section className="pt-10 2xl:pb-24 pb-20">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="text-center 2xl:mb-10 mb-9">
          <p className="text-orange-500 uppercase tracking-widest mb-2 2xl:text-base text-sm font-semibold">
            Why Choose Us?
          </p>
          <h2 className="2xl:text-[45px] xl:text-[38px] lg:text-[36px] sm:text-[32px] text-[30px] font-bold tracking-tight text-[#1A1A1A]">
            Our Recent Posts
          </h2>
        </div>

        {/* Blog Cards */}
        {latestBlogLoading ? <img src={loading_animation} alt='loader' className='mx-auto' /> : <>
          {latestBlogs.length > 0 ? <div className="blogs grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
            {latestBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div> : <div className='font-medium min-h-[100px] text-lg flex items-center justify-center text-center bg-white rounded-md w-full'>You don,t have any latest items</div>}
        </>}

      </div>
    </section>
  );
};

export default React.memo(BlogSection);