import React, { useContext, useEffect } from 'react'
import MainLayout from './MainLayout'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Blogs from './pages/Blogs'
import Contact from './pages/Contact'
import SingleProduct from './pages/SingleProduct'
import SingleBlog from './pages/SingleBlog'
import Shop from './pages/Shop'
import MyAccount from './pages/MyAccount'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import { AppContext } from './context/AppContext'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AdminLogin from './pages/admin/Login'
import AddBlog from './pages/admin/AddBlog';
import AddProduct from './pages/admin/AddProduct';
import ListBlog from './pages/admin/ListBlog'
import Orders from './pages/admin/Orders'
import ProductList from './pages/admin/ProductList'
import UpdateBlog from './pages/admin/UpdateBlog'
import WishlistProducts from './pages/admin/WishlistProducts';
import Reviews from './pages/admin/Reviews';

import 'quill/dist/quill.snow.css'
import Checkout from './pages/Checkout'
import OrderSuccessfull from './pages/OrderSuccessfull'
import CategoryProducts from './pages/CategoryProducts'
import OrderCancelled from './pages/OrderCancelled'
import axios from 'axios'

const App = () => {
  const { isAdmin, token } = useContext(AppContext);

  useEffect(() => {
    const interval = setInterval(() => {
      const expiryTime = localStorage.getItem("expiryTime");

      if (!expiryTime) return;

      if (Date.now() > expiryTime) {
        // ✅ AUTO LOGOUT
        localStorage.removeItem("User");
        localStorage.removeItem("expiryTime");

        window.location.href = "/login";
        window.location.reload();
      }
    }, 60000); // check every 1 minute

    return () => clearInterval(interval);
  }, []);


  return (
    <div className='bg-white'>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/shop/:product_id' element={<SingleProduct />} />
          <Route path='/blogs/:blog_id' element={<SingleBlog />} />
          <Route path='/my-account' element={token && <MyAccount />} />
          <Route path='/shop' element={<Shop />} />
          <Route path='/shop/category/breakfast' element={<CategoryProducts category={'Breakfast'} />} />
          <Route path='/shop/category/lunch' element={<CategoryProducts category={'Lunch'} />} />
          <Route path='/shop/category/fastfood' element={<CategoryProducts category={'Fast Food'} />} />
          <Route path='/shop/category/light&digestive' element={<CategoryProducts category={'Light & Digestive'} />} />
          <Route path='/shop/category/bestseller' element={<CategoryProducts category={'Best Seller'} />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/login' element={<Login />} />
          <Route path='/checkout' element={token && <Checkout />} />
        </Route>
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/success' element={<OrderSuccessfull />} />
        <Route path='/cancel' element={<OrderCancelled />} />
        {isAdmin ? <Route path='/admin' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='addblog' element={<AddBlog />} />
          <Route path='listblog' element={<ListBlog />} />
          <Route path='listproduct' element={<ProductList />} />
          <Route path='addproduct' element={<AddProduct />} />
          <Route path='updateblog/:blogId' element={<UpdateBlog />} />
          <Route path='listorders' element={<Orders />} />
          <Route path='wishlist' element={<WishlistProducts />} />
          <Route path='reviews' element={<Reviews />} />
        </Route> : <Route path='/admin' element={<AdminLogin />} />}
      </Routes>
      <Toaster />
    </div>
  )
}

export default App