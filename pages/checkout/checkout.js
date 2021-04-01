
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
        console.log('checked')
        getAddressInfo();
    }else {
        console.log('not checked')
        clearAddressInfo()
    }
})

/**
 * Set values for second address fields
 */
function getAddressInfo(){
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
    document.getElementById('address2').value = ''
    document.getElementById('zip2').value = ''
    document.getElementById('city2').value = ''
}

document.getElementById('send-order-btn').addEventListener('click',() => {
    let firstName = document.getElementById('firstName').value,
    lastName = document.getElementById('lastName').value,
    email = document.getElementById('email').value,
    phoneNumber = document.getElementById('phone').value,
    address = document.getElementById('address').value,
    zip = document.getElementById('zip').value,
    city = document.getElementById('city').value,
    address2 = document.getElementById('address2').value,
    city2 = document.getElementById('city2').value,
    zip2 = document.getElementById('zip2').value;

    if(testForOnlyText(firstName)) {
        console.log(firstName + ' true')
    }else{
        console.log(firstName + ' false')
    }

    if(testForOnlyText(lastName)) {
        console.log(lastName + ' true')
    }else{
        console.log(lastName + ' false')
    }

    if(testForEmail(email)){
        console.log(email + ' true')
    }else{
        console.log(email + ' false')
    }

    if(testForNumbersOnly(phoneNumber)){
        console.log(phoneNumber + ' true')
    }else{
        console.log(phoneNumber + ' false')
    }

    if(testForAddress(address)){
        console.log(address + ' true')
    }else{
        console.log(address + ' false')
    }
    
    if(testForZipCode(zip)){
        console.log(zip + ' true')
    }else{
        console.log(zip + ' false')
    }

    if(testForOnlyText(city)){
        console.log(city + ' true')
    }else{
        console.log(city + ' false')
    }
    
    if(testForAddress(address2)){
        console.log(address + ' true')
    }else{
        console.log(address + ' false')
    }
    
    if(testForZipCode(zip2)){
        console.log(zip + ' true')
    }else{
        console.log(zip + ' false')
    }

    if(testForOnlyText(city2)){
        console.log(city + ' true')
    }else{
        console.log(city + ' false')
    }

    
});

load();


