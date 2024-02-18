const express = require('express');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const uuid = require('uuid');
const app = express();
const port = 5050;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    // If the req is not having a cookie already, it creates a new cookie and sends to user.
    if (!req.cookies.user_id) {
        const newUserId = uuid.v4();
        res.cookie('user_id', newUserId, { maxAge: 3 * 24 * 60 * 60 * 1000 , httpOnly: true });
    }
    next();
});

app.set('view engine', 'ejs');
app.use(express.static('scripts'));
app.use(express.static('styles'));
app.use(express.static(__dirname)); //can server static html files on same level as this index.js ex: index.html, cart.html on port 5050
app.use('/cart', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));


//<------------ Routes List Starts ------------->

app.get('/product/:id', async (req, res) => {
    const productId = parseInt(req.params.id);
    try{
        const response = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        if (response.data && typeof response.data === 'object') {
            const product = response.data;
                if (product) {
                    res.render('product', { product });
                }
                else{
                    return res.status(404).send('Product not found');
                }
        }
        else {
            console.error('Invalid JSON response:', response.data);
            res.status(500).json({ error: 'Internal Server Error 1' });
        }
    }
    catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error 2' });
    }
});

app.get('/checkCookie',(req,res)=>{
    const userId = req.cookies.user_id;
    if (!userId) {
        // If user doesn't have a cookie, generate a new ID
        const newUserId = uuid.v4();

        // Set the cookie with the generated ID
        res.cookie('user_id', newUserId, { maxAge: 3 * 24 * 60 * 60 * 1000 }); // Set cookie to expire in 3 days
        res.send(`Welcome! Your unique ID is: ${newUserId}`);
    } else {
        res.send(`Welcome back! Your unique ID is: ${userId}`);
    }
})

app.get("/index", (req, res) => {
  res.render('index');
});

//<------------ Routes List Ends ------------->

app.listen(port, () => {
    console.log(`EJS server running on http://localhost:${port}`);
});
