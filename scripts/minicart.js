function showMiniCart(params) {
    document.getElementById('popup-cart').style.display = 'block';   
}

function hideMiniCart(params){
    document.getElementById('popup-cart').style.display = 'none';
}

function updateMiniCart(){
    return new Promise((resolve, reject) => {
        const miniCart = document.getElementById('cart-items');
        miniCart.innerHTML = '';
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/cart/toshu",
            success: async function (data) {
                const fetchData = async () => {
                console.log(data);
                const arr = Object.entries(data);
                
                for (const [prodID,qty] of arr){
                    const response = await fetch(`https://fakestoreapi.com/products/${prodID}`);
                    var proddata = await response.json();
                    let miniCartProdElementStr = `<div>${proddata.title} - *${qty}</div><br>`;
                    miniCart.innerHTML += miniCartProdElementStr;
                }
            }
            await fetchData();
            resolve();
            },
            error: function(err){
                console.log("Error fetching products from Cart.");
                reject(err);
            }
        });
    
    });
}

function triggerMiniCart(){
    updateMiniCart().then(() => {
        showMiniCart(1000);
      });
    setTimeout(hideMiniCart, 4000);
}