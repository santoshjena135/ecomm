// async function populateProducts()
// {
//     const response = await fetch('./jsons/men-plp.json');
//     var data = await response.json();

//     var prodName = "Red T-Shirt";
//     var prodHref = "/content/dam/men/image-1.jpeg";
//     var prodDesc = "Perfect for dates with your dear one!";

//     const prodList = document.querySelector(".row");

//     for (let i = 0; i < data.products.length; i++) {
//         var str =   `<div class="col" data-num="${i+1}">
//                         <div class="card" style="width: 18rem;">
//                                 <img src="${data.products[i].imgsrc}" class="card-img-top" alt="...">
//                                 <div class="card-body">
//                                 <h5 class="card-title">${data.products[i].name}</h5>
//                                 <p class="card-text">${data.products[i].price}</p>
//                                 <a href="${data.products[i].imgsrc}" class="btn btn-primary">Add to cart</a>
//                             </div>
//                         </div>
//                     </div>`;
//                     //console.log(str);

//                     prodList.innerHTML += str;
//       } 
// }


async function populateProductsAPI()
{
    const response = await fetch('https://fakestoreapi.com/products');
    var data = await response.json();

    var prodName = "Red T-Shirt";
    var prodHref = "/content/dam/men/image-1.jpeg";
    var prodDesc = "Perfect for dates with your dear one!";

    const prodList = document.querySelector(".row");

    for (let i = 0; i < data.length; i++) {
        var str =   `<div class="col" data-num="${i+1}">
                        <div class="card" style="width: 18rem;">
                                <img src="${data[i].image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">${data[i].title}</h5>
                                <p class="card-text">${data[i].description}</p>
                                <a href="" class="btn btn-primary">Add to cart</a>
                            </div>
                        </div>
                    </div>`;
                    //console.log(str);

                    prodList.innerHTML += str;
      }

    
}

populateProductsAPI();
