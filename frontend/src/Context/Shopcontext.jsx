import React, { useEffect, useState, createContext } from "react";

export const Shopcontext = createContext(null);

const getDefaultCart = () => ({});

const Shopcontextprovider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [carditem, setcarditem] = useState(getDefaultCart()); // Renamed for clarity
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeShop = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");

            try {
                // Using Promise.all to run fetches concurrently for better performance
                const [productsResponse, cartResponse] = await Promise.all([
                    fetch(`https://shopper-backend-uolh.onrender.com/allproduct`),
                    token ? fetch(`https://shopper-backend-uolh.onrender.com/getuserdetails`, {
                        method: "POST",
                        headers: { 'token': token },
                    }) : Promise.resolve(null), // If no token, resolve immediately
                ]);

                // Process products
                if (!productsResponse.ok) throw new Error("Failed to fetch products.");
                const productsData = await productsResponse.json();
                setAll_product(productsData);

                // Process cart data
                if (token && cartResponse && cartResponse.ok) {
                    const userData = await cartResponse.json();
                    if (userData.success) setcarditem(userData.cartdata || getDefaultCart());
                } else if (!token) {
                    // If not logged in, load the guest cart from localStorage
                    const savedCart = JSON.parse(localStorage.getItem("cart")) || getDefaultCart();
                    setcarditem(savedCart);
                }

            } catch (err) {
                console.error("Initialization Error:", err);
                setError("Could not load shop data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        initializeShop();
    }, []);

    const addtocart = async (id) => {
        const originalCart = { ...carditem }; // Store original state for potential revert
        
        // Optimistic UI update
        const newCart = { ...carditem, [id]: (carditem[id] || 0) + 1 };
        setcarditem(newCart);

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch(`https://shopper-backend-uolh.onrender.com/addtocart`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', 'token': token },
                    body: JSON.stringify({ item_id: id }),
                });
                if (!response.ok) throw new Error("Failed to sync with server.");
            } catch (error) {
                console.error("Error adding to cart:", error);
                // CRITICAL: Revert optimistic update on failure
                setcarditem(originalCart); 
                alert("Could not add item to cart. Please try again.");
            }
        } else {
            // Guest user: save the updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(newCart));
        }
    };

    const removefromcart = async (id) => {
        const originalCart = { ...carditem };
        const currentQuantity = carditem[id] || 0;
        
        if (currentQuantity === 0) return; // Do nothing if item is not in cart

        // Optimistic UI update
        const newCart = { ...carditem, [id]: currentQuantity - 1 };
        setcarditem(newCart);
        
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch(`https://shopper-backend-uolh.onrender.com/removefromcart`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', 'token': token },
                    body: JSON.stringify({ item_id: id }),
                });
                if (!response.ok) throw new Error("Failed to sync with server.");
            } catch (error) {
                console.error("Error removing from cart:", error);
                 // CRITICAL: Revert optimistic update on failure
                setcarditem(originalCart);
                alert("Could not remove item from cart. Please try again.");
            }
        } else {
            localStorage.setItem("cart", JSON.stringify(newCart));
        }
    };

    const contextvalue = { all_product, carditem, addtocart, removefromcart, loading, error };

    return (
        <Shopcontext.Provider value={contextvalue}>
            {props.children}
        </Shopcontext.Provider>
    );
};

export default Shopcontextprovider;
