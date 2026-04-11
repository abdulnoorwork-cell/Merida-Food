import React, { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { AppContext } from '../../context/AppContext'

const Login = () => {

  const { backendUrl } = useContext(AppContext);
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      let response = await axios.post(`${backendUrl}/api/user/admin-login`, {email,password},{withCredentials: true})
      if(response.data.success) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = response.data.token;
        toast.success(response.data.messege);
        setLoading(false);
        setTimeout(()=>{
          window.location.reload()
        },1000)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      setError(error.response.data.messege)
    }
  }
  
  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6 max-md:m-4 border border-gray-300 rounded-lg bg-white'>
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full mb-2 text-center'>
              <h6 className='sm:text-3xl text-2xl font-bold' style={{fontFamily:"Poppins"}}><span className='text-[#FE6A13]'>Admin </span>Login</h6>
              <p className='leading-none mt-1.5 text-sm'>Enter your credientials to access the admin panel</p>
          </div>
          <div className='text-sm'>
            <h6 className='text-orange-600 font-medium'>Admin Email: <span className='text-gray-800 font-normal'>abdulnoorwork@gmail.com</span></h6>
            <h6 className='text-orange-600 font-medium'>Admin Password: <span className='text-gray-800 font-normal'>toxd egor wsfl ovjv</span></h6>
          </div>
          <form onSubmit={handleSubmit} className='w-full mt-5 sm:max-w-md text-sm text-gray-700'>
            <p className='text-red-500'>{error ? error : null}</p>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='your email id' className='w-full border border-gray-300 bg-[#f1f1f1] p-2.5 outline-none mb-6' required />
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='your password' className='w-full border border-gray-300 bg-[#f1f1f1] p-2.5 outline-none mb-6' required />
            <button type="submit" className='w-full py-3 font-medium bg-[#FE6A13] text-white text-sm rounded cursor-pointer hover:bg-orange-600 transition-all'>{loading ? 'loading...' : 'Login'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login