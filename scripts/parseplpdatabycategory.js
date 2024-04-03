async function populateProductsAPIbyCategory(categoryType)
{
    const currentHost = window.location.protocol+'//'+window.location.host;
    const response = await fetch(`${currentHost}/category/${categoryType}`);
    var data = await response.json();
    const prodList = document.querySelector(".row");

    for (let i = 0; i < data.length; i++) {
        var str =   `<div class="col" data-num="${i+1}">
                        <div class="card" style="width: 18rem;">
                            <a href="/product.${data[i].id}.${sanitizeTitle(data[i].title)}" class="linkArea"></a>
                                <img src="${data[i].image}" class="card-img-top" alt="...">
                                <div class="card-body">
                                <h5 class="card-title">${data[i].title}</h5>
                                <!--<p class="card-text">${(data[i].description).slice(0,200)} ...</p> -->
                                <div class="row">
                                    <div class="col">
                                        <p class="card-text">${data[i].price} USD</p>
                                    </div>
                                    <div class="col">
                                        <!-- <a href="/productpage.html?prodid=${data[i].id}" class="btn btn-primary">View</a> -->
                                        <a href="/product.${data[i].id}.${sanitizeTitle(data[i].title)}" class="btn btn-primary">View</a>
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

function sanitizeTitle(title) {
    title = title.toLowerCase();
    // Remove special characters and replace spaces with hyphens
    title = title.replace(/[^\w\s-]/g, '') // Remove special characters except hyphen
                 .replace(/\s+/g, '-')       // Replace spaces with hyphens
                 .replace(/--+/g, '-')       // Replace consecutive hyphens with single hyphen
                 .trim();                    // Trim leading/trailing spaces
    return title;
}

function openPDP(pdpLink){
    window.location.href= pdpLink;
}

populateProductsAPIbyCategory(catVal);
