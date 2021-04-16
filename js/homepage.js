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

const addUserUrl = "http://localhost:8080/users/add"

/**
 * Eventlistener
 */

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
  }
})

$('form').submit(false)

$(document).ready(load)

    function load() {
        const productsUrl = './TestData/test_data_products_v1.2.JSON'
       // const productsUrl = 'http://localhost:8080/products'
       axios.get(productsUrl)
       .then(response => {
         render(response.data)
       })
       .catch(err => {
         alert(err)
       })
    }

    function render(data) {
      let customer = sessionStorage.getItem("customer") || "";
      if(customer.length>0){
        navLoginBtn.text("Logga ut");
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
              saveTotalPrice(product)
              updateTotalCartUI()
              renderCart()
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

/**
 * Saves the price of the product to localStorage and 
 * adds the value if there are a value in localStorage allready
 * @param {object} product 
 */
function saveTotalPrice(product) {
  let totalPrice = JSON.parse(localStorage.getItem('cartTotalPrice'))
  totalPrice != null ? localStorage.setItem('cartTotalPrice', totalPrice + product.price) : localStorage.setItem('cartTotalPrice', product.price);
}

function updateTotalCartUI(){
  $('#total-items-in-cart').text(JSON.parse(localStorage.getItem("cartQuantity")))
}

//------------------------------------- login ----------------------------------\\

$('#login-button').click(() => {
  let url = `http://localhost:8080/users/checkCredentials?email=${emailToCheck.val()}&password=${passwordToCheck.val()}`

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
          "cityName": city.val()
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




