let password = $('#login-password');
let email =$('#login-email');
let navLoginBtn = $('#login-btn');
let loginbutton2 = $('#login-button');
let wrongEmail = $('#wrong-email')
let wrongPassword = $('#wrong-password')
let whichPage = $("#login-page");

let emailToCheck = $('#login-email'),
passwordToCheck = $('#login-password'),
loginModal = $('#login-modal')


let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
const addUserUrl = "https://hakimlivs.herokuapp.com/users/add";

$(function () {
  $("#total-items-in-cart").text(cartQuantity);

  $("#newCust-button").click(() => {
    $("#registerForm").modal("show");
  });

  $("#checkout-button").click(function () {
    let customer = JSON.parse(sessionStorage.getItem("customer"));
    if (customer == null || customer == undefined) {
      swal("Du måste vara inloggad för att lägga beställning", "", "warning");
    }
  });


  $("#show-password-button").click(function () {
    if ($(this).text() == "Visa") {
      $(this).text("Dölj");
      password.attr("type", "text");
    } else {
      $(this).text("Visa");
      password.attr("type", "password");
    }
  });

  $("#login-btn").click(function () {
    if ($(this).text() == "Logga in") {
      $("#login-modal").modal("show");
    } else {
      sessionStorage.removeItem("customer");
      $("#myAccountDropdown").hide();
      $(this).text("Logga in");
      adminview.hide();
    }
  });

  $("form").submit(false);

  //---------------------------------- Regristration ---------------------------------\\

  let firstName = $("#register-first-name"),
    lastName = $("#register-last-name"),
    regristrationEmail = $("#register-email"),
    phoneNumber = $("#register-phone-number"),
    address = $("#register-street"),
    city = $("#register-city"),
    zipCode = $("#register-zip"),
    newPassword = $("#register-password"),
    confirmPassword = $("#register-confirm-password"),
    year = $("#register-year"),
    month = $("#register-month"),
    day = $("#register-day");

  let FIRSTNAME_ERROR_MSG = $("#FIRSTNAME_ERROR_MSG"),
    LASTNAME_ERROR_MSG = $("#LASTNAME_ERROR_MSG"),
    EMAIL_ERROR_MSG = $("#EMAIL_ERROR_MSG"),
    PHONE_NUMBER_ERROR_MSG = $("#PHONE_NUMBER_ERROR_MSG"),
    ADDRESS_ERROR_MSG = $("#ADDRESS_ERROR_MSG"),
    ZIPCODE_ERROR_MSG = $("#ZIPCODE_ERROR_MSG"),
    CITY_ERROR_MSG = $("#CITY_ERROR_MSG"),
    WRONNG_PASSWORD_ERROR_MSG = $("#WRONG_PASSWORD_ERROR_MSG"),
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG = $("#NEW_PASSWORD_NOT_MATCH_ERROR_MSG"),
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $(
      "#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG"
    );

  /**
   * Eventlistener
   */

  $("#confirm-account").click(() => {
    if (validateForm()) {
      resetsInputBorders();
      let data = {
        firstName: firstName.val(),
        lastName: lastName.val(),
        phoneNumber: phoneNumber.val(),
        email: regristrationEmail.val(),
        streetAddress: address.val(),
        password: newPassword.val(),
        socialSecurityNumber: year.val() + month.val() + day.val(),
        isAdmin: false,
        isVip: false,
        zipCode: zipCode.val(),
        city: {
          name: city.val(),
        },
      };

      axios
        .post(addUserUrl, data)
        .then(() => {
          swal("Användare skapad!", "Vänligen logga in", "success")
            .then($("#registerForm").modal("hide"))
            .then(clearRegristrationForm);
        })
        .catch(() => {
          swal("Något fick fel!", "Vänligen försök igen", "warning");
        });
    }
  });

  /**
   * Functions
   */

  function hideAllErrorMsgs() {
    FIRSTNAME_ERROR_MSG.hide();
    LASTNAME_ERROR_MSG.hide();
    EMAIL_ERROR_MSG.hide();
    PHONE_NUMBER_ERROR_MSG.hide();
    ADDRESS_ERROR_MSG.hide();
    ZIPCODE_ERROR_MSG.hide();
    CITY_ERROR_MSG.hide();
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide();
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.hide();
    WRONNG_PASSWORD_ERROR_MSG.hide();
  }

  function resetsInputBorders() {
    resetBorder(firstName);
    resetBorder(lastName);
    resetBorder(regristrationEmail);
    resetBorder(newPassword);
    resetBorder(phoneNumber);
    resetBorder(address);
    resetBorder(zipCode);
    resetBorder(city);
  }

  function validateForm() {
    let bool = true;

    bool = checkForInput(testForOnlyText, firstName, bool, FIRSTNAME_ERROR_MSG);
    bool = checkForInput(testForOnlyText, lastName, bool, LASTNAME_ERROR_MSG);
    bool = checkForInput(
      testForEmail,
      regristrationEmail,
      bool,
      EMAIL_ERROR_MSG
    );
    bool = checkForInput(
      testForNumbersOnly,
      phoneNumber,
      bool,
      PHONE_NUMBER_ERROR_MSG
    );
    bool = checkForInput(testForAddress, address, bool, ADDRESS_ERROR_MSG);
    bool = checkForInput(testForZipCode, zipCode, bool, ZIPCODE_ERROR_MSG);
    bool = checkForInput(testForOnlyText, city, bool, CITY_ERROR_MSG);
    bool = checkForInput(
      testForPassword,
      newPassword,
      bool,
      WRONNG_PASSWORD_ERROR_MSG
    );

    bool = checkPassword(bool);
    return bool;
  }

  function checkPassword(bool) {
    if (newPassword.val() !== confirmPassword.val()) {
      NEW_PASSWORD_NOT_MATCH_ERROR_MSG.show();
      return false;
    } else {
      NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide();
      return bool;
    }
  }

  function clearRegristrationForm() {
    firstName.val("");
    lastName.val("");
    regristrationEmail.val("");
    phoneNumber.val("");
    address.val("");
    city.val("");
    zipCode.val("");
    newPassword.val("");
    confirmPassword.val("");
    year.val("");
    month.val("");
    day.val("");
  }

  hideAllErrorMsgs();
});
