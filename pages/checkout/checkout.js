
$(document).ready(run)

function run() {
    
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
        let zipCode = `${loggedInCustomer.zipCode.substring(0,3)} ${loggedInCustomer.zipCode.substring(3)}`
        let phoneNumber = `${loggedInCustomer.phoneNumber.substring(0,3)}-${loggedInCustomer.phoneNumber.substring(3,6)} ${loggedInCustomer.phoneNumber.substring(6,8)} ${loggedInCustomer.phoneNumber.substring(8)}`
        
        firstName.val(loggedInCustomer.firstName);
        lastName.val(loggedInCustomer.lastName);
        email.val(loggedInCustomer.email);
        phone.val(phoneNumber);
        address.val(loggedInCustomer.streetAddress);
        zip.val(zipCode);
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
            localStorage.clear()
            renderCart()
        }else{
            swal({
                title: "Ops, något gick fel!",
                text: "Alla fält måste vara ifyllda korrekt",
                icon: "warning",
                button: "Ok",
              }) 
        }
    }

    getCart()
    renderCustomerInfo()
}


