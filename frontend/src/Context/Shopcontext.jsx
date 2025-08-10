import React, { useEffect, useState, createContext } from "react";

export const Shopcontext = createContext(null);

const getcard = () => {
    const arr = {};
    for (let i = 1; i <= 300; i++) {
        arr[i] = 0;
    }
    return arr;
};

const Shopcontextprovider = (props) => {
    const [all_product, setAll_product] = useState([]);
    const [carditem, setcarditem] = useState(getcard());

    // In Shopcontextprovider.js

useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch products in parallel
    fetch(`https://shopper-backend-uolh.onrender.com/allproduct`)
        .then((res) => res.json())
        .then((data) => setAll_product(data))
        .catch((err) => console.error("Error fetching products:", err));

    if (token) {
        // Logged-in: fetch cart from backend
        fetch(`https://shopper-backend-uolh.onrender.com/getuserdetails`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                token: token,
            },
        })
            .then((res) => res.json())
            .then((userData) => {
                if (userData.success) {
                    const fullCart = getcard();
                    Object.entries(userData.cartdata || {}).forEach(([key, value]) => {
                        fullCart[key] = isNaN(value) ? 0 : value; // fix NaN issue
                    });
                    setcarditem(fullCart);
                }
            })
            .catch((err) => console.error("Error fetching user details:", err));
    } else {
        // Guest: load from localStorage instantly
        const savedCart = JSON.parse(localStorage.getItem("cart")) || getcard();
        setcarditem(savedCart);
    }
}, [localStorage.getItem("token")]);
 // This still runs once, but now the logic is ordered correctly.


    useEffect(() => {
        fetch(`https://shopper-backend-uolh.onrender.com/allproduct`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched products:", data);
                setAll_product(data);
            });
    }, []);

    const addtocart = (id) => {
        console.log(id)
        setcarditem((prevCart) => ({
            ...prevCart,

            [id]: (prevCart[id] || 0) + 1,
        }));

        if (localStorage.getItem('token')) {
            fetch(`https://shopper-backend-uolh.onrender.com/addtocart`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ item_id: id }),
            })
                .then((res) => {
                    console.log("🌐 Response status:", res.status);
                    return res.json(); // this can throw if not JSON!
                })
                .then((data) => console.log("✅ Fetched:", data))
                .catch((err) => console.error("❌ Fetch failed:", err));
        }
    };

    const removefromcart = (id) => {
        setcarditem((prevCart) => ({
            ...prevCart,
            [id]: Math.max((prevCart[id] || 0) - 1, 0),
        }));

        if (localStorage.getItem('token')) {
            fetch(`https://shopper-backend-uolh.onrender.com/removefromcart`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ item_id: id }),
            })
                .then((res) => {
                    console.log("🌐 Response status:", res.status);
                    return res.json(); // this can throw if not JSON!
                })
                .then((data) => console.log("✅ Fetched:", data))
                .catch((err) => console.error("❌ Fetch failed:", err));
        }
    };

    const contextvalue = { all_product, carditem, addtocart, removefromcart };

    return (
        <Shopcontext.Provider value={contextvalue}>
            {props.children}
        </Shopcontext.Provider>
    );
};

export default Shopcontextprovider;
