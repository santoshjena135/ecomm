

function updateCart(prodID,upType)
{
    $.ajax({
        url: '/cart', // Replace with your API endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ productID: prodID, updateType: upType, tempUserSession: 'toshu' }),
        success: function(data) {
          console.log("Success");
          triggerMiniCart();
        },
        error: function(xhr, status, error) {
          console.log("Failed");
        }
      });
}

// var delete_cookie = function(cookiename) {
//     console.log("Tetsing deleteing cookie");
//     document.cookie = cookiename + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// };

// function removeProductFromCart(prodID)
// {

//     if(getCookie("cart_prodid_"+prodID))
//     {
//         let currentVal = parseInt(getCookie("cart_prodid_"+prodID));
//         if(currentVal!=0 && currentVal>1)
//         {
//         console.log("Cookie existed with value = "+currentVal);
//         document.cookie = "cart_prodid_"+prodID+"="+(currentVal-1);
//         console.log("Cookie decremented with new value = "+(currentVal-1));
//         }
//         else if(currentVal == 1){
//             delete_cookie('cart_prodid_'+prodID);
//             console.log("No qty for the product in cart to remove!");
//         }
//         else{
//             console.log("No Cookie for product was ever created");
//         }
//     }
//     else{
//         console.log("No Cookie for product was ever created");
//     }
// }

 function updateCartPagePrices(price,updateType){
    if(updateType=="increment"){
        document.querySelector(".totalCartValueWODTarget").innerHTML = parseFloat(document.querySelector(".totalCartValueWODTarget").innerHTML) + price;
    
    }
    else if(updateType=="decrement")
    {
        document.querySelector(".totalCartValueWODTarget").innerHTML = parseFloat(document.querySelector(".totalCartValueWODTarget").innerHTML) - price;

    }
    $("span.totalCartValueWDTarget").html(parseFloat(document.querySelector(".totalCartValueWODTarget").innerHTML)+5.00);
}

function fetchCartDetailsFromServer(){
 $.ajax({
    url: "/cart/toshu",
    type: 'GET',
    success: function(data){
        const fetchData = async () => {
        const arr = Object.entries(data);
        console.log(arr);
        var total_cart_value = 0;
        var total_items_count = 0;
        console.log(total_cart_value);
        const cartProdList = document.querySelector(".cartitemslist");
        for (const [prodID,qty] of arr){
            //const val = array[i].value;
            //console.log(`ID: ${prodID} Count: ${qty}`);
            total_items_count++; 
            const response = await fetch(`https://fakestoreapi.com/products/${prodID}`);
            var proddata = await response.json();

            total_cart_value += (parseFloat(proddata.price)*qty);
            let cartProdElementStr = `
            <div class="row mb-4 d-flex justify-content-between align-items-center">
            <div class="col-md-2 col-lg-2 col-xl-2">
                <img
                src="${proddata.image}"
                class="img-fluid rounded-3" alt="${proddata.title}">
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
                <h6 class="text-muted">${proddata.category}</h6>
                <h6 class="text-black mb-0">${proddata.title}</h6>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                <button class="btn btn-outline-danger"
                onclick="this.parentNode.querySelector('input[type=number]').stepDown();updateCart(${prodID},'remove');updateCartPagePrices(${proddata.price},'decrement');">
                -
                </button>

                <input id="form1" min="0" name="quantity" value="${qty}" type="number"
                class="form-control form-control-sm" />

                <button class="btn btn-outline-success"
                onclick="this.parentNode.querySelector('input[type=number]').stepUp();updateCart(${prodID},'add');updateCartPagePrices(${proddata.price},'increment');">
                +
                </button>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 class="mb-0">${parseFloat(proddata.price)} USD /unit</h6>
            </div>
            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                <a href="#!" class="text-muted"><i class="fas fa-times"></i></a>
            </div>
            </div>
            <hr class="my-4">`;

            cartProdList.innerHTML += cartProdElementStr;
        }
        updatePrices();
        function updatePrices(){
            document.querySelector(".totalCartValueWODTarget").innerHTML = total_cart_value;
            $("span.totalNumberofItemsTarget").html(total_items_count);
            $("span.totalCartValueWDTarget").html(total_cart_value+5.00);
        }
    }
    fetchData()},
    error: function(err){
        console.log("Error fetching products from Cart.");
    }
 })
}
fetchCartDetailsFromServer();