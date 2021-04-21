

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


/**
 * Eventlisteners
 */

$("#login-btn").click(function(){
    sessionStorage.removeItem("customer")
  })

$('#submit').click( () => { 
  if(validateForm()) {
    swal("Informationen har sparats", "", "success")
    resetsInputBorders()
    
    let url = `localhost:8080/users/updateUser?
    firstName=${firstName.val()}&
    lastName=${lastName.val()}&
    phoneNumber=${phoneNumber.val()}&
    email=${email.val()}&
    streetAddress=${address.val()}&
    zipCode=${zipCode.val()}&
    name=${city.val()}`

    axios.get(url)
    .then(response => {
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
    console.log(data)

    // send data object to backend for uppdateing customer
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

     firstName.val(customer.firstName)
     lastName.val(customer.lastName)
     email.val(customer.email)
     phoneNumber.val(customer.phoneNumber)
     address.val(customer.streetAddress)
     city.val(customer.city.name)
     zipCode.val(customer.zipCode)


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
    bool = checkForInput(testForNumbersOnly,phoneNumber, bool,PHONE_NUMBER_ERROR_MSG)
    bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
    bool = checkForInput(testForZipCode, zipCode, bool,ZIPCODE_ERROR_MSG)
    bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
    
    return bool
  }

  function checkPasswordChange() {
    
    if(oldPassword.val() !== customer.password){
      WRONNG_PASSWORD_ERROR_MSG.show()
    }else{
      WRONNG_PASSWORD_ERROR_MSG.hide()
    } 
    if(newPassword.val() === oldPassword.val()){
      NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.show()
    }else {
      NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.hide()
    }
    if(newPassword.val() !== confirmPassword.val()){
      NEW_PASSWORD_NOT_MATCH_ERROR_MSG.show()
    }else {
      NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide()
    }
  }


  /**
   * Page loaded
   */
  $(document).ready(() => {
    checkIfLoggedIn()
    hideAllErrorMsgs()
    fillInputFieldsWithLoggedIn()
  })
  
