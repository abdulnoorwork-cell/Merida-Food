import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash, FaUserShield } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const { backendUrl } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('abdulnoorwork@gmail.com')
  const [password, setPassword] = useState('toxd egor wsfl ovjv')
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response = await axios.post(`${backendUrl}/api/user/admin-login`, { email, password }, { withCredentials: true })
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = response.data.token;
        toast.success(response.data.messege);
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/admin'
        }, 800)
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error)
      setError(error.response.data.messege)
    }
  }

  return (
    <section className="min-h-screen bg-[#f0f0f0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-300">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">

            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
              <FaUserShield className="text-3xl text-blue-600" />
            </div>

            <h1 className="text-3xl font-bold text-white mt-4">
              Admin Login
            </h1>

            <p className="text-blue-100 text-sm mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmitHandler}
            className="p-8 space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-300
                  rounded-lg
                  outline-none
                  bg-slate-100
                  focus:ring-1
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />
              <h6 className='text-red-600 mt-2 leading-none text-xs'>{error === 'Can,t be empty' || error === 'Invalid Credientials' ? error : null}</h6>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="
                    w-full
                    px-4
                    py-3
                    border
                    border-gray-300
                    rounded-lg
                    outline-none
                    bg-slate-100
                    focus:ring-1
                    focus:ring-blue-500
                    focus:border-blue-500
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                >
                  {!showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>
              <h6 className='text-red-600 mt-2 leading-none text-xs'>{error === 'Can,t be empty' || error === 'Invalid Credientials' ? error : null}</h6>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-medium
                transition
                disabled:opacity-60
              "
            >
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Secure Admin Panel
        </p>

      </div>
    </section>
  );
};

export default Login;