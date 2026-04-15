import axios from "axios";
import React, { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [blogLoading, setBlogLoading] = useState(false)
    const [latestBlogLoading, setLatestBlogLoading] = useState(false)
    const [orderLoading, setOrderLoading] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const initAuthUser = localStorage.getItem('User');
    const [authenticated, setAuthenticated] = useState(initAuthUser ? JSON.parse(initAuthUser) : undefined)
    const token = authenticated?.token;
    const userId = authenticated?.data?.[0]._id;
    const isAdmin = localStorage.getItem('token');
    const [orders, setOrders] = useState([])
    const [adminOrders, setAdminOrders] = useState([])
    const [blogs, setBlogs] = useState([]);
    const [latestBlogs, setLatestBlogs] = useState([])
    const [products, setProducts] = useState([]);
    const [latestProducts, setLatestProducts] = useState([])
    const [qty, setQty] = useState(1)
    const [cartItems, setCartItems] = useState([])
    const [totalCartItems, setTotalCartItems] = useState([])
    const [wishlist, setWishlist] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [query, setQuery] = useState([])
    const [blogQuery, setBlogQuery] = useState([])
    const [suggestions, setSuggestions] = useState([]);
    const [blogSuggestions, setBlogSuggestions] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false)
    const [blogsSearchLoading, setBlogSearchLoading] = useState(false)
    const [suggestionLoading, setSuggestionLoading] = useState(false)
    const [blogSuggestionLoading, setBlogSuggestionLoading] = useState(false)
    const navigate = useNavigate()
    const currency = "Rs"
    const shippingFee = 80;
    const discount = 28

    const logout = () => {
        localStorage.removeItem('User');
        toast.success("Logout successfully")
        setTimeout(() => {
            navigate('/login')
            window.location.reload()
        }, 1000)
    }

    const fetchBlogs = async () => {
        try {
            setBlogLoading(true)
            let response = await axios.get(`${backendUrl}/api/blog/get-blogs`, { withCredentials: true });
            if (response.data) {
                setBlogs(response.data)
                setBlogLoading(false)
            }
            setBlogLoading(false)
        } catch (error) {
            setBlogLoading(false)
            console.log(error)
        }
    }
    const fetchLatestBlogs = async () => {
        try {
            setLatestBlogLoading(true)
            let response = await axios.get(`${backendUrl}/api/blog/latest-blogs`, { withCredentials: true })
            if (response.data) {
                setLatestBlogs(response.data)
                setLatestBlogLoading(false)
            }
            setLatestBlogLoading(false)
        } catch (error) {
            console.log(error)
            setLatestBlogLoading(false)
        }
    }
    const fetchProducts = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/product/get-products`, { withCredentials: true });
            if (response.data) {
                setProducts(response.data)
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const fetchLatestProducts = async (req, res) => {
        try {
            let response = await axios.get(`${backendUrl}/api/product/latest-products`, { withCredentials: true })
            if (response.data) {
                setLatestProducts(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchProducts = async () => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        if (query && suggestions.length > 0) {
            try {
                setSearchLoading(true)
                let response = await axios.get(`${backendUrl}/api/product/search-products?query=${query}`, { withCredentials: true });
                if (response.data) {
                    if (query.length > 1) {
                        setProducts(response.data)
                        setSuggestions([])
                        navigate('/shop')
                        scrollTo(0, 0)
                        setSearchLoading(false)
                    }
                }
                setSearchLoading(false)
            } catch (error) {
                setSearchLoading(false)
                console.log(error)
            }
        }
    }
    const handleClearSearch = () => {
        setQuery('');
        setProducts([]);
        fetchProducts();
    }

    useEffect(() => {
        if (query.length > 1) {
            const delay = setTimeout(async () => {
                if (!query) {
                    setSuggestions([]);
                    return;
                }

                try {
                    setSuggestionLoading(true)
                    // 🔹 fetch suggestions
                    const sugRes = await axios.get(`${backendUrl}/api/product/get-suggestions`, {
                        params: { query },
                    });
                    if (sugRes.data) {
                        setSuggestions(sugRes.data);
                        setSuggestionLoading(false)
                    }
                    setSuggestionLoading(false)

                } catch (err) {
                    setSuggestionLoading(false)
                    console.error(err);
                }
            }, 300); // 300ms debounce

            return () => clearTimeout(delay);
        }
    }, [query]);

    const handleSearchBlogs = async () => {
        if (!blogQuery) {
            setBlogSuggestions([]);
            return;
        }
        if (blogQuery && blogSuggestions.length > 0) {
            try {
                setBlogSearchLoading(true)
                let response = await axios.get(`${backendUrl}/api/blog/search-blogs?blogQuery=${blogQuery}`, { withCredentials: true });
                if (response.data) {
                    if (blogQuery.length > 1) {
                        setBlogs(response.data)
                        setBlogSuggestions([])
                        navigate('/blogs')
                        scrollTo(0, 0)
                        setBlogSearchLoading(false)
                    }
                }
                setBlogSearchLoading(false)
            } catch (error) {
                setBlogSearchLoading(false)
                console.log(error)
            }
        }
    }

    const handleClearBlogSearch = () => {
        setBlogQuery('');
        setBlogs([]);
        fetchBlogs();
    }

    useEffect(() => {
        if (blogQuery.length > 1) {
            const delay = setTimeout(async () => {
                if (!blogQuery) {
                    setBlogSuggestions([]);
                    return;
                }

                try {
                    setBlogSuggestionLoading(true)
                    // 🔹 fetch suggestions
                    const sugRes = await axios.get(`${backendUrl}/api/blog/get-suggestions`, {
                        params: { blogQuery },
                    });
                    if (sugRes.data) {
                        setBlogSuggestions(sugRes.data);
                        setBlogSuggestionLoading(false)
                    }
                    setBlogSuggestionLoading(false)

                } catch (err) {
                    setBlogSuggestionLoading(false)
                    console.error(err);
                }
            }, 300); // 300ms debounce

            return () => clearTimeout(delay);
        }
    }, [blogQuery]);

    const addToCart = async (product_id, quantity) => {
        if (!token) {
            return toast.error('Please login first')
        }
        if (token) {
            try {
                let response = await axios.post(`${backendUrl}/api/cart/addtocart/${userId}`, { product_id, quantity }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                })
                if (response.data) {
                    await getCartItems()
                    await getTotalCartItems()
                    toast.success(response.data.messege)
                }
            } catch (error) {
                console.log(error)
                if (error.response?.status === 500) {
                    localStorage.removeItem("User");
                    window.location.href = "/login"
                }
            }
        }
    }

    const getCartItems = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/cart/getcartitems/${userId}`, {
                headers: {
                    Authorization: `${token}`
                },
                withCredentials: true
            })
            if (response.data) {
                setCartItems(response.data)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const getTotalCartItems = async () => {
        try {
            let response = await axios.get(`${backendUrl}/api/cart/totalitems/${userId}`, { withCredentials: true });
            if (response.data) {
                setTotalCartItems(response.data[0].total_items)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isInWishlist = (productId) => {
        return Array.isArray(wishlist) && wishlist.some(item => item._id === productId);
    };

    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/wishlist/get-user-wishlist/${userId}`);
            setWishlist(res.data);
        } catch (error) {
            console.log(error)
        }
    };

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            try {
                const response = await axios.delete(`${backendUrl}/api/wishlist/remove`, {
                    data: { user_id: userId, product_id: productId },
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                });

                if (response.data.success) {
                    setWishlist(prev => prev.filter(item => item._id !== productId));
                    fetchWishlist()
                    toast.success(response.data.messege)
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                let response = await axios.post(`${backendUrl}/api/wishlist/add`, { user_id: userId, product_id: productId }, {
                    headers: {
                        Authorization: `${token}`
                    },
                    withCredentials: true
                });
                if (response.data.success) {
                    toast.success(response.data.messege)
                    const product = products.find(p => p._id === productId);
                    setWishlist(prev => [...prev, product]);
                    fetchWishlist()
                }
            } catch (error) {
                console.log(error)
            }
        }
    };

    const fetchUserOrders = async () => {
        if (token) {
            try {
                setOrderLoading(true)
                let response = await axios.get(`${backendUrl}/api/order/user-orders/${userId}`, { withCredentials: true })
                if (response.data) {
                    setOrders(response.data)
                    setOrderLoading(false)
                }
            } catch (error) {
                setOrderLoading(false)
                console.log(error)
            }
        }
    }

    const fetchAllReviews = async () => {
        try {
            setLoading(true)
            let response = await axios.get(`${backendUrl}/api/review/all-reviews`, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })

            if (response.data) {
                setAllReviews(response.data)
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    const fetchAdminOrders = async () => {
        try {
            setOrderLoading(true)
            let response = await axios.get(`${backendUrl}/api/order/get-orders`, {
                headers: {
                    Authorization: `${isAdmin}`
                },
                withCredentials: true
            })
            if (response.data) {
                setAdminOrders(response.data)
                setOrderLoading(false)
            } else {
                setOrderLoading(false)
                console.log(error.response.data.messege);
            }
        } catch (error) {
            setOrderLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBlogs()
        fetchLatestBlogs()
        fetchProducts();
        fetchLatestProducts()
        handleSearchProducts();;
        handleSearchBlogs()
        getCartItems()
        getTotalCartItems()
        handleClearSearch()
        handleClearBlogSearch()
        fetchWishlist();
        fetchUserOrders()
        fetchAllReviews();
        fetchAdminOrders();
    }, [])

    return (
        <AppContext.Provider value={{ navigate, userId, discount, backendUrl, token, logout, shippingFee, blogs, fetchBlogs, fetchLatestBlogs, latestBlogs,latestBlogLoading, addToCart, qty, setQty, isAdmin, products, setProducts, fetchProducts, fetchLatestProducts, latestProducts, currency, handleSearchProducts, handleSearchBlogs, query, blogQuery, setQuery, setBlogQuery, suggestions, setSuggestions, blogSuggestions, setBlogSuggestions, blogSuggestionLoading, setBlogSuggestionLoading, cartItems, getCartItems, totalCartItems, getTotalCartItems, handleClearSearch, handleClearBlogSearch, toggleWishlist, isInWishlist, fetchWishlist, wishlist, orders, fetchUserOrders, searchLoading, setSearchLoading, blogsSearchLoading, setBlogSearchLoading, suggestionLoading, setSuggestionLoading, loading, blogLoading, orderLoading, setOrderLoading, wishlistLoading, setWishlistLoading, fetchAllReviews, allReviews, fetchAdminOrders, adminOrders }}>{children}</AppContext.Provider>
    )
}

export default React.memo(AppContextProvider);