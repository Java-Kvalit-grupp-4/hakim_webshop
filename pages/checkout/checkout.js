
let products = [];

function load() {
    let cartTestUrl = '../../TestData/test_data_cart.JSON'
    fetch(cartTestUrl)
      .then((response) => response.json())
      .then((data) => renderCart(data))
      .catch((error) => console.error(error));
  }

  /**
   * Loads products in cart form localstorage 
   * @returns array
   */
  function getCartFromLocalStorage(){
      let cart = JSON.parse(localStorage.getItem('cart'))
      return cart;
  }

  /**
   * Render data from array to the UI
   * @param {Array} data array of products
   */
  function renderCart(data) {
    let cart = document.getElementById('cart-container');
    cart.innerHTML = ''
    products = data;
    products.forEach(e => {
            cart.innerHTML += `<div class="row pt-2 line-item-border">
                      <div class="col col-xs-3 col-lg-3 cart-line-item"><p>${e.productNummer}</p></div>
                      <div class="col col-xs-2 col-lg-4 cart-line-item"><p>${e.title}</p></div>
                      <div class="col col-xs-1 col-lg-1 cart-line-item"><p class="line-item-total-quantity">${e.inCart}</p></div>
                      <div class="col col-xs-2 col-lg-2 cart-line-item"><p>${e.price.toFixed(2)}</p></div>
                      <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(e.price * e.inCart).toFixed(2)}</p></div>
                    </div>`;
        })

    let totalPrice = 0;
    document.querySelectorAll('.line-item-total-price').forEach(e => totalPrice += parseFloat(e.innerText))
    document.getElementById('cart-total-price').innerText = totalPrice;

    let totalInCart = 0;
    document.querySelectorAll('.line-item-total-quantity').forEach(e => totalInCart += parseInt(e.innerText))
    document.getElementById('cart-total-quantity').innerText = totalInCart;
}

const addressToggle = document.getElementById('gridCheck')
addressToggle.addEventListener('click', e => {
    if(e.target.checked){
        getAddressInfo();
    }else {
        clearAddressInfo()
    }
})

/**
 * Set values for second address fields
 */
function getAddressInfo(){
    $('#address2').val($('#address').val());
    $('#zip2').val($('#zip').val());
    $('#city2').val($('#city').val());
}

/**
 * Clear values for second address fields
 */
function clearAddressInfo(){
    $('#address2').val('');
    $('#zip2').val('');
    $('#city2').val('');

    $('#address2').css("border", "1px solid #ced4da")
    $('#zip2').css("border", "1px solid #ced4da")
    $('#city2').css("border", "1px solid #ced4da")
}

/**
 * Gets all customers from database
 */
function getLoggedInCustomer(){
    let cartTestUrl = '../../TestData/testdata_persons.JSON'
    fetch(cartTestUrl)
      .then((response) => response.json())
      .then((data) => renderCustomerInfo(data))
      .catch((error) => console.error(error));

}

/**
 * Checks witch customer that is logged in
 * and render that data to the UI
 * @param {Array} data customers from the databas
 */
function renderCustomerInfo(data) {
   // alert("Th logged in customer is Kalle Anka")
    let loggedInCustomer =  data[0]

    $('#firstName').val(loggedInCustomer.first_name);
    $('#lastName').val(loggedInCustomer.last_name);
    $('#email').val(loggedInCustomer.email);
    $('#phone').val(loggedInCustomer.phone_number);
    $('#address').val(loggedInCustomer.adress);
    $('#zip').val(loggedInCustomer.city.zipcode);
    $('#city').val(loggedInCustomer.city.name);
}

function clearAllInputFields() {
    $('#firstName').val(''),
    $('#lastName').val(''),
    $('#email').val(''),
    $('#phone').val(''),
    $('#address').val(''),
    $('#zip').val(''),
    $('#city').val(''),
    $('#address2').val(''),
    $('#city2').val(''),
    $('#zip2').val('');

    $('#firstName').css("border", "1px solid #ced4da"),
    $('#lastName').css("border", "1px solid #ced4da"),
    $('#email').css("border", "1px solid #ced4da"),
    $('#phone').css("border", "1px solid #ced4da"),
    $('#address').css("border", "1px solid #ced4da"),
    $('#zip').css("border", "1px solid #ced4da"),
    $('#city').css("border", "1px solid #ced4da"),
    $('#address2').css("border", "1px solid #ced4da"),
    $('#city2').css("border", "1px solid #ced4da"),
    $('#zip2').css("border", "1px solid #ced4da");
}




document.getElementById('send-order-btn').addEventListener('click',() => {
    let firstName = $('#firstName').val(),
    lastName = $('#lastName').val(),
    email = $('#email').val(),
    phone = $('#phone').val(),
    address = $('#address').val(),
    zip = $('#zip').val(),
    city = $('#city').val(),
    address2 = $('#address2').val(),
    city2 = $('#city2').val(),
    zip2 = $('#zip2').val();

    // for testing under here
    let bool = true

    if(testForOnlyText(firstName) && firstName != '') {
        $('#firstName').css("border", "2px solid green")
    }else{
        bool = false
        $('#firstName').css("border", "2px solid red")
    }

    if(testForOnlyText(lastName) && lastName != '') {
        $('#lastName').css("border", "2px solid green")
    }else{
        bool = false
        $('#lastName').css("border", "2px solid red")
    }

    if(testForEmail(email) && email != ''){
        $('#email').css("border", "2px solid green")
    }else{
        bool = false
        $('#email').css("border", "2px solid red")
    }

    if(testForNumbersOnly(phone) && phone != ''){
        $('#phone').css("border", "2px solid green")
    }else{
        bool = false
        $('#phone').css("border", "2px solid red")
    }

    if(testForAddress(address) && address != ''){
        $('#address').css("border", "2px solid green")
    }else{
        bool = false
        $('#address').css("border", "2px solid red")
    }
    
    if(testForZipCode(zip) && zip != ''){
        $('#zip').css("border", "2px solid green")
    }else{
        bool = false
        $('#zip').css("border", "2px solid red")
    }

    if(testForOnlyText(city) && city != ''){
        $('#city').css("border", "2px solid green")
    }else{
        bool = false
        $('#city').css("border", "2px solid red")
    }
    
    
    if($("#gridCheck")[0].checked){
        console.log('checked');

        if(testForAddress(address2) && address2 != ''){
            $('#address2').css("border", "2px solid green")
        }else{
            bool = false
            $('#address2').css("border", "2px solid red")
        }
        
        if(testForZipCode(zip2) && zip2 != ''){
            $('#zip2').css("border", "2px solid green")
        }else{
            bool = false
            $('#zip2').css("border", "2px solid red")
        }
    
        if(testForOnlyText(city2) && city2 != ''){
            $('#city2').css("border", "2px solid green")
        }else{
            bool = false
            $('#city2').css("border", "2px solid red")
        } 

    }else{
        console.log('not checked');
        $('#address2').css("border", "1px solid #ced4da")
        $('#zip2').css("border", "1px solid #ced4da")
        $('#city2').css("border", "1px solid #ced4da") 
    }
    
    if(bool) {
        swal({
            title: "Tack för din order!",
            text: `
            \nLeverans adress
            \n${address}
            \n${city}
            \n${zip}`,
            icon: "success",
            button: "Ok",
          });
          clearAllInputFields();
                // todo logga beställningar med överstående adress
                // tömma localStorage från varukorg och rendera tom varukorg för kund
    }else{
        swal({
            title: "Ops, något gick fel!",
            text: "Alla fält måste vara ifyllda korrekt",
            icon: "warning",
            button: "Ok",
          });
        
    }
});


load();
getLoggedInCustomer();

