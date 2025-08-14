const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors')
const multer = require('multer')
const usermodel = require('./model/Usermodel')
const productmodel = require('./model/Productmodel')
const path = require('path');
const { userInfo } = require('os');
require('dotenv').config();
const { error, log } = require('console');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = [
  "http://localhost:5173", 
  "https://shopper-frontend.onrender.com" // your deployed frontend URL
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
const storage = multer.diskStorage({
    destination: './upload/Images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({ storage: storage })

app.use('/Images', express.static('upload/Images'))

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `https://shopper-backend-uolh.onrender.com/Images/${req.file.filename}`
    });
});

app.post('/register', async (req, res) => {
    let { name, email, password, cartdata } = req.body;
    let check = await usermodel.findOne({ email: email })
    if (!check) {
        let salt = await bcrypt.genSalt(15);
        let hashedpassword = await bcrypt.hash(password, salt)

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        let user = await usermodel.create({
            name, email, password: hashedpassword, cartdata: cart,
        })
        const data = {
            user: {
                id: user._id,
            }
        }
        const token = jwt.sign(data, "secretkey");
        res.json({ success: true, token })
        await user.save();
        console.log(user)
    }
    else {
        res.status(400).json({ success: false, error: "already exists this email id..." })
    }
})
app.post('/login', async (req, res) => { 
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
            // return res.status(200).json({ success: true, message: "you are successfully logged in the website " })
        }
        else {
            return res.status(200).json({ success: false, error: "password not match" })
        }
    }
    else {
        res.send("please register first ...")
    }
})

app.post('/create_product', async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        
        const total = await productmodel.find().sort({ id: 1 }); // sort by id ascending
        let ids = 1;
        if (total.length > 0) {
            ids = total[total.length - 1].id + 1;
        }

        const { name, image, catagory, new_price, old_price, date, available } = req.body;

        if (!name || !image || !category) {
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
    res.send(removedproduct)
});

app.get('/allproduct', async (req, res) => {
    const allproduct = await productmodel.find();
    // console.log(allproduct)
    res.send(allproduct)
})
app.get('/new_collections', async (req, res) => {
    const allproduct = await productmodel.find();
    // console.log(allproduct)
    const newcollection = allproduct.slice(1).slice(-8);
    res.send(newcollection)
})

app.get('/popularinwomen', async (req, res) => {
    const womensitem = await productmodel.find({ catagory: "women" })
    res.send(womensitem)
})

const fetchUser = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).send({ "error": "log in first with email and password" });
    }
    else {
        try {
            const data = jwt.verify(token, "secretkey")
            req.user = data.user;
            next()
        } catch (error) {
            res.status(401).send({ "error": "something went wrong !" });
        }
    }
}

app.post('/addtocart', fetchUser, async (req, res) => {
    let validuser = await usermodel.findOne({ _id: req.user.id })
    validuser.cartdata[req.body.item_id] += 1;
    await usermodel.findOneAndUpdate({ _id: req.user.id }, { cartdata: validuser.cartdata })
    res.json({ success: true, message: "Item added to cart" });
})

app.post('/removefromcart', fetchUser, async (req, res) => {
    let validuser = await usermodel.findOne({ _id: req.user.id })
    if (validuser.cartdata[req.body.item_id]) {
        validuser.cartdata[req.body.item_id] -= 1;
    }
    await usermodel.findOneAndUpdate({ _id: req.user.id }, { cartdata: validuser.cartdata })
     res.json({ success: true, message: "Item removed from cart" }); // <-- ADD THIS
})
 
app.post('/getuserdetails', fetchUser, async (req, res) => {
    let user = await usermodel.findOne({ _id: req.user.id })
    res.json({ success: true, cartdata: user.cartdata });
})

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Replace with your test Secret Key

app.post('/create-checkout-session', async (req, res) => {
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
                        unit_amount: amount * 100, // Stripe needs paisa (₹1 = 100)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/Success',
            cancel_url: 'http://localhost:5173/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post('/empty', fetchUser, async (req, res) => {
    let user = await usermodel.findOne({ _id: req.user.id });
    user.cartdata = {};
    await user.save();
})

app.post('/delete', fetchUser, async (req, res) => {
    let total = await productmodel.find();
    if(total.length > 0){
         await productmodel.deleteMany({});
         return res.status(200).json({ success: true, message: "All products deleted successfully" });
    }
})

app.listen(port, (err) => {
    if (!err) {
        console.log(`app is running on port 3000`);
    }
    else console.log("there is a error in backend")
})
