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

    // Load cart from localStorage for guest users
    const loadGuestCart = useCallback(() => {
        try {
            const savedCart = JSON.parse(localStorage.getItem("guestCart")) || getDefaultCart();
            setcarditem(savedCart);
        } catch (error) {
            console.error("Error loading guest cart:", error);
            setcarditem(getDefaultCart());
        }
    }, []);

    // Save cart to localStorage for guest users
    const saveGuestCart = useCallback((cart) => {
        try {
            localStorage.setItem("guestCart", JSON.stringify(cart));
        } catch (error) {
            console.error("Error saving guest cart:", error);
        }
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
                    // Token is invalid, remove it
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
                    // Fetch user cart
                    const userCart = await fetchUserCart();
                    if (userCart) {
                        setcarditem(userCart);
                    } else {
                        loadGuestCart();
                    }
                } else {
                    // Load guest cart
                    loadGuestCart();
                }

            } catch (err) {
                console.error("Initialization Error:", err);
                setError("Could not load shop data. Please try again later.");
                // Load guest cart as fallback
                if (!checkAuthStatus()) {
                    loadGuestCart();
                }
            } finally {
                setLoading(false);
            }
        };

        initializeShop();
    }, [checkAuthStatus, fetchProducts, fetchUserCart, loadGuestCart]);

    // Add to cart function
    const addtocart = useCallback(async (id) => {
        const token = localStorage.getItem("token");
        const originalCart = { ...carditem };
        
        // Optimistic update
        const newCart = { ...carditem, [id]: (carditem[id] || 0) + 1 };
        setcarditem(newCart);

        if (!token) {
            // Guest user - save to localStorage
            saveGuestCart(newCart);
            return;
        }

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
                    // Token invalid, logout user
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    alert("Session expired. Please log in again.");
                    return;
                }
                throw new Error("Failed to add item to cart");
            }

            const result = await response.json();
            if (result.success && result.cartdata) {
                // Use server response as source of truth
                setcarditem(result.cartdata);
            }

        } catch (error) {
            console.error("Error adding to cart:", error);
            setcarditem(originalCart); // Revert on failure
            alert("Could not add item to cart. Please try again.");
        }
    }, [carditem, saveGuestCart]);

    // Remove from cart function
    const removefromcart = useCallback(async (id) => {
        const currentQuantity = carditem[id] || 0;
        if (currentQuantity === 0) return;

        const token = localStorage.getItem("token");
        const originalCart = { ...carditem };
        
        // Optimistic update
        const newCart = { ...carditem, [id]: currentQuantity - 1 };
        setcarditem(newCart);

        if (!token) {
            // Guest user - save to localStorage
            saveGuestCart(newCart);
            return;
        }

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
            setcarditem(originalCart); // Revert on failure
            alert("Could not remove item from cart. Please try again.");
        }
    }, [carditem, saveGuestCart]);

    // Clear cart function
    const clearCart = useCallback(() => {
        setcarditem(getDefaultCart());
        if (!localStorage.getItem("token")) {
            saveGuestCart(getDefaultCart());
        }
    }, [saveGuestCart]);

    // Login success handler - merge guest cart with user cart
    const handleLoginSuccess = useCallback(async () => {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {};
        const hasGuestItems = Object.values(guestCart).some(qty => qty > 0);
        
        setIsLoggedIn(true);
        
        if (hasGuestItems) {
            // Merge guest cart with user cart
            try {
                for (const [itemId, quantity] of Object.entries(guestCart)) {
                    if (quantity > 0) {
                        for (let i = 0; i < quantity; i++) {
                            await addtocart(itemId);
                        }
                    }
                }
                // Clear guest cart after merging
                localStorage.removeItem("guestCart");
            } catch (error) {
                console.error("Error merging guest cart:", error);
            }
        } else {
            // No guest items, just fetch user cart
            const userCart = await fetchUserCart();
            if (userCart) {
                setcarditem(userCart);
            }
        }
    }, [addtocart, fetchUserCart]);

    // Logout handler
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setcarditem(getDefaultCart());
        localStorage.removeItem("guestCart");
    }, []);

    // Memoize context value to prevent unnecessary re-renders
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
