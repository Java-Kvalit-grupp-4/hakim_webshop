
$(document).ready(() => {

    
    let customer = JSON.parse(sessionStorage.getItem('customer'))
    if(customer==null || customer== undefined){
        // comment this if you wanna go to checkout without being logged in
        window.location.href = "../../"
        
        
    }
    //getCart() Vad gör denna?? Hittar den inte någon stanns och man får en syntax error pga den

    /**
     * Cache variables
     */
 let firstName = $('#firstName'),
 lastName = $('#lastName'),
 email = $('#email'),
 phone = $('#phone'),
 address = $('#address'),
 zip = $('#zip'),
 city = $('#city'),
 orderComment = $('#order-comment')

 let FIRSTNAME_ERROR_MSG = $('#FIRSTNAME_ERROR_MSG'),
            LASTNAME_ERROR_MSG = $('#LASTNAME_ERROR_MSG'),
            EMAIL_ERROR_MSG = $('#EMAIL_ERROR_MSG'),
            PHONE_NUMBER_ERROR_MSG = $('#PHONE_NUMBER_ERROR_MSG'),
            ADDRESS_ERROR_MSG = $('#ADDRESS_ERROR_MSG'),
            ZIPCODE_ERROR_MSG = $('#ZIPCODE_ERROR_MSG'),
            CITY_ERROR_MSG = $('#CITY_ERROR_MSG')

 /**    
  *  Eventlistiners
  */
 $('#send-order-btn').click(validateInput)
    
    //let customer = JSON.parse(sessionStorage.getItem('customer'))
    if(customer==null || customer== undefined){
        // comment this if you wanna go to checkout without being logged in
        //window.location.href = "../../"
    }
    renderCart()
    renderCustomerInfo()

    /**
     * Render data from array to the UI
     * @param {Array} data array of products
     */
 function renderCart() {
    let cartData = JSON.parse(localStorage.getItem('cart'))
    let cart = $('#cart-container')
    cart.html('')
    $.each(cartData, (index, e) => {
        cart.append(`
        <div class="row pt-2 line-item-border">
            <div class="col col-xs-3 col-lg-3 cart-line-item"><p>${e.sku}</p></div>
            <div class="col col-xs-2 col-lg-4 cart-line-item"><p>${e.title}</p></div>
            <div class="col col-xs-1 col-lg-1 cart-line-item"><p class="line-item-total-quantity">${e.inCart}</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p>${e.price.toFixed(2)} kr</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(e.price * e.inCart).toFixed(2)} kr</p></div>
        </div>
        `)
    })

let totalPrice = 0;
$.each($('.line-item-total-price'),(index, e) => totalPrice += parseFloat(e.innerText))
$('#cart-total-price').text(totalPrice.toFixed(2));

let totalInCart = 0;
$.each($('.line-item-total-quantity'),(index, e) => totalInCart += parseInt(e.innerText))
$('#cart-total-quantity').text(totalInCart);
let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))
document.getElementById("total-items-in-cart").innerHTML = cartQuantity
}

/**
 * Checks witch customer that is logged in
 * and render that data to the UI
 * @param {Array} data customers from the databas
 */
function renderCustomerInfo() {
    
    let loggedInCustomer =  JSON.parse(sessionStorage.getItem('customer'))

    firstName.val(formatFirstLetterToUpperCase(loggedInCustomer.firstName))
    lastName.val(formatFirstLetterToUpperCase(loggedInCustomer.lastName))
    email.val(loggedInCustomer.email)
    phone.val(formatPhoneNumber(loggedInCustomer.phoneNumber))
    address.val(formatFirstLetterToUpperCase(loggedInCustomer.streetAddress))
    zip.val(formatZipCode(loggedInCustomer.zipCode))
    city.val(formatFirstLetterToUpperCase(loggedInCustomer.city.name))
}

/**
     * Validates the inputfields and changes color of the 
     * border of the inputfield according to the answer
     * true(green)/false(red) and gives the correct message
     * to the user
     */
 function validateInput () {    
    let bool = true

    bool = checkForInput(testForOnlyText, firstName, bool,FIRSTNAME_ERROR_MSG)
    bool = checkForInput(testForOnlyText, lastName, bool,LASTNAME_ERROR_MSG)
    bool = checkForInput(testForEmail, email, bool,EMAIL_ERROR_MSG)
    bool = checkForInput(testForPhoneNumber,phone, bool,PHONE_NUMBER_ERROR_MSG)
    bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
    //bool = checkForInput(testForZipCode, zip, bool,ZIPCODE_ERROR_MSG)
    bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
            
    if(bool) {
            console.log(makeOrderObject())
            sendOrderToServer(makeOrderObject())
            localStorage.clear()
            
            renderCart()
            swal({
                title: "Din beställning har lagts",
                text: "Tack för att du handlar hos Hakim Livs",
                icon: "success",
                button: "Ok",
              }) 
    }else{
        swal({
            title: "Ops, något gick fel!",
            text: "Alla fält måste vara ifyllda korrekt",
            icon: "warning",
            button: "Ok",
          }) 
    }
}

/**
 * Resets all inputfields and checkbox
*/
 function clearAllInputFields() {
    firstName.val('')
    lastName.val('')
    email.val('')
    phone.val('')
    address.val('')
    zip.val('')
    city.val('')
    
    resetBorder(firstName)
    resetBorder(lastName)
    resetBorder(email)
    resetBorder(phone)
    resetBorder(address)
    resetBorder(zip)
    resetBorder(city)
}

function makeOrderObject(){
    let cart = JSON.parse(localStorage.getItem('cart'))
    let orderCommentInput =  orderComment.text()
    let lineItems = []

    // create lineItems for database
    $.each(cart, (index, e) => {
        let lineItem = {
            "product": {
                "sku": e.sku
             },
            "quantity": e.inCart,
            "itemPrice": (e.price * e.inCart).toFixed(2)
        }
        lineItems.push(lineItem)
    })
    
    let orderObject = {
        "appUser": {
          "email": email.val()
          },
        "orderComment": orderCommentInput,
        "totalCost": parseFloat($('#cart-total-price').text()),
        "isPaid": false,
        "orderStatus": {
          "type": "ohanterad"
        },
        "lineItems": lineItems
      }

    return orderObject
}

function sendOrderToServer(orderObject){
    //const url = 'https://hakimlivs.herokuapp.com/customerOrder/add'
   const url = 'https://hakimlogintest.herokuapp.com/customerOrder/add'
   //const url = 'http://localhost:8080/customerOrder/add'

   console.log(orderObject);
   axios.post(url,orderObject)
   .then(response => {
       if(response.status == 200){
           console.log(response);
           swal({
               title: "Tack för din order!",
               text: `
               \nLeverans adress
               \n${address.val()}
               \n${city.val()}
               \n${zip.val()}`,
               icon: "success",
               button: "Ok",
             })
             clearAllInputFields()
       }
       
   })
   .catch(err => console.log('>> error from server: ' + err))
}

})


