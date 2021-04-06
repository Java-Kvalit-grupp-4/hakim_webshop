
$(document).ready(run)

function run() {
    getCart()
    getLoggedInCustomer()

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
        address2 = $('#address2'),
        city2 = $('#city2'),
        zip2 = $('#zip2');

    /**
     * Eventlistiners
     */
    $('#gridCheck').click(e => e.target.checked ? getAddressInfo() : clearAddressInfo())
    $('#send-order-btn').click(validateInput)

    function getCart() {
            let data = getCartFromLocalStorage()
            renderCart(data)
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
    let cart = $('#cart-container')
    cart.html('')
    $.each(data, (index, e) => {
        cart.append(`
        <div class="row pt-2 line-item-border">
            <div class="col col-xs-3 col-lg-3 cart-line-item"><p>${e.productNr}</p></div>
            <div class="col col-xs-2 col-lg-4 cart-line-item"><p>${e.title}</p></div>
            <div class="col col-xs-1 col-lg-1 cart-line-item"><p class="line-item-total-quantity">${e.inCart}</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p>${e.price.toFixed(2)}</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(e.price * e.inCart).toFixed(2)}</p></div>
        </div>
        `)
    })

    let totalPrice = 0;
    $.each($('.line-item-total-price'),(index, e) => totalPrice += parseFloat(e.innerText))
    $('#cart-total-price').text(totalPrice);

    let totalInCart = 0;
    $.each($('.line-item-total-quantity'),(index, e) => totalInCart += parseInt(e.innerText))
    $('#cart-total-quantity').text(totalInCart);
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
        /**
         * remove this when testing is over
         * cause the loggedInUser is allready saved 
         * in localstorage when the customer loggs in
         */
        localStorage.setItem('loggedInUser', JSON.stringify(data[0]))
 
        let loggedInCustomer =  JSON.parse(localStorage.getItem('loggedInUser'))

        firstName.val(loggedInCustomer.first_name);
        lastName.val(loggedInCustomer.last_name);
        email.val(loggedInCustomer.email);
        phone.val(loggedInCustomer.phone_number);
        address.val(loggedInCustomer.adress);
        zip.val(loggedInCustomer.city.zipcode);
        city.val(loggedInCustomer.city.name);
    }

    /**
     * Set values for second address fields
     */
    function getAddressInfo(){
        address2.val(address.val());
        zip2.val(zip.val());
        city2.val(city.val());
    }

    /**
     * Clear values for second address fields
     */
    function clearAddressInfo(){
        address2.val('')
        zip2.val('')
        city2.val('')

        resetBorder(address2)
        resetBorder(zip2)
        resetBorder(city2)
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
        address2.val('')
        city2.val('')
        zip2.val('')

        resetBorder(firstName)
        resetBorder(lastName)
        resetBorder(email)
        resetBorder(phone)
        resetBorder(address)
        resetBorder(zip)
        resetBorder(city)
        resetBorder(address2)
        resetBorder(city2)
        resetBorder(zip2)

        $("#gridCheck")[0].checked = null
    }

    /**
     * Validates the inputfields and changes color of the 
     * border of the inputfield according to the answer
     * true(green)/false(red) and gives the correct message
     * to the user
     */
    function validateInput () {    
        // for testing under here
        let bool = true

        bool = checkForInput(testForOnlyText, firstName, bool)
        bool = checkForInput(testForOnlyText, lastName, bool)
        bool = checkForInput(testForEmail, email, bool)
        bool = checkForInput(testForNumbersOnly,phone, bool)
        bool = checkForInput(testForAddress, address, bool)
        bool = checkForInput(testForZipCode, zip, bool)
        bool = checkForInput(testForOnlyText, city,bool)
        bool = checkForInput(testForAddress, address2, bool)
        bool = checkForInput(testForZipCode, zip2, bool)
        bool = checkForInput(testForOnlyText, city2,bool)
                
        if(bool) {
            if($("#gridCheck")[0].checked){
                swal({
                    title: "Tack för din order!",
                    text: `
                    \nLeverans adress
                    \n${address.val()}
                    \n${city.val()}
                    \n${zip.val()}`,
                    icon: "success",
                    button: "Ok",
                  });
            }else{
                swal({
                    title: "Tack för din order!",
                    text: `
                    \nLeverans adress
                    \n${address2.val()}
                    \n${city2.val()}
                    \n${zip2.val()}`,
                    icon: "success",
                    button: "Ok",
                  });
            }
              clearAllInputFields()
                    // todo logga beställningar med överstående adress
                    // tömma localStorage från varukorg och rendera tom varukorg för kund
        }else{
            swal({
                title: "Ops, något gick fel!",
                text: "Alla fält måste vara ifyllda korrekt",
                icon: "warning",
                button: "Ok",
              }) 
        }
    }
}


