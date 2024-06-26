const express = require('express');
require('dotenv').config();
const https = require('https');
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const uuid = require('uuid');
const app = express();
const port = process.env.PORT || 5050;
const db_service_url = process.env.DB_SERVICE_URL || 'http://localhost:4000';
const cart_service_url = process.env.CART_SERVICE_URL || 'http://localhost:3000';

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
    var downtime = process.env.ECOMM_DOWNTIME === 'true';
    //checks if there is downtime for the public accessing /any-routes without the required header key and value
    if(downtime===true && (req.headers['ecomm-downtime-access'] != process.env.ECOMM_DOWNTIME_ACCESS))
    {
            return res.render('maintenance');
    }
    
    // If the req is not having a cookie already, it creates a new cookie and sends to user.
    if (!req.cookies.user_id) {
        const newUserId = uuid.v4();
        console.log("NEW USER DETECTED, ASSIGNING ID :-",newUserId);
        res.cookie('user_id', newUserId, { maxAge: 3 * 24 * 60 * 60 * 1000 , httpOnly: true });
    }
    else{
        console.log("EXISTING USER DETECTED WITH ID :-",req.cookies.user_id);
    }
    next();
});

app.set('view engine', 'ejs');
app.use(express.static('scripts'));
app.use(express.static('styles'));
app.use(express.static(__dirname)); //can server static html files on same level as this index.js ex: index.html, cart.html on port 5050
app.use('/cart', createProxyMiddleware({ target: cart_service_url, changeOrigin: true }));
app.use('/flushcart', createProxyMiddleware({ target: cart_service_url, changeOrigin: true }));
app.use('/createorder', createProxyMiddleware({
    target: cart_service_url,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const amount = req.query.amount;
      return `/createorder?amount=${amount}`;
    }
  }));
app.use('/saveorder',createProxyMiddleware({ target: db_service_url, changeOrigin: true }));
app.use('/orders',createProxyMiddleware({ target: db_service_url, changeOrigin: true }));
app.use('/sitebanner', createProxyMiddleware({ target: db_service_url, changeOrigin: true }));
app.use('/addProduct', createProxyMiddleware({ target: db_service_url, changeOrigin: true }));
app.use('/addCategory', createProxyMiddleware({ target: db_service_url, changeOrigin: true }));
app.use('/products/:id', createProxyMiddleware({ target: db_service_url,
                                                 changeOrigin: true ,
                                                 pathRewrite: (path, req) => {
                                                    const productId = req.params.id;
                                                    return `/products/${productId}`;
                                                  }}));
app.use('/category/:categoryType', createProxyMiddleware({ target: db_service_url,
                                                    changeOrigin: true ,
                                                    pathRewrite: (path, req) => {
                                                       const catType = req.params.categoryType;
                                                       return `/category/${catType}`;
                                                     }}));
app.use('/categories/:param', createProxyMiddleware({ target: db_service_url,
                                                     changeOrigin: true,
                                                    pathRewrite: (path,req)=>{
                                                        const param = req.params.param;
                                                        return `/categories/${param}`;
                                                    }}));
app.use('/search/:term', createProxyMiddleware({ target: db_service_url,
                                                        changeOrigin: true,
                                                       pathRewrite: (path,req)=>{
                                                           const term = req.params.term;
                                                           return `/search/${term}`;
                                                       }}));


//<------------ Routes List Starts ------------->

app.get('/product.:id.:ptitle', async (req, res) => {
    //ptitle -> producttitle is only for SEO purposes and no functional use
    const productId = parseInt(req.params.id);
    try{
        const response = await axios.get(`${db_service_url}/products/${productId}`);
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


//below are the requirements for /auth
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/auth", (req, res) => {
    const uname = req.body.un;
    const pass = req.body.pw;
    if(uname === process.env.ADMIN_USERNAME && pass === process.env.ADMIN_PASSWORD)
    {
        return res.status(200).send("Authenticated!");
    }
    else{
        return res.status(404).send("Wrong Password!");
    }
  });

//<------------ Routes List Ends ------------->

app.listen(port, () => {
    console.log(`EJS server running on http://localhost:${port}`);
});
