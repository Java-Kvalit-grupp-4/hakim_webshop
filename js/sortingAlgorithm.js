$(function () {
  console.log("Här ska det sorteras!!!");
  let products = [];

  const productsData = "./TestData/test_data_products_v1.2.JSON";
  axios
    .get(productsData)
    .then((response) => {
      //console.log(response.data);
      if (response.status === 200) {
        loadProducts(response.data);
      } else {
        swal("Något gick fel vid inläsning av produkter");
      }
    })
    .catch((err) => {
      alert("Serverfel!" + err);
    });

  function loadProducts(data) {
    console.log("inne i load products");
    console.log(data);
    products = data;
  }

  function sortNamesAscending() {
    console.log("Sortera a-ö");
    products.sort(function(a, b){
      if(a.title < b.title) { return -1; }
      if(a.title > b.title) { return 1; }
      return 0;
  })
    console.log(products);
    renderProducts(products)
  }

  function sortNamesDecending() {
    console.log("Sortera ö-a");
    products.sort(function(a, b){
      if(a.title < b.title) { return -1; }
      if(a.title > b.title) { return 1; }
      return 0;
    })
    products = products.reverse();
    console.log(products);
    renderProducts(products)
  }

  function sortPriceAscending() {
    console.log("Pris lågt till högt");
    products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    console.log(products);
    renderProducts(products)
  }

  function sortPriceDecending() {
    console.log("Pris högt till lågt");
    products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    products = products.reverse();
    console.log(products);
    renderProducts(products)
  }
  sortNamesAscending(products);
  sortNamesDecending(products);
  sortPriceAscending(products);
  sortPriceDecending(products);

  $("#name-ascending").on("click", function(){
    sortNamesAscending()
   })
   $("#name-descending").on("click", function() {
    sortNamesDecending()
   })
   $("#price-ascending").on("click", function() {
    sortPriceAscending()
   })
   $("#price-descending").on("click", function() {
    sortPriceDecending()
   })

   function renderProducts(list) {
    $("#products").empty()
      list.forEach(element => {
          $("#products").append(`
          <div class="product-card">
                <div id="${element.productNr}">
                  <div class="img-container">
                    <img src="${element.image}" alt="img" class="product-card-img">
                  </div>
                  <div class="product-card-text">
                    <h3 class="card-title">${element.title}</h3>
                    <h5 class="card-price">${element.price} kr</h5>
                    <p id="${element.description}"class="card-text">Mer info om produkten</p>
                    <div class="add-subtract-container">
                        <div class="subtract-btn">
                          <div class="reduce1btn">-</div>
                        </div>
                        <div  class="quantity">
                          <input type="text" maxlength="2" value="1" class="amount${element.productNr} amount">
                        </div>
                        <div class="add-btn">
                          <div class="add1btn">+</div>
                        </div>
                    </div>
                    <div class="add-product-to-cart-container">
                      <button class="add-product-to-cart" style="margin-top: 5%">Köp</button>
                    </div>
                  </div>
                </div>
              </div>  
          `
          );
        });
  
        $("#cartDropdown").on("click", function(){
          renderCart();
        })
  
        $.each($('.add-product-to-cart'),function( index, value ) {
          value.addEventListener('click',(e) => {
            products.forEach(product => {
              if(product.productNr === e.target.parentElement.parentElement.parentElement.id){
                product.inCart = Number(e.target.parentElement.parentElement.children[3].children[1].children[0].value) //Ger denna rätt antal i varukorgen?
                e.target.parentElement.parentElement.children[3].children[1].children[0].value = 1
                saveProductToCart(product)
                saveTotalPrice(product)
                updateTotalCartUI()
                setCartAvailability();
              }
            })
          })
        })
  
        $.each($('.amount'), function(index, value) {
          value.addEventListener('focusout', (e) => {
            if(e.target.value == 0 || isNaN(e.target.value)){
              e.target.value = 1
            }
          })
        })
        
        $.each($('.add1btn'),function( index, value ) {
          value.addEventListener('click',(e) => {
            products.forEach(product => {
              console.log();
              if(product.productNr === e.target.parentElement.parentElement.parentElement.parentElement.id){
                console.log(e.target.parentElement.parentElement.children[1].children[0].value);
                let currentValue= Number(e.target.parentElement.parentElement.children[1].children[0].value) +1;
                if(currentValue<99){
                  e.target.parentElement.parentElement.children[1].children[0].value = currentValue;
                }              
              }
            })
          })
        })
        $.each($('.reduce1btn'),function( index, value ) {
          value.addEventListener('click',(e) => {
            products.forEach(product => {
              if(product.productNr === e.target.parentElement.parentElement.parentElement.parentElement.id){
                console.log(e.target.parentElement.parentElement.children[1].children[0].value);
                let currentValue= Number(e.target.parentElement.parentElement.children[1].children[0].value) -1;
                if(currentValue>=1){
                  e.target.parentElement.parentElement.children[1].children[0].value = currentValue;
                }         
              }
            })
          })
        })
  
        //------------------------------- product-card-modal ----------------------------------\\
  
        $.each($('.card-text'),function(index,value) {
          value.addEventListener('click', () => {
            $('#product-card-modal').modal('show')
          })
        })
  
        $.each($('.product-card-img'),function(index,value) {
          value.addEventListener('click', () => {
            $('#product-card-modal').modal('show')
          })
        })
  
  }

});
