

/**
 * Cache variables 
 * 
 */

$('form').submit(false)

let firstName = $('#my-info-first-name'),
lastName = $('#my-info-last-name'),
email = $('#my-info-email'),
phoneNumber = $('#my-info-phone-number'),
address = $('#my-info-address'),
city = $('#my-info-city'),
zipCode = $('#my-info-zipCode'),
oldPassword = $('#my-info-old-password'),
newPassword = $('#my-info-new-password'),
confirmPassword = $('#my-info-re-new-password'),
customer = JSON.parse(sessionStorage.getItem('customer'))

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

let findAllOrdersURL = "https://hakimlivs.herokuapp.com/customerOrder/getCustomerOrders?email="
let customerOrders=[];

/**
 * Eventlisteners
 */

$("#login-btn").click(function(){
    sessionStorage.removeItem("customer")
  })

$('#submit').click( () => { 
  if(validateForm()) {
    
    resetsInputBorders()
    
    let updateUserInfo = `https://hakimlivs.herokuapp.com/users/update/user/info`

    // let updateUserInfo = `https://hakimlogintest.herokuapp.com/users/update/user/info`

    //let updateUserInfo = `http://localhost:8080/users/update/user/info`

    // create object to update
    let updateInfo = {
      "firstName": firstName.val().trim(), 
      "lastName": lastName.val().trim(), 
      "phoneNumber": formatPhoneNumberForDB(phoneNumber.val().trim()), 
      "email": email.val().trim(),    
      "streetAddress": address.val(),
      "zipCode": formatZipForDB(zipCode.val().trim()),
      "city":
        {
          "name": city.val().trim()	
        }
    }

    axios.post(updateUserInfo,updateInfo)
    .then(response => {
      if(response.status == 200){
        swal("Informationen har sparats", "", "success")
        sessionStorage.setItem('customer', JSON.stringify(response.data))
      }  
    })
    .catch(err => {
      swal("Informationen har ej sparats", "Vänligen försök igen", "warning")
    })
  }
})

$('#change-password-btn').click(() => {
  checkPasswordChange()
})

$(document).on('click', '.orderNumber', showOrder);


  /**
   * Functions
   */

  function checkIfLoggedIn() {
    let customer = JSON.parse(sessionStorage.getItem('customer'))
    if(customer == undefined){
      $(document).load('./')
    }

  }

  function fillInputFieldsWithLoggedIn() {
    let customer = JSON.parse(sessionStorage.getItem('customer'))
    firstName.val(customer.firstName)
     //firstName.val(formatFirstLetterToUpperCasec)
     lastName.val(customer.lastName)
     //lastName.val(formatFirstLetterToUpperCase(customer.lastName))
     email.val(customer.email)
     phoneNumber.val(customer.phoneNumber)
     //phoneNumber.val(formatPhoneNumber(customer.phoneNumber))
     address.val(customer.streetAddress)
     //address.val(formatFirstLetterToUpperCase(customer.streetAddress))
     city.val(customer.city.name)
     //city.val(formatFirstLetterToUpperCase(customer.city.name))
     zipCode.val(customer.zipCode)
     //zipCode.val(formatZipCode(customer.zipCode))
  }

  function getAllOrders(){
    let email = JSON.parse(sessionStorage.getItem('customer')).email
    axios.get(findAllOrdersURL+ email)
        .then((response) =>{
            if(response.status ===200){
              customerOrders = response.data  
              fillOrderTable(response.data)
            }
            else{
                swal("Något gick fel vid inläsning av ordrar")
            }
        })
        .catch(err =>{
            alert("Server fel!" + err)
        })
  }

  function fillOrderTable(customerOrders){
      console.log(customerOrders)
      if(customerOrders!=null){
        sessionStorage.setItem("customerOrders",JSON.stringify(customerOrders));
      
        customerOrders.forEach(orders => {
                let dateFromOrder = new Date(orders.timeStamp);
                let orderDate = dateFromOrder.toISOString().substring(0,10);
                console.log(orderDate)
                //let orderNumber = (orders.id +"").substring(0,6)
              
                let isPaid = "Obetalad";
                if(orders.isPaid){
                    isPaid ="Betalad"
                }
                $("#orderTable").append(`
                  <tr>
                    <th scope="row" class="ps-md-5 orderNumber"> <a href="#show-selected-order" >${orders.orderNumber}</a></th>
                    <td>${orderDate} </td>
                    <td>${orders.totalCost.toFixed(2)}</td>
                    <td>${orders.orderStatus.type}</td>
                    <td>${isPaid}</td>
                  </tr>`
                )
        })
    }
  }

  function showOrder(){
    $("#orderIncludes").empty()
    let orderNumber = $(this).text()
    $("#selected-order-number").html("Order " + orderNumber)

    let customerOrders = JSON.parse(sessionStorage.getItem('customerOrders'))

    customerOrders.forEach(order => {
      if(order.orderNumber == orderNumber){
        let totalQty = 0;
        order.lineItems.forEach(lineItem => {
          totalQty+=lineItem.quantity
          $("#orderIncludes").append(`
          <tr>
              <td class="ps-md-5">${lineItem.product.title}</td>
              <td>${lineItem.product.price.toFixed(2)}</td>
              <td>${lineItem.quantity}</td>
              <td class="text-center">${lineItem.itemPrice.toFixed(2)}</td>
            </tr>`
          )
        })
        $("#totalQuantity").html(totalQty)
        $("#totalPrice").html(order.totalCost.toFixed(2))
      }
    })
  }

  function resetsInputBorders() {
    resetBorder(firstName)
    resetBorder(lastName)
    resetBorder(email)
    resetBorder(phoneNumber)
    resetBorder(address)
    resetBorder(zipCode)
    resetBorder(city)
  }

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

  function validateForm() {
    let bool = true

    bool = checkForInput(testForOnlyText, firstName, bool, FIRSTNAME_ERROR_MSG)
    bool = checkForInput(testForOnlyText, lastName, bool,LASTNAME_ERROR_MSG)
    bool = checkForInput(testForEmail, email, bool,EMAIL_ERROR_MSG)
    bool = checkForInput(testForPhoneNumber,phoneNumber, bool,PHONE_NUMBER_ERROR_MSG)
    bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
    bool = checkForInput(testForZipCode, zipCode, bool,ZIPCODE_ERROR_MSG)
    bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
    
    return bool
  }

  function checkPasswordChange() {
    let bool = true
    
    if(oldPassword.val() !== customer.password){
      WRONNG_PASSWORD_ERROR_MSG.show()
      bool = false
    }else{
      WRONNG_PASSWORD_ERROR_MSG.hide()
    } 
    if(newPassword.val() === oldPassword.val()){
      NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.show()
      bool = false
    }else {
      NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.hide()
    }
    if(newPassword.val() !== confirmPassword.val()){
      NEW_PASSWORD_NOT_MATCH_ERROR_MSG.show()
      bool = false
    }else {
      NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide()
    }

    if(bool) {
      updatePassword(newPassword)
    }

  }

  const updatePassword = (newPassword) => {

    let updatePasswordUrl = `https://hakimlivs.herokuapp.com/users/update/password`

    // let updatePasswordUrl = `https://hakimlogintest.herokuapp.com/users/update/password`

    //let updatePasswordUrl = `http://localhost:8080/users/update/password`

    let updatePassword = {
      "email": email.val().trim(),
      "password": newPassword.val().trim()
    }

    axios.post(updatePasswordUrl,updatePassword)
    .then(respone => {
      console.log(respone);
      if(respone.status == 200){
        swal("Nytt lösenord sparat", "", "success")

        // setting the updated customer to sessionStorage
        sessionStorage.setItem('customer', JSON.stringify(respone.data))

        resetBorder(oldPassword)
        resetBorder(newPassword)
        resetBorder(confirmPassword)
      }
    })
    .catch(err => {
      swal("Något gick fel försök igen", `${err}`, "warning")
    })
  }

  fillInputFieldsWithLoggedIn()

  /**
   * Page loaded
   */
  $(document).ready(() => {
    checkIfLoggedIn()
    hideAllErrorMsgs()
    fillInputFieldsWithLoggedIn()
    getAllOrders()
  })
  
