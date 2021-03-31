


let products = [];
    $(document).ready(function () {
      load();
      
    });

    function load() {
      fetch("./TestData/test_data_v.1.0.JSON")
        .then((response) => response.json())
        .then((data) => render(data))
        .catch((error) => console.error(error));
    }

    function render(data) {
      products = data;

      getProducts(products);
     
      let categories = [];
      products.forEach(element => {
        categories.push(element.category)
      });

      let uniqueCategories = [...new Set(categories)];

      uniqueCategories.forEach(element => {
      $("#sidomeny").append(`
          <button id= "${element}" type="button" class="list-group-item list-group-item-action fs-2" style="background-color:wheat ;">${element}</button>`
      );
    });

    $("#sidomeny button").on("click", function(){
      let btnId = $(this).attr("id");
      let list = [];
     products.forEach(element => {
       if (element.category == btnId){
           list.push(element);
          }
        });
         
        $("#products").empty();
        getProducts(list);

        $("#all").click(function(){
          getProducts(products);
        });
            });
        }
/**
 * Render products to UI and adds functions to add-to-cart button
 * @param {Array} list of product 
 */
function getProducts(list) {
    list.forEach(element => {
        $("#products").append(`
        <div class="col-sm-3 pb-5">
          <div id="${element.productNr}"class="card text-center h-100" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
            <img src="${element.image}" alt="img" class="card-img-top pt-5 ps-5 pe-5">
            <div class="card-body d-flex flex-column">
              <h3 class="card-title" style="font-weight: bold;">${element.title} 8</h3>
              <h4 class="card-subtitle mb-4 text-muted">${element.price} kr</h4>
              <h5 class="card-text pb-4 px-3">${element.description}</h5>
              <div class="align-self-end" style="margin-top: auto; margin-left: auto; margin-right: auto">
                  <button type="button" class="btn btn-outline-dark add1btn d-inline me-1" >-</button>
                  <div id="amount" class="d-inline">1</div>
                  <button type="button" class="btn btn-outline-dark add1btn d-inline ms-1">+</button>
                  <button id="btn1" type="button" class="btn btn-lg btn-block btn-outline-dark align-self ms-5 add-product-to-cart" style="margin-top: auto">Lägg till varukorg</button></p>
              </div>
            </div>
          </div>
        </div>`
        );
      });

      $.each($('.add-product-to-cart'),function( index, value ) {
        value.addEventListener('click',(e) => {
          products.forEach(product => {
            if(product.productNr === e.target.parentElement.parentElement.parentElement.id){
              saveProductToCart(product)

            }
          })
        })
      })
}

/**
 * Checks if product is in cart and increment quantity by 1, 
 * else adds it to cart and update quantity
 * @param {Object} product 
 */
function saveProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart'))
  let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))

  if(cart != null){
    let productToFind = cart.find(e => e.productNr == product.productNr)
    let index = cart.findIndex(e => e.productNr == product.productNr)
    if(productToFind == undefined){
      product.inCart = 1
      cartQuantity += 1
      cart.push(product)
    }else{
      console.log(index);
      cart[index].inCart += 1
      cartQuantity += 1
    }
  }else{
    cart = [] 
    product.inCart = 1
    cartQuantity = 1
    cart.push(product)
  }
  
  localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity))
  localStorage.setItem('cart', JSON.stringify(cart))
  $("#cart-counter").text(cartQuantity)
}

