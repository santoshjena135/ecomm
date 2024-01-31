

function addProductToCart(prodID)
{

    if(getCookie("cart_prodid_"+prodID))
    {
        let currentVal = parseInt(getCookie("cart_prodid_"+prodID));
        console.log("Cookie existed with value = "+currentVal);
        document.cookie = "cart_prodid_"+prodID+"="+(currentVal+1);
        console.log("Cookie updated with new value = "+(currentVal+1));
    }
    else{
        document.cookie = "cart_prodid_"+prodID+"="+1;
        console.log("Cookie created with value = 1");
    }
}

var delete_cookie = function(cookiename) {
    console.log("Tetsing deleteing cookie");
    document.cookie = cookiename + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function removeProductFromCart(prodID)
{

    if(getCookie("cart_prodid_"+prodID))
    {
        let currentVal = parseInt(getCookie("cart_prodid_"+prodID));
        if(currentVal!=0 && currentVal>1)
        {
        console.log("Cookie existed with value = "+currentVal);
        document.cookie = "cart_prodid_"+prodID+"="+(currentVal-1);
        console.log("Cookie decremented with new value = "+(currentVal-1));
        }
        else if(currentVal == 1){
            delete_cookie('cart_prodid_'+prodID);
            console.log("No qty for the product in cart to remove!");
        }
        else{
            console.log("No Cookie for product was ever created");
        }
    }
    else{
        //document.cookie = "cart_prodid_"+prodID+"="+0;
        console.log("No Cookie for product was ever created");
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

async function fetchCartDetails(){
    var allcookies = document.cookie;
    cookiearray = allcookies.split(';');
    const cartProdList = document.querySelector(".cartitemslist");
    var total_cart_value = 0;
    var total_items_count = 0;
    // Now take key value pair out of this array
    let pattern = /cart_prodid_/;
    for(var i=0; i<cookiearray.length; i++) {
       keyname = cookiearray[i].split('=')[0];
       value = cookiearray[i].split('=')[1];
       if(pattern.test(keyname)){
            total_items_count++;
            var prodIDforCookie = parseInt(keyname.trim().substring(12));
            var prodQty = parseInt(value);
            //console.log(keyname);
            const response = await fetch(`https://fakestoreapi.com/products/${prodIDforCookie}`);
            var data = await response.json();

            total_cart_value += (parseFloat(data.price)*prodQty);

            let cartProdElementStr = `
            <div class="row mb-4 d-flex justify-content-between align-items-center">
            <div class="col-md-2 col-lg-2 col-xl-2">
                <img
                src="${data.image}"
                class="img-fluid rounded-3" alt="${data.title}">
            </div>
            <div class="col-md-3 col-lg-3 col-xl-3">
                <h6 class="text-muted">${data.category}</h6>
                <h6 class="text-black mb-0">${data.title}</h6>
            </div>
            <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                <button class="btn btn-outline-danger"
                onclick="this.parentNode.querySelector('input[type=number]').stepDown();removeProductFromCart(${prodIDforCookie});updateCartPagePrices();">
                -
                </button>

                <input id="form1" min="0" name="quantity" value="${prodQty}" type="number"
                class="form-control form-control-sm" />

                <button class="btn btn-outline-success"
                onclick="this.parentNode.querySelector('input[type=number]').stepUp();addProductToCart(${prodIDforCookie});updateCartPagePrices();">
                +
                </button>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h6 class="mb-0">${parseFloat(data.price)*prodQty} USD</h6>
            </div>
            <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                <a href="#!" class="text-muted"><i class="fas fa-times"></i></a>
            </div>
            </div>
            <hr class="my-4">`;

            cartProdList.innerHTML += cartProdElementStr;
            //console.log("Key is : " + keyname + " and Value is : " + value);
       }
    }
    updatePrices();
    function updatePrices(){
        document.querySelector(".totalCartValueWODTarget").innerHTML = total_cart_value;
        $("span.totalNumberofItemsTarget").html(total_items_count);
        $("span.totalCartValueWDTarget").html(total_cart_value+5.00);
    } //jquery library dependency
    // document.querySelector(".totalNumberofItemsTarget").innerHTML = total_items_count;
    // document.querySelector(".totalNumberofItemsTargets").innerHTML = total_items_count;
 }

 fetchCartDetails();

 function updateCartPagePrices(){
    document.querySelector(".totalCartValueWODTarget").innerHTML = total_cart_value;
    $("span.totalNumberofItemsTarget").html(total_items_count);
    $("span.totalCartValueWDTarget").html(total_cart_value+5.00);
}