import React, { useEffect, useState, createContext, useCallback, useMemo } from "react";

export const Shopcontext = createContext(null);

const getDefaultCart = () => ({});

const Shopcontextprovider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [carditem, setcarditem] = useState(getDefaultCart());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check authentication status
    const checkAuthStatus = useCallback(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        return !!token;
    }, []);

    // Fetch user cart data
    const fetchUserCart = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const response = await fetch(`https://shopper-backend-uolh.onrender.com/getuserdetails`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'token': token 
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    return null;
                }
                throw new Error("Failed to fetch user cart");
            }

            const userData = await response.json();
            return userData.success ? userData.cartdata : null;
        } catch (error) {
            console.error("Error fetching user cart:", error);
            return null;
        }
    }, []);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(`https://shopper-backend-uolh.onrender.com/allproduct`);
            if (!response.ok) throw new Error("Failed to fetch products");
            return await response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }, []);

    // Initialize shop data
    useEffect(() => {
        const initializeShop = async () => {
            setLoading(true);
            setError(null);

            try {
                const isAuth = checkAuthStatus();
                
                // Fetch products
                const products = await fetchProducts();
                setAll_product(products);

                if (isAuth) {
                    const userCart = await fetchUserCart();
                    if (userCart) {
                        setcarditem(userCart);
                    } else {
                        setcarditem(getDefaultCart());
                    }
                }

            } catch (err) {
                console.error("Initialization Error:", err);
                setError("Could not load shop data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        initializeShop();
    }, [checkAuthStatus, fetchProducts, fetchUserCart]);

    // Add to cart (only if logged in)
    const addtocart = useCallback(async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must log in to add items to cart.");
            return;
        }

        const originalCart = { ...carditem };
        const newCart = { ...carditem, [id]: (carditem[id] || 0) + 1 };
        setcarditem(newCart);

        try {
            const response = await fetch(`https://shopper-backend-uolh.onrender.com/addtocart`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json', 
                    'token': token 
                },
                body: JSON.stringify({ item_id: id }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    alert("Session expired. Please log in again.");
                    return;
                }
                throw new Error("Failed to add item to cart");
            }

            const result = await response.json();
            if (result.success && result.cartdata) {
                setcarditem(result.cartdata);
            }

        } catch (error) {
            console.error("Error adding to cart:", error);
            setcarditem(originalCart);
            alert("Could not add item to cart. Please try again.");
        }
    }, [carditem]);

    // Remove from cart (only if logged in)
    const removefromcart = useCallback(async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You must log in to remove items from cart.");
            return;
        }

        const currentQuantity = carditem[id] || 0;
        if (currentQuantity === 0) return;

        const originalCart = { ...carditem };
        const newCart = { ...carditem, [id]: currentQuantity - 1 };
        setcarditem(newCart);

        try {
            const response = await fetch(`https://shopper-backend-uolh.onrender.com/removefromcart`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json', 
                    'token': token 
                },
                body: JSON.stringify({ item_id: id }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    alert("Session expired. Please log in again.");
                    return;
                }
                throw new Error("Failed to remove item from cart");
            }

            const result = await response.json();
            if (result.success && result.cartdata) {
                setcarditem(result.cartdata);
            }

        } catch (error) {
            console.error("Error removing from cart:", error);
            setcarditem(originalCart);
            alert("Could not remove item from cart. Please try again.");
        }
    }, [carditem]);

    // Clear cart (only if logged in)
    const clearCart = useCallback(() => {
        if (!localStorage.getItem("token")) {
            alert("You must log in to clear cart.");
            return;
        }
        setcarditem(getDefaultCart());
    }, []);

    // Login success handler - just fetch cart
    const handleLoginSuccess = useCallback(async () => {
        setIsLoggedIn(true);
        const userCart = await fetchUserCart();
        if (userCart) {
            setcarditem(userCart);
        }
    }, [fetchUserCart]);

    // Logout handler
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setcarditem(getDefaultCart());
    }, []);

    // Context value
    const contextvalue = useMemo(() => ({
        all_product,
        carditem,
        addtocart,
        removefromcart,
        clearCart,
        loading,
        error,
        isLoggedIn,
        handleLoginSuccess,
        handleLogout
    }), [
        all_product,
        carditem,
        addtocart,
        removefromcart,
        clearCart,
        loading,
        error,
        isLoggedIn,
        handleLoginSuccess,
        handleLogout
    ]);

    return (
        <Shopcontext.Provider value={contextvalue}>
            {props.children}
        </Shopcontext.Provider>
    );
};

export default Shopcontextprovider;
