import React, { useContext, useRef, useState } from 'react'
import breadcrumb_bg from '../assets/breadcrumb_bg.webp'
import { LuEyeClosed } from "react-icons/lu";
import { RxEyeOpen } from "react-icons/rx";
import profileImage from '../assets/profile_image.png'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
    const [loginModel, setLoginModel] = useState(true);
    const [signupModel, setSignupModel] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profile_image, setProfile_Image] = useState();
    const [previewImage, setPreviewImage] = useState(profileImage);

    const { backendUrl, navigate, token } = useContext(AppContext)

    const file = useRef();
    const imageHandler = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setProfile_Image(file)
            setPreviewImage(reader.result)
        }
    }

    const onSignupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('phone', phone);
            formData.append('profile_image', profile_image || '')
            let response = await axios.post(`${backendUrl}/api/user/signup`, formData, {
                headers: { "Content-Type": 'multipart/form-data' },
                withCredentials: true
            })
            if (response.data.success) {
                setLoading(false)
                toast.success(response.data.message)
                setName('');
                setEmail('');
                setPassword('');
                setPhone('');
                setError('')
                setSignupModel(false)
                setLoginModel(true)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response)
            setError(error.response.data.message)
        }
    }

    const onLoginHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let response = await axios.post(`${backendUrl}/api/user/login`, { email, password }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            if (response.data.success) {
                setLoading(false)
                // ⏰ assume token expires in 1 hour (same as backend)
                const expiryTime = Date.now() + 60 * 60 * 1000;
                localStorage.setItem("expiryTime", expiryTime);
                localStorage.setItem('User', JSON.stringify(response.data))
                toast.success(response.data.message)
                setEmail('');
                setPassword('');
                setError('')
                setTimeout(() => {
                    window.location.href = '/'
                }, 1000)
                setTimeout(() => {
                    localStorage.removeItem('User');
                    window.location.reload()
                }, response.data.expiresIn * 1000)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error.response)
            setError(error.response.data.message)
        }
    }

    return loginModel ? (
        <div>
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
                    <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">My Account</p>

                    <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
                        HOME &gt; My Account
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex items-center justify-center px-4 sm:py-20 py-16">
                <div className="w-full bg-[#F6F6F7] p-8">

                    {/* Title */}
                    <p className="sm:text-3xl text-2xl uppercase font-semibold text-gray-800 mb-6">
                        Login
                    </p>

                    {/* Form */}
                    <form className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-[15px] text-gray-600 mb-1">
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder='Enter your email'
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white rounded text-[15px] px-3 py-2.5 border border-gray-200 focus:border-none focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <p className='text-red-600 mt-2 leading-none text-sm'>{error ? error : null}</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[15px] text-gray-600 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter your password'
                                    className="w-full bg-white rounded text-[15px] px-3 py-2.5 border border-gray-200 focus:border-none pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                >
                                    <span onClick={() => setShowPassword(true)} className={`cursor-pointer text-base text-gray-700 ${showPassword ? "hidden" : "block"}`}><LuEyeClosed /></span>
                                    <span onClick={() => setShowPassword(false)} className={`cursor-pointer text-base text-gray-700 ${showPassword ? "block" : "hidden"}`}><RxEyeOpen /></span>
                                </span>
                                <p className='text-red-600 mt-2 leading-none text-sm'>{error ? error : null}</p>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <p onClick={() => { navigate('/forgot-password'); scrollTo(0, 0) }} className="text-[15px] text-[#1A1A1A] hover:text-orange-500 cursor-pointer">
                            Lost your password?
                        </p>

                        {/* Button + Remember */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                onClick={onLoginHandler}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-2 font-medium cursor-pointer"
                            >
                                {loading ? 'loading...' : 'Log in'}
                            </button>

                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" className="accent-orange-500" />
                                Remember me
                            </label>
                        </div>

                        <p onClick={() => { setLoginModel(false); setSignupModel(true) }} className="text-[15px] text-[#1A1A1A] hover:text-orange-500 cursor-pointer">
                            Don,t have an account?
                        </p>

                    </form>
                </div>
            </div>
        </div>
    ) :
        <div>
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
                    <p className="md:flex-1 xl:text-6xl lg:text-5xl md:text-[44px] text-[40px] font-semibold md:mb-4 mb-2.5 leading-tight">My Account</p>

                    <p className="md:flex-1 flex md:justify-end text-sm md:text-base text-white font-semibold">
                        HOME &gt; My Account
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto flex items-center justify-center px-4 sm:py-20 py-16">
                <div className="w-full bg-[#F6F6F7] p-8">

                    {/* Title */}
                    <p className="sm:text-3xl text-2xl uppercase font-semibold text-gray-800 mb-6">
                        Create Account
                    </p>

                    {/* Form */}
                    <form className="space-y-5">

                        {/* Name */}
                        <div>
                            <label className="block text-[15px] text-gray-600 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder='Enter Your Name'
                                value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white rounded text-[15px] px-3 py-2.5 border border-gray-200 focus:border-none focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <p className='text-red-600 mt-2 leading-none text-xs'>{error === 'Please fill required fileds' ? error : null}</p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[15px] text-gray-600 mb-1">
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder='Enter email'
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white rounded text-[15px] px-3 py-2.5 border border-gray-200 focus:border-none focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                            <p className='text-red-600 mt-2 leading-none text-xs'>{error === 'Please fill required fileds' || error === 'Email already exists' ? error : null}</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[15px] text-gray-600 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Enter password'
                                    className="w-full bg-white rounded text-[15px] px-3 py-2.5 border border-gray-200 focus:border-none pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                                >
                                    <span onClick={() => setShowPassword(true)} className={`cursor-pointer text-base text-gray-700 ${showPassword ? "hidden" : "block"}`}><LuEyeClosed /></span>
                                    <span onClick={() => setShowPassword(false)} className={`cursor-pointer text-base text-gray-700 ${showPassword ? "block" : "hidden"}`}><RxEyeOpen /></span>
                                </span>
                            </div>
                            <p className='text-red-600 mt-2 leading-none text-xs'>{error === 'Please fill required fileds' || error === 'Password must be at least 8 characters' ? error : null}</p>
                        </div>

                        {/* Phone*/}
                        <div>
                            <label className="block text-[15px] text-gray-600 mb-1">
                                Phone (Optional)
                            </label>

                            <div className="relative">
                                <input
                                    type='number'
                                    value={phone} onChange={(e) => setPhone(e.target.value)}
                                    placeholder='Enter phone'
                                    className="w-full bg-white rounded text-[15px] px-3 py-2.5 border border-gray-200 focus:border-none pr-10 focus:outline-none focus:ring-1 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        {/* image */}
                        <div>
                            <img src={previewImage} onClick={() => file.current.click()} className='w-18 h-18 rounded-full cursor-pointer' alt="" />
                            <input type="file" hidden ref={file} onChange={imageHandler} name="" id="" />
                        </div>

                        {/* Button + Remember */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                onClick={onSignupHandler}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-2 font-medium cursor-pointer"
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>

                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" className="accent-orange-500" />
                                Remember me
                            </label>
                        </div>

                        <p onClick={() => { setLoginModel(true); setSignupModel(false) }} className="text-[15px] text-[#1A1A1A] hover:text-orange-500 cursor-pointer">
                            Already have an account?
                        </p>

                    </form>
                </div>
            </div>
        </div>
}

export default Login