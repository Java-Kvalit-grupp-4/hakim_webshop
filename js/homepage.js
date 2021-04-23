let products = [];
let password = $('#login-password');
let email =$('#login-email');
let navLoginBtn = $('#login-btn');
let loginbutton2 = $('#login-button');
let wrongEmail = $('#wrong-email')
let wrongPassword = $('#wrong-password')
let whichPage = $("#login-page");

let emailToCheck = $('#login-email'),
passwordToCheck = $('#login-password'),
loginModal = $('#login-modal'),
myAccountMenu = $('#myAccountDropdown')

let adminview = $('#admin-view-link')

//const addUserUrl = "http://localhost:8080/users/add"


const addUserUrl = `https://hakimlivs.herokuapp.com/users/add`

//const addUserUrl = "https://hakimlivs.herokuapp.com/users/add"

/**
 * Eventlistener
 */C:

 $("#newCust-button").click(() => {
  $("#registerForm").modal("show")
 })

 $("#show-password-button").click(function(){
  if($(this).text()=="Visa"){
    $(this).text("Dölj")
    password.attr("type", "text");
  }
  else{
    $(this).text("Visa")
    password.attr("type", "password");   
  }
 })

 $("#login-btn").click(function() {
  if($(this).text()=="Logga in"){
      $("#login-modal").modal("show");
  }
  else{
      sessionStorage.removeItem("customer")
      $('#myAccountDropdown').hide()
      $(this).text("Logga in")
      adminview.hide()
  }
})

$('form').submit(false)


$(document).ready(() => {
  load()
  let loggedIn = sessionStorage.getItem('customer')
  if(loggedIn == undefined){
    adminview.hide()
  }else {
    if(loggedIn.isAdmin){
      adminview.show()
    }
  }
})

    function load() {
        //const productsUrl = './TestData/test_data_products_v1.2.JSON'
        //const productsUrl = 'http://localhost:8080/products'
        const productsUrl = 'https://hakimlivs.herokuapp.com/products'
       axios.get(productsUrl)
       .then(response => {
         renderCategories(response.data)
       })
       .catch(err => {
         alert(err)
       }) 
    }

    function renderCategories(data) {
      let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))
      let customer = sessionStorage.getItem("customer") || "";
      if(customer.length>0){
        navLoginBtn.text("Logga ut");
        $('#myAccountDropdown').show()
      }else{
        $('#myAccountDropdown').hide()
      }
      products = data;

      localStorage.setItem('categoryList', JSON.stringify(products));
      renderProducts(products);
     
      let categories = [];

      products.forEach(product => {
        product.categories.forEach(category => {
          categories.push(category.name)
        })
      })

      let uniqueCategories = [...new Set(categories)];

      uniqueCategories.forEach(element => {
              $("#sidomeny").append(`
                  <button id= "${element}" type="button" class="list-group-item list-group-item-action fs-4" style="background-color:wheat ;">${element}</button>`
              );
      });

      $("#total-items-in-cart").text(cartQuantity);
      setCartAvailability();

      $("#sidomeny button").on("click", function () {
        let categoryName = $(this).attr("id");
        let selectedCategoryList = [];

          products.forEach(product => {
            
            if(categoryName === "all"){
              $("#products").empty();
              renderProducts(products);
              localStorage.setItem('categoryList', JSON.stringify(products));
            }else{
              let currentProduct = product
              product.categories.forEach(category => {
                
                if (category.name == categoryName) {
                  selectedCategoryList.push(currentProduct);
                  $("#products").empty();
                    renderProducts(selectedCategoryList);
                    localStorage.setItem('categoryList', JSON.stringify(selectedCategoryList));
                }
              })
            }

        });

      });
}
/**
 * Render products to UI and adds functions to add-to-cart button
 * @param {Array} list of product 
 */
function renderProducts(list) {
  $("#products").empty()

    list.forEach(element => {
        $("#products").append(`
        <div class="product-card">
              <div id="${element.sku}">
                <div class="img-container">
                  <img src="${element.image}" alt="img" class="product-card-img">
                </div>
                <div class="product-card-text">
                  <h3 class="card-title">${element.title}</h3>
                  <h5 class="card-price">${element.price.toFixed(2)} kr</h5>
                  <p id="${element.description}"class="card-text">Mer info om produkten</p>
                  <div class="add-subtract-container">
                      <div class="subtract-btn">
                        <div class="reduce1btn">-</div>
                      </div>
                      <div  class="quantity">
                        <input type="text" maxlength="2" value="1" class="amount${element.sku} amount">
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
          
            if(product.sku == e.target.parentElement.parentElement.parentElement.id){

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
          
            if(product.sku == e.target.parentElement.parentElement.parentElement.parentElement.id){
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
            if(product.sku == e.target.parentElement.parentElement.parentElement.parentElement.id){
             
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
    let productToFind = cart.find(e => e.sku == product.sku)
    let index = cart.findIndex(e => e.sku == product.sku)
    if(productToFind == undefined){
      product.inCart = product.inCart
      cartQuantity += tempQuantityToAdd
      cart.push(product)
    }else{
      
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
  let totalPrice = JSON.parse(localStorage.getItem('cartTotalPrice'))
  totalPrice != null ? localStorage.setItem('cartTotalPrice', totalPrice + (product.price*product.inCart)) : localStorage.setItem('cartTotalPrice', (product.price*product.inCart));
}

function updateTotalCartUI(){
  $('#total-items-in-cart').text(JSON.parse(localStorage.getItem("cartQuantity")))
}

//------------------------------------- login ----------------------------------\\

$('#login-button').click(() => {
  let url = `https://hakimlivs.herokuapp.com/users/checkCredentials?email=${emailToCheck.val()}&password=${passwordToCheck.val()}`
  //let url = `https://hakimlogintest.herokuapp.com/users/checkCredentials?email=${emailToCheck.val()}&password=${passwordToCheck.val()}`

  axios.get(url)
    .then((response) => {
  
      if(response.status !== 200){
        swal('Fel email eller lösenord', '', 'warning')
        emailToCheck.val('')
        passwordToCheck.val('')
      }else {
        sessionStorage.setItem('customer', JSON.stringify(response.data))

        if(response.data.isAdmin == true){
          location.replace("admin/index.html")
        }else{
          loginModal.modal('hide')
          navLoginBtn.text('Logga ut')
          myAccountMenu.show()
        }
        
      } 
    })
    .catch(err => {
      alert('Server fel!')
    })
})

//---------------------------------- Regristration ---------------------------------\\
 

 let firstName = $('#register-first-name'),
 lastName = $('#register-last-name'),
 regristrationEmail = $('#register-email'),
 phoneNumber = $('#register-phone-number'),
 address = $('#register-street'),
 city = $('#register-city'),
 zipCode = $('#register-zip'),
 newPassword = $('#register-password'),
 confirmPassword = $('#register-confirm-password'),
 year = $('#register-year'),
 month = $('#register-month'),
 day = $('#register-day')

 let FIRSTNAME_ERROR_MSG = $('#FIRSTNAME_ERROR_MSG'),
 LASTNAME_ERROR_MSG = $('#LASTNAME_ERROR_MSG'),
 EMAIL_ERROR_MSG = $('#EMAIL_ERROR_MSG'),
 PHONE_NUMBER_ERROR_MSG = $('#PHONE_NUMBER_ERROR_MSG'),
 ADDRESS_ERROR_MSG = $('#ADDRESS_ERROR_MSG'),
 ZIPCODE_ERROR_MSG = $('#ZIPCODE_ERROR_MSG'),
 CITY_ERROR_MSG = $('#CITY_ERROR_MSG'),
 WRONNG_PASSWORD_ERROR_MSG = $('#WRONG_PASSWORD_ERROR_MSG'),
 NEW_PASSWORD_NOT_MATCH_ERROR_MSG = $('#NEW_PASSWORD_NOT_MATCH_ERROR_MSG'),
 NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $('#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG')


 /**
  * Eventlistener
  */

 $('#confirm-account').click(() => { 
  if(validateForm()) {
    resetsInputBorders()
    let data = {
      "firstName": firstName.val(), 
      "lastName": lastName.val(), 
      "phoneNumber": phoneNumber.val(), 
      "email": regristrationEmail.val(), 
      "streetAddress": address.val(), 
      "password": newPassword.val(),
      "socialSecurityNumber": year.val() + month.val() + day.val(), 
      "isAdmin": false,
      "isVip": false,
      "zipCode": zipCode.val(),
      "city":
        {
          "name": city.val()
        }
    }

    axios.post(addUserUrl,data)
      .then(() => {
        swal('Användare skapad!','Vänligen logga in', 'success')
          .then($('#registerForm').modal('hide'))
          .then(clearRegristrationForm)
      })
      .catch(() => {
        swal('Något fick fel!','Vänligen försök igen', 'warning')
      })
  }
})

/**
 * Functions
 */

 function hideAllErrorMsgs() {
  FIRSTNAME_ERROR_MSG.hide()
  LASTNAME_ERROR_MSG.hide()
  EMAIL_ERROR_MSG.hide()
  PHONE_NUMBER_ERROR_MSG.hide()
  ADDRESS_ERROR_MSG.hide()
  ZIPCODE_ERROR_MSG.hide()
  CITY_ERROR_MSG.hide()
  NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide()
  NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.hide()
  WRONNG_PASSWORD_ERROR_MSG.hide()
}

function resetsInputBorders() {
  resetBorder(firstName)
  resetBorder(lastName)
  resetBorder(regristrationEmail)
  resetBorder(newPassword)
  resetBorder(phoneNumber)
  resetBorder(address)
  resetBorder(zipCode)
  resetBorder(city)
}

function validateForm() {
  let bool = true

  bool = checkForInput(testForOnlyText, firstName, bool, FIRSTNAME_ERROR_MSG)
  bool = checkForInput(testForOnlyText, lastName, bool,LASTNAME_ERROR_MSG)
  bool = checkForInput(testForEmail, regristrationEmail, bool,EMAIL_ERROR_MSG)
  bool = checkForInput(testForNumbersOnly,phoneNumber, bool,PHONE_NUMBER_ERROR_MSG)
  bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
  bool = checkForInput(testForZipCode, zipCode, bool,ZIPCODE_ERROR_MSG)
  bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
  bool = checkForInput(testForPassword, newPassword, bool, WRONNG_PASSWORD_ERROR_MSG)
  
  bool = checkPassword(bool)
  return bool
}

function checkPassword(bool) {
  if(newPassword.val() !== confirmPassword.val()){
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG.show()
    return false;
  }else {
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide()
    return bool;
  }
}

function clearRegristrationForm() {
firstName.val('')
 lastName.val('')
 regristrationEmail.val('')
 phoneNumber.val('')
 address.val('')
 city.val('')
 zipCode.val('')
 newPassword.val('')
 confirmPassword.val('')
 year.val('')
 month.val('')
 day.val('')
}

hideAllErrorMsgs()








