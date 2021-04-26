
$(document).ready(() => {
  checkIfLoggedIn()
  hideAllErrorMsgs()
})

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
NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $('#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG'),
PASSWORD_NOT_VALIDATET_MSG = $('#PASSWORD_NOT_VALIDATET_MSG')


/**
 * Eventlisteners
 */

$("#login-btn").click(function(){
    sessionStorage.removeItem("customer")
  })

$('#submit').click( () => { 
  if(validateForm()) {
    resetsInputBorders()
    
    //let updateUserInfo = `https://hakimlivs.herokuapp.com/users/update/user/info`
    let updateUserInfo = `https://hakimlogintest.herokuapp.com/users/update/user/info`
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

    // sending update object to server
    axios.post(updateUserInfo,updateInfo)
    .then(response => {

      if(response.status == 200){
        console.log(response);

        // setting the updated customer to sessionStorage
        sessionStorage.setItem('customer', JSON.stringify(response.data))
        swal("Din kundinformation har updaterats", "", "success")
      }else {
        swal('Något gick fel försök igen', '', 'warning')
      } 
    })
    .catch(err => {
      swal("Något gick fel försök igen", `${err}`, "warning")
    })
  }
})

$('#change-password-btn').click(() => {
  checkPasswordChange()
})


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

    
    
    console.log(customer);

     firstName.val(customer.firstName)
     lastName.val(customer.lastName)
     email.val(customer.email)
     phoneNumber.val(formatPhoneNumber(customer.phoneNumber))
     address.val(customer.streetAddress)
     city.val(customer.city.name)
     zipCode.val(formatZipCode(customer.zipCode))
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
    PASSWORD_NOT_VALIDATET_MSG.hide()
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

    if(bool){
      bool = checkForInput(testForPassword, newPassword, bool, PASSWORD_NOT_VALIDATET_MSG)
    }

    if(bool){
      updatePassword(newPassword);
    }
  }

  const updatePassword = (newPassword) => {

    //let updatePasswordUrl = `https://hakimlivs.herokuapp.com/users/update/password`
    let updatePasswordUrl = `https://hakimlogintest.herokuapp.com/users/update/password`
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

  
