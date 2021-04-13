let products = [];
let persons = [];
let password = $('#login-password');
let email =$('#login-email');
let loginButton1 = $('#login-btn');
let loginbutton2 = $('#login-button');
let wrongEmail = $('#wrong-email')
let wrongPassword = $('#wrong-password')
let personsFile = "../../TestData/testdata_persons.json";
let loginModal = $('#login-modal');
let whichPage = $("#login-page");

    $(document).ready(load)

    function load() {
        fetch("./TestData/test_data_products_v1.2.JSON")
        .then((response) => response.json())
        .then((data) => render(data))
        .catch((error) => console.error(error));
    }

    function render(data) {
      let customer = sessionStorage.getItem("customer") || "";
      if(customer.length>0){
        loginButton1.text("Logga ut");
        $('#myAccountDropdown').show()
      }else{
        $('#myAccountDropdown').hide()
      }
      products = data;

      getProducts(products);
     
      let categories = [];
      products.forEach(element => {
        categories.push(element.category)
      });

      let uniqueCategories = [...new Set(categories)];

      uniqueCategories.forEach(element => {
      $("#sidomeny").append(`
          <button id= "${element}" type="button" class="list-group-item list-group-item-action fs-4" style="background-color:wheat ;">${element}</button>`
      );
    });

    $("#sidomeny button").on("click", function () {
      let btnId = $(this).attr("id");
      let list = [];
      products.forEach(element => {
        if (element.category == btnId) {
          list.push(element);
          $("#products").empty();
            getProducts(list);
        }
        if(btnId === "all"){
          $("#products").empty();
          getProducts(products);
        }
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
              <h3 class="card-title" style="font-weight: bold;">${element.title}</h3>
              <h4 class="card-subtitle mb-4 text-muted">${element.price} kr</h4>
              <h5 class="card-text pb-4 px-3">${element.description}</h5>
              <div class="align-self-end" style="margin-top: auto; margin-left: auto; margin-right: auto">
                  <button type="button" class="btn btn-outline-dark reduce1btn d-inline me-1" >-</button>
                  <div id="amount" class="d-inline amount${element.productNr}">1</div>
                  <button type="button" class="btn btn-outline-dark add1btn d-inline ms-1">+</button>
                  <button id="btn1" type="button" class="btn btn-lg btn-block btn-outline-dark align-self ms-5 add-product-to-cart" style="margin-top: auto">Lägg till</button></p>
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
              product.inCart =Number (document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent); //Ger denna rätt antal i varukorgen?
              console.log(product.inCart);
              saveProductToCart(product)
              saveTotalPrice(product)
              updateTotalCartUI()
              renderCart()

            }
          })
        })
      })
      
      $.each($('.add1btn'),function( index, value ) {
        value.addEventListener('click',(e) => {
          products.forEach(product => {
            if(product.productNr === e.target.parentElement.parentElement.parentElement.id){

              let currentValue= Number(document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent) +1;
              if(currentValue<99){
                document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent = currentValue;
              }
              else{
                document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent = 99;
                //TODO: Varning att det är för många
              }
              
            }
          })
        })
      })
      $.each($('.reduce1btn'),function( index, value ) {
        value.addEventListener('click',(e) => {
          products.forEach(product => {
            if(product.productNr === e.target.parentElement.parentElement.parentElement.id){

              let currentValue= Number(document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent) -1;
              if(currentValue>1){
                document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent = currentValue;
              }
              else{
                document.querySelector(`.amount${e.target.parentElement.parentElement.parentElement.id}`).textContent = 1;
                //TODO: Varning att det är för få?
              }
              
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
  let tempQuantityToAdd = Number(product.inCart)

  if(cart != null){
    let productToFind = cart.find(e => e.productNr == product.productNr)
    let index = cart.findIndex(e => e.productNr == product.productNr)
    if(productToFind == undefined){
      product.inCart = product.inCart
      cartQuantity += tempQuantityToAdd
      cart.push(product)
    }else{
      console.log(index);
      cart[index].inCart += product.inCart
      cartQuantity += tempQuantityToAdd
    }
  }else{
    cart = [] 
    product.inCart = product.inCart
    cartQuantity = tempQuantityToAdd
    cart.push(product)
  }
  
  localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity))
  localStorage.setItem('cart', JSON.stringify(cart))
  $("#cart-counter").text(cartQuantity)
}

/**
 * Saves the price of the product to localStorage and 
 * adds the value if there are a value in localStorage allready
 * @param {object} product 
 */
function saveTotalPrice(product) {
  console.log(product);
  let totalPrice = JSON.parse(localStorage.getItem('cartTotalPrice'))
  totalPrice != null ? localStorage.setItem('cartTotalPrice', totalPrice + product.price) : localStorage.setItem('cartTotalPrice', product.price);
}

function updateTotalCartUI(){
  $('#total-items-in-cart').text(JSON.parse(localStorage.getItem("cartQuantity")))
}

/**
 * Opens login-popup if no one is logged in or remove session storage if someone is logged in.
 */
$("#login-btn").on("click", function() {
  if($(this).text()=="Logga in"){
      $("#login-modal").modal("show");
  }
  else{
      sessionStorage.removeItem("customer")
      $('#myAccountDropdown').hide()
      $(this).text("Logga in")
  }
});


/**
 * Hides text if email input is focused. 
 */
email.on('focus', function() {
    wrongEmail.html('');
})

/**
 * Hides text if password input is focused. 
 */
password.on('focus', function() {
    wrongPassword.html('');
})

$("#show-password-button").on("click", showHidePassword);

loginbutton2.on("click",checkUsernameAndPassword);

/**
 * Saves all cutomers from json-file in an array.
 */
$.getJSON(personsFile, function(response) {
    console.log(response);
    persons = response;
})


/**
 * Function to show/hide password
 */
function showHidePassword(){
    if($(this).text()=="Visa"){
        $(this).text("Dölj")
        password.attr("type", "text");
    }
    else{
        $(this).text("Visa")
        password.attr("type", "password");   
    }
}

/**
 * function that decides what will happen if username and password is correct/incorrect. 
 */
function checkUsernameAndPassword(){
    let isCustomer= findUser(email.val());
    if(isCustomer){
        let isCorrectPassword = findPassword(password.val());
        if(isCorrectPassword){
          loginButton1.text("Logga ut");
          loginModal.modal("hide");
            let customer = JSON.parse(sessionStorage.getItem("customer"))
            if(customer.admin=="false"){
                if(customer.vip == "false"){
                    console.log("Du är inloggad som vanlig kund")
                }
                else{
                    console.log("Du är inloggad som VIP kund")
                }
                $('#myAccountDropdown').show()
            }
            else{
                console.log("Du är inloggad som admin")
                location.replace("admin/index.html")
            }
        }
        else {
            wrongPassword.html("Fel lösenord")
        }
    }
    else{
        wrongEmail.html("Den email-adressen finns inte registrerad");
    }
    
}

/**
 * function to find if username is in the json file. 
 * @param {String} input 
 * @returns boolean
 */
function findUser(input){
    let isTrue = false;
    persons.forEach(e => {
        if(e.email== input){
            sessionStorage.setItem("customer", JSON.stringify(e));
            isTrue = true;
        }
    });
    return isTrue;
}

/**
 * function to find is password is correct/incorrect.
 * @param {String} password 
 * @returns boolean
 */
function findPassword(password){
    console.log(password);
    let customer = JSON.parse(sessionStorage.getItem("customer"))
    let isTrue = false;
    if(customer.password==password){
        isTrue = true;
    }
    return isTrue;
}

/**
 * Opens registration popup
 */
$("#newCust-button").on("click",function(){
    $("#registerForm").modal("show");
})


