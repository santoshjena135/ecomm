$.ajax({
    type: 'GET',
    url: '/categories/active',
    success: function(categories) {
        let activeCategories = '';
        const isProductListingPage = (window.location.href.includes('/productlisting.html'))?true:false;
        if(isProductListingPage)
        {
            var currentCategory = window.location.href.split('=')[1];
        }
        for(i in categories){
            const activeCategoryEle = `<li class="nav-item">
                            <a class="nav-link ${(isProductListingPage && (decodeURIComponent(currentCategory) == categories[i].categoryName))? 'active-category':''}" href="productlisting.html?category=${categories[i].categoryName}">${categories[i].displayName}</a>
                        </li>`;
            activeCategories += activeCategoryEle;
        }
        const headerElement = document.querySelector(".globalheader");
        const currentHost = window.location.protocol+'//'+window.location.host;
        var str =   `<nav class="navbar navbar-expand-lg bg-body-tertiary">
                            <div class="container-fluid">
                            <a class="navbar-brand" href="/index.html">myCommerce</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/index.html">Home</a>
                                </li>`+ activeCategories
                                        +`
                                <li class="nav-item">
                                <a class="nav-link" href="${currentHost}/mycart.html">Cart</a>
                                </li>
                                <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                                </li>
                                <li class="nav-item">
                                <a class="nav-link disabled">Disabled</a>
                                </li>
                            </ul>
                            <form class="d-flex" role="search">
                                <input id="searchbox" class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                            </form>
                            <button id="searchbtn"class="btn btn-outline-success">Search</button>
                            </div>
                        </div>
                        </nav>
                    `;
        headerElement.innerHTML = str;
        console.log("Categories Populated from /categories/active");
        $('#searchbtn').on('click',()=>{
            const searchTerm = $('#searchbox').val();
            if(searchTerm && searchTerm!=''){
                window.location.href = '/search.html?q='+searchTerm;
            }
            else{
                console.log("Enter a valid searchTerm!");
            }
        });
       },
    error: function(xhr, status, error) {
      console.error(xhr.responseText);}
  }); 


