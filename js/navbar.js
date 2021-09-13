let password = $("#login-password");
let email = $("#login-email");
let navLoginBtn = $("#login-btn");
let loginbutton2 = $("#login-button");
let wrongEmail = $("#wrong-email");
let wrongPassword = $("#wrong-password");
let whichPage = $("#login-page");
let cartButton = $("#cartDropdown");
let cartNumber = $("#total-items-in-cart");
let loggedIn = JSON.parse(sessionStorage.getItem("customer"));


let emailToCheck = $("#login-email"),
  passwordToCheck = $("#login-password"),
  loginModal = $("#login-modal");

let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
// const addUserUrl = "https://hakimlivs.herokuapp.com/users/add";

$(function () {
  adminview.hide();
  setCartButtonAvailability();
  cartNumber.text(cartQuantity);
  addShowOrHidePasswordOnButton();

  if(loggedIn!=undefined) {
    if(loggedIn.roleList){
      if (loggedIn.roleList.some(role => role.name=="ADMIN")) {
    adminview.show();
    }
    
  }
  $("#checkOutLink").attr("href", "../../pages/checkout/");
  }
  

  $("#newCust-button").click(() => {
    $("#registerForm").modal("show");
  });

  $("#checkout-button").click(function () {
    let customer = JSON.parse(sessionStorage.getItem("customer"));
    if (customer == null || customer == undefined) {
      swal("Du måste vara inloggad för att lägga beställning", "", "warning");
    }
  });

  setAvailableButtonsInNavbar();

  $("form").submit(false);

  navLoginBtn.on("click", function () {
    loginModal.show();
  });
  //------------------------------------- login ----------------------------------\\

  $("#login-button").click(() => {
    //let url = `https://hakimlivs.herokuapp.com/users/checkCredentials?email=${emailToCheck.val()}&password=${passwordToCheck.val()}`;
    let url = `https://hakim-livs-dev.herokuapp.com/login?username=${emailToCheck.val()}&password=${passwordToCheck.val()}`;


    axios
      .post(url)
      .then((response) => {
      if (response.status !== 200) {
        swal("Fel email eller lösenord", "", "warning");
        emailToCheck.val("");
        passwordToCheck.val("");
      } else {
        getUserByEmail(emailToCheck.val())
        .then(user => {
          console.log(user);
          if (user.roleList.some(role => role.name=="ADMIN")) {
          location.replace("../../admin/index.html");
        } else {
          loginModal.modal("hide");
          navLoginBtn.text("Logga ut");
          myAccountMenu.show();
        }
        })
      }
    })
      .catch((err) => {
        alert("Serverfel!");
      });
  });

  const getUserByEmail =  (email) => {
  const url = `${getCustomer}${email}`;
   return axios
    .get(url)
    .then((resp) => {
      sessionStorage.setItem("customer", JSON.stringify(resp.data))
      return resp.data
    }
    );
};
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
        zipCode: zipCode.val(),
        city: {
          name: city.val(),
        },
      };

      axios
        .post(addUser, data)
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

  function setAvailableButtonsInNavbar() {
    $("#login-btn").on("click", function () {
      if ($(this).text() == "Logga in") {
        $("#login-modal").modal("show");
      } else {
        
        sessionStorage.removeItem("customer");
        $("#myAccountDropdown").hide();
        $(this).text("Logga in");
        /*This inelegantly solves a bug where all action listeners
        stopped working after logging out*/
        window.location.href = "index.html";
      }
    });
  }

  function addShowOrHidePasswordOnButton() {
    $("#show-password-button").click(function () {
      if ($(this).text() == "Visa") {
        $(this).text("Dölj");
        password.attr("type", "text");
      } else {
        $(this).text("Visa");
        password.attr("type", "password");
      }
    });
  }

  function setCartButtonAvailability() {
    let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
    if (cartQuantity <= 0 || cartQuantity == null) {
      cartButton.attr("disabled", true);
      cartNumber.hide();
    } else {
      cartButton.attr("disabled", false);
      cartNumber.show();
    }
  }

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
