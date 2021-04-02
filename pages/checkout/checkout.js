
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
byt ut till jquery

    let address = document.getElementById('address').value;
    let zipCode = document.getElementById('zip').value;
    let city = document.getElementById('city').value;
    console.log(document.getElementById('address'))
    document.getElementById('address2').value = address
    document.getElementById('zip2').value = zipCode
    document.getElementById('city2').value = city

}

/**
 * Clear values for second address fields
 */
function clearAddressInfo(){
    fixsa så value blir noll
    $('#address2').text('')
    document.getElementById('zip2').value = ''
    document.getElementById('city2').value = ''

    $('#address2').css("border", "1px solid #ced4da")
    $('#zip2').css("border", "1px solid #ced4da")
    $('#city2').css("border", "1px solid #ced4da")
}

document.getElementById('send-order-btn').addEventListener('click',() => {
    let firstName = document.getElementById('firstName').value,
    lastName = document.getElementById('lastName').value,
    email = document.getElementById('email').value,
    phone = document.getElementById('phone').value,
    address = document.getElementById('address').value,
    zip = document.getElementById('zip').value,
    city = document.getElementById('city').value,
    address2 = document.getElementById('address2').value,
    city2 = document.getElementById('city2').value,
    zip2 = document.getElementById('zip2').value;

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
        swal(`Tack för din order!
                \nLeverans adress
                \n${address}
                \n${city}
                \n${zip}`);
                // todo logga beställningar med överstående adress
                // tömma localStorage från varukorg och rendera tom varukorg för kund
    }else{
        swal(`Alla fält måste vara ifyllda korrekt`);
    }

    
});

load();


