async function populateProductsBySearchTerm(searchTerm)
{
    const response = await fetch(`http://localhost:4000/search/${searchTerm}`);
    const resultscount = document.querySelector(".results");
    if(response.ok)
    {
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
        var resultstring = `<span>We found ${data.length} results for <em>'${searchTerm}'</em></span>`;
        resultscount.innerHTML = resultstring;
    }
    else{
      var resultstring = `<span>We found no results for <em>'${searchTerm}'</em></span>`;
      resultscount.innerHTML = resultstring;
    }
      document.querySelector(".spinner-border").style.display="none";
}

const urlParams = new URLSearchParams(location.search);
if(urlParams.has('q')){
    var searchTerm = urlParams.get('q');
}
populateProductsBySearchTerm(searchTerm);
