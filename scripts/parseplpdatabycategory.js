async function populateProductsAPIbyCategory(categoryType)
{
    const response = await fetch(`https://fakestoreapi.com/products/category/${categoryType}`);
    var data = await response.json();
    const prodList = document.querySelector(".row");

    for (let i = 0; i < data.length; i++) {
        var str =   `<div class="col" data-num="${i+1}">
                        <div class="card" style="width: 18rem;">
                                <img src="${data[i].image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">${data[i].title}</h5>
                                <p class="card-text">${(data[i].description).slice(0,200)} ...</p>
                                <div class="row">
                                    <div class="col">
                                        <p class="card-text">${data[i].price} USD</p>
                                    </div>
                                    <div class="col">
                                        <a href="/productpage.html?prodid=${data[i].id}" class="btn btn-primary">View</a>
                                        <a href="/product/${data[i].id}" class="btn btn-primary">SSR-View</a>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        prodList.innerHTML += str;
      } 

      document.querySelector(".spinner-border").style.display="none";
}

const urlParams = new URLSearchParams(location.search);
if(urlParams.has('category')){
    var catVal = urlParams.get('category');
}

populateProductsAPIbyCategory(catVal);
