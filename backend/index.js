const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors')
const multer = require('multer')
const usermodel = require('./model/Usermodel')
const productmodel = require('./model/Productmodel')
const path = require('path');
const { userInfo } = require('os');
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier'); 

require('dotenv').config();
const { error, log } = require('console');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const allowedOrigins = [
    "http://localhost:5173",
    "https://shopper-for-you.onrender.com",
    "https://shopper-qt5g.onrender.com"
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"]
}));

const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send("THIS IS MY BACKEND PART OF MY PROJECT")
})

//create disk storage...
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use('/Images', express.static('upload/Images'))

app.post('/upload', upload.single('product'), (req, res) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'Images' },
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: 0, error: "Upload failed" });
            }

            res.json({
                success: 1,
                image_url: result.secure_url
            });
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

app.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body;
        let check = await usermodel.findOne({ email: email })
        
        if (!check) {
            let salt = await bcrypt.genSalt(15);
            let hashedpassword = await bcrypt.hash(password, salt)

            let cart = {};
            for (let i = 0; i < 300; i++) {
                cart[i] = 0;
            }

            let user = await usermodel.create({
                name, 
                email, 
                password: hashedpassword, 
                cartdata: cart,
            })
            
            const data = {
                user: {
                    id: user._id,
                }
            }
            const token = jwt.sign(data, "secretkey");
            res.json({ success: true, token })
        }
        else {
            res.status(400).json({ success: false, error: "already exists this email id..." })
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: "Registration failed" });
    }
})

app.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await usermodel.findOne({ email: email })
        
        if (user) {
            let match = await bcrypt.compare(password, user.password);
            if (match) {
                const data = {
                    user: {
                        id: user._id,
                    }
                }
                const token = jwt.sign(data, "secretkey");
                res.json({ success: true, token })
            }
            else {
                return res.status(400).json({ success: false, error: "password not match" })
            }
        }
        else {
            res.status(400).json({ success: false, error: "please register first" })
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: "Login failed" });
    }
})

app.post('/create_product', async (req, res) => {
    try {
        const total = await productmodel.find().sort({ id: 1 });
        let ids = 1;
        if (total.length > 0) {
            ids = total[total.length - 1].id + 1;
        }

        const { name, image, catagory, new_price, old_price, date, available } = req.body;

        if (!name || !image || !catagory) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const productdata = new productmodel({
            id: ids,
            name,
            image,
            catagory,
            new_price,
            old_price,
            date,
            available
        });

        await productdata.save();

        res.json({
            success: true,
            data: productdata
        });

    } catch (err) {
        console.error("Error in /create_product:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/remove_product', async (req, res) => {
    const { id, name, image, catagory, new_price, old_price, date, available } = req.body;
    const removedproduct = await productmodel.findOneAndDelete(id)
    console.log("item will be removed")
    res.send(removedproduct)
});

app.get('/allproduct', async (req, res) => {
    try {
        const allproduct = await productmodel.find();
        res.json(allproduct);
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
})

app.get('/new_collections', async (req, res) => {
    try {
        const allproduct = await productmodel.find().sort({ date: -1 }).limit(8);
        res.json(allproduct);
    } catch (error) {
        console.error('Get new collections error:', error);
        res.status(500).json({ error: "Failed to fetch new collections" });
    }
})

app.get('/popularinwomen', async (req, res) => {
    try {
        const womensitem = await productmodel.find({ catagory: "women" }).limit(4);
        res.json(womensitem);
    } catch (error) {
        console.error('Get popular women items error:', error);
        res.status(500).json({ error: "Failed to fetch women's items" });
    }
})

// FIXED: fetchUser middleware - removed localStorage (doesn't exist on server)
const fetchUser = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ "error": "log in first with email and password" });
    }
    
    try {
        const data = jwt.verify(token, "secretkey")
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).json({ "error": "Invalid token" });
    }
}

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let validuser = await usermodel.findOne({ _id: req.user.id });
        if (!validuser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        
        const itemId = req.body.item_id;
        if (!validuser.cartdata) {
            validuser.cartdata = {};
        }
        
        validuser.cartdata[itemId] = (validuser.cartdata[itemId] || 0) + 1;
        await usermodel.findOneAndUpdate(
            { _id: req.user.id }, 
            { cartdata: validuser.cartdata }
        );
        
        res.json({ 
            success: true, 
            message: "Item added to cart",
            cartdata: validuser.cartdata 
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, error: "Failed to add item to cart" });
    }
})

app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        let validuser = await usermodel.findOne({ _id: req.user.id });
        if (!validuser) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        
        const itemId = req.body.item_id;
        if (validuser.cartdata && validuser.cartdata[itemId] > 0) {
            validuser.cartdata[itemId] -= 1;
        }
        
        await usermodel.findOneAndUpdate(
            { _id: req.user.id }, 
            { cartdata: validuser.cartdata }
        );
        
        res.json({ 
            success: true, 
            message: "Item removed from cart",
            cartdata: validuser.cartdata 
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, error: "Failed to remove item from cart" });
    }
})

app.post('/getuserdetails', fetchUser, async (req, res) => {
    try {
        let user = await usermodel.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, cartdata: user.cartdata || {} });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({ success: false, error: "Failed to get user details" });
    }
})

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', fetchUser, async (req, res) => {
    try {
        const { amount } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Cart Payment',
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://shopper-for-you.onrender.com/Success',
            cancel_url: 'https://shopper-for-you.onrender.com/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post('/empty', fetchUser, async (req, res) => {
    try {
        let user = await usermodel.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        
        user.cartdata = {};
        await user.save();
        res.json({ success: true, message: "Cart emptied successfully" });
    } catch (error) {
        console.error('Empty cart error:', error);
        res.status(500).json({ success: false, error: "Failed to empty cart" });
    }
})

app.post('/delete', fetchUser, async (req, res) => {
    try {
        let total = await productmodel.find();
        if (total.length > 0) {
            await productmodel.deleteMany({});
            return res.status(200).json({ success: true, message: "All products deleted successfully" });
        } else {
            return res.status(200).json({ success: true, message: "No products to delete" });
        }
    } catch (error) {
        console.error('Delete all products error:', error);
        res.status(500).json({ success: false, error: "Failed to delete products" });
    }
})

app.listen(port, (err) => {
    if (!err) {
        console.log(`app is running on port ${port}`);
    }
    else console.log("there is a error in backend")
})
