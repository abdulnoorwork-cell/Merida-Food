import React from 'react'
import Hero from '../components/Hero'
import Service from '../components/Services'
import LatestItems from '../components/LatestItems'
import Faqs from '../components/Faqs'
import MenuItems from '../components/MenuItems'
import Team from '../components/Team'
import BlogSection from '../components/BlogSection'
import FoodMenu from '../components/FoodMenu'
import BestSeller from '../components/BestSeller'

const Home = () => {
  return (
    <div>
      <Hero />
      <Service />
      <FoodMenu />
      <BestSeller />
      <Team />
      <Faqs />
      <MenuItems />
      <LatestItems />
      <BlogSection />
    </div>
  )
}

export default Home