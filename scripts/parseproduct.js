async function populateProductsAPIbyprodID(prodID)
{
    const response = await fetch(`https://fakestoreapi.com/products/${prodID}`);
    var data = await response.json();
    console.log(data);
    const prodimgdiv = document.querySelector(".prodimgdiv");
    const prodDetailsdiv = document.querySelector(".prodDetailsdiv");

    var imgdivstr = `<img src="${data.image}" class="rounded" alt="..."></img>`;
    var prodDetails = `<h1 class="display-4">${data.title}</h1>
                        <p class="lead">${data.description}</p>
                        <p><em>${data.rating.count} users have rated this product ${data.rating.rate}/5.0 on average.</em></p>
                        <h5>${data.price} USD</h5>
                        <div class="btn btn-primary btn-add-to-cart" onclick="updateCart(${prodID},'add')">ADD TO CART</div>`;
    prodimgdiv.innerHTML = imgdivstr;
    prodDetailsdiv.innerHTML = prodDetails;

    
    
    // for (let i = 0; i < data.length; i++) {
    //     var str =   `<div class="col" data-num="${i+1}">
    //                     <div class="card" style="width: 18rem;">
    //                             <img src="${data[i].image}" class="card-img-top" alt="...">
    //                             <div class="card-body">
    //                             <h5 class="card-title">${data[i].title}</h5>
    //                             <p class="card-text">${data[i].description}</p>
    //                             <a href="" class="btn btn-primary">Add to cart</a>
    //                         </div>
    //                     </div>
    //                 </div>`;
    //     prodList.innerHTML += str;
      } 


const urlParams = new URLSearchParams(location.search);
if(urlParams.has('prodid')){
    var prodidVal = urlParams.get('prodid');
}

populateProductsAPIbyprodID(prodidVal);