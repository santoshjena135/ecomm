const express = require('express');
const axios = require('axios');
const app = express();
const port = 5050;

app.set('view engine', 'ejs');
app.use(express.static('scripts'));
app.use(express.static(__dirname)); //can server static html files on same level as this index.js ex: index.html, cart.html on port 5050
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

app.listen(port, () => {
    console.log(`EJS server running on http://localhost:${port}`);
});
