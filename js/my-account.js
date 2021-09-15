/**
 * Cache variables
 *
 */

$("form").submit(false);

let firstName = $("#my-info-first-name"),
  lastName = $("#my-info-last-name"),
  email = $("#my-info-email"),
  myAccountPhoneNumber = $("#my-info-phone-number"),
  address = $("#my-info-address"),
  city = $("#my-info-city"),
  zipCode = $("#my-info-zipCode"),
  oldPassword = $("#my-info-old-password"),
  newPassword = $("#my-info-new-password"),
  confirmPassword = $("#my-info-re-new-password"),
  customer = JSON.parse(sessionStorage.getItem("customer"));

let FIRSTNAME_ERROR_MSG = $("#FIRSTNAME_ERROR_MSG"),
  LASTNAME_ERROR_MSG = $("#LASTNAME_ERROR_MSG"),
  EMAIL_ERROR_MSG = $("#EMAIL_ERROR_MSG"),
  PHONE_NUMBER_ERROR_MSG = $("#PHONE_NUMBER_ERROR_MSG"),
  ADDRESS_ERROR_MSG = $("#ADDRESS_ERROR_MSG"),
  ZIPCODE_ERROR_MSG = $("#ZIPCODE_ERROR_MSG"),
  CITY_ERROR_MSG = $("#CITY_ERROR_MSG"),
  WRONG_PASSWORD_ERROR_MSG = $("#WRONG_PASSWORD_ERROR_MSG"),
  NEW_PASSWORD_NOT_MATCH_ERROR_MSG = $("#NEW_PASSWORD_NOT_MATCH_ERROR_MSG"),
  NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $(
    "#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG"
  );
NEW_PASSWORD_NOT_VALID_ERROR_MSG = $("#NEW_PASSWORD_NOT_VALID_ERROR_MSG");

// let findAllOrdersURL = "https://hakimlivs.herokuapp.com/customerOrder/getCustomerOrders?email="
let customerOrders = [];

/**
 * Eventlisteners
 */

$("#login-btn").click(function () {
  sessionStorage.removeItem("customer");
});

$("#submit").click(() => {
  if (validateFormMyAccount()) {
    resetsInputBorders();

    // let updateUserInfo = `https://hakimlivs.herokuapp.com/users/update/user/info`
    // let updateUserInfo = `https://hakimlogintest.herokuapp.com/users/update/user/info`
    //let updateUserInfo = `http://localhost:8080/users/update/user/info`

    // create object to update
    let updateInfo = {
      firstName: firstName.val().trim(),
      lastName: lastName.val().trim(),
      phoneNumber: formatPhoneNumberForDB(myAccountPhoneNumber.val().trim()),
      email: email.val().trim(),
      streetAddress: address.val(),
      zipCode: formatZipForDB(zipCode.val().trim()),
      city: {
        name: city.val().trim(),
      },
    };

    const config = getHeaderObjWithAuthorization();

    axios
      .post(updateUserInfo, updateInfo, config)
      .then((response) => {
        if (response.status == 200) {
          swal("Informationen har sparats", "", "success");
          sessionStorage.setItem("customer", JSON.stringify(response.data));
        }
      })
      .catch((err) => {
        swal("Informationen har ej sparats", "Vänligen försök igen", "warning");
      });
  }
});

$(document).on("click", ".orderNumber", showOrder);

$(document).ready(() => {
  hideAllErrorMsgs();
  fillInputFieldsWithLoggedIn();
  getOrders();
});

/**
 * Functions
 */

function checkIfLoggedIn() {
  let customer = JSON.parse(sessionStorage.getItem("customer"));
  if (customer == null || customer == undefined) {
    window.location.href = "../../";
  }
}
checkIfLoggedIn();

function fillInputFieldsWithLoggedIn() {
  let customer = JSON.parse(sessionStorage.getItem("customer"));
  firstName.val(formatFirstLetterToUpperCase(customer.firstName));
  lastName.val(formatFirstLetterToUpperCase(customer.lastName));
  email.val(customer.email);
  myAccountPhoneNumber.val(formatPhoneNumber(customer.phoneNumber));
  address.val(formatFirstLetterToUpperCase(customer.streetAddress));
  city.val(formatFirstLetterToUpperCase(customer.city.name));
  zipCode.val(formatZipCode(customer.zipCode));
}

function getOrders() {
  let email = JSON.parse(sessionStorage.getItem("customer")).email;
  const config = getHeaderObjWithAuthorization();

  axios
    .get(getCustomerOrder + email, config)
    .then((response) => {
      if (response.status === 200) {
        customerOrders = response.data;
        fillOrderTable(response.data);
      } else {
        swal("Något gick fel vid inläsning av ordrar");
      }
    })
    .catch((err) => {
      alert("Serverfel! " + err);
    });
}

function fillOrderTable(customerOrders) {
  if (customerOrders != null) {
    sessionStorage.setItem("customerOrders", JSON.stringify(customerOrders));

    customerOrders.forEach((orders) => {
      let dateFromOrder = new Date(orders.timeStamp);
      let orderDate = dateFromOrder.toISOString().substring(0, 10);

      //let orderNumber = (orders.id +"").substring(0,6)

      let isPaid = "Obetalad";
      if (orders.isPaid) {
        isPaid = "Betalad";
      }
      $("#orderTable").append(`
                  <tr>
                    <th scope="row" class="ps-md-5 orderNumber"> <a href="#show-selected-order" >${
                      orders.orderNumber
                    }</a></th>
                    <td>${orderDate} </td>
                    <td>${orders.totalCost.toLocaleString("sv-SE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</td>
                    <td>${orders.orderStatus.type}</td>
                    <td>${isPaid}</td>
                  </tr>`);
    });
  }
}

function showOrder() {
  $("#orderIncludes").empty();
  let orderNumber = $(this).text();
  $("#selected-order-number").html("Order " + orderNumber);

  let customerOrders = JSON.parse(sessionStorage.getItem("customerOrders"));

  customerOrders.forEach((order) => {
    if (order.orderNumber == orderNumber) {
      let totalQty = 0;
      order.lineItems.forEach((lineItem) => {
        totalQty += lineItem.quantity;
        $("#orderIncludes").append(`
          <tr>
              <td class="ps-md-5">${lineItem.product.title}</td>
              <td>${lineItem.product.price.toLocaleString("sv-SE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</td>
              <td>${lineItem.quantity}</td>
              <td class="text-center">${lineItem.itemPrice.toLocaleString(
                "sv-SE",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}</td>
            </tr>`);
      });
      $("#totalQuantity").html(totalQty);
      $("#totalPrice").html(
        order.totalCost.toLocaleString("sv-SE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    }
  });
}

function resetsInputBorders() {
  resetBorder(firstName);
  resetBorder(lastName);
  resetBorder(email);
  resetBorder(myAccountPhoneNumber);
  resetBorder(address);
  resetBorder(zipCode);
  resetBorder(city);
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
  WRONG_PASSWORD_ERROR_MSG.hide();
  NEW_PASSWORD_NOT_VALID_ERROR_MSG.hide();
}

function validateFormMyAccount() {
  let bool = true;

  bool = checkForInput(testForName, firstName, bool, FIRSTNAME_ERROR_MSG);
  bool = checkForInput(testForName, lastName, bool, LASTNAME_ERROR_MSG);
  bool = checkForInput(testForEmail, email, bool, EMAIL_ERROR_MSG);
  bool = checkForInput(
    testForPhoneNumber,
    myAccountPhoneNumber,
    bool,
    PHONE_NUMBER_ERROR_MSG
  );
  bool = checkForInput(testForAddress, address, bool, ADDRESS_ERROR_MSG);
  bool = checkForInput(testForZipCode, zipCode, bool, ZIPCODE_ERROR_MSG);
  bool = checkForInput(testForOnlyText, city, bool, CITY_ERROR_MSG);

  return bool;
}

//-------------------------------------------------------- CHANGE PASSWORD
// Cache variebles
const accountChangePasswordBtn = $("#change-password-btn");
const accountMyOldPassword = $("#my-info-old-password");
const accountMyNewPassword = $("#my-info-new-password");
const accountReNewPassword = $("#my-info-re-new-password");

accountChangePasswordBtn.click(() => {
  const accountEmail = $("#my-info-email").val();
  const accountNewPassword = accountMyNewPassword.val();
  const accountOldPassword = accountMyOldPassword.val();
  updatePassword(accountEmail, accountNewPassword, accountOldPassword);
});

accountChangePasswordBtn.attr("disabled", true);

accountMyOldPassword.focusout(function () {
  let bool = true;
  bool = checkForInput(
    testForPassword,
    accountMyOldPassword,
    bool,
    WRONG_PASSWORD_ERROR_MSG
  );
  checkIfAllPasswordChangeFieldsAreFilledIn();
});

accountMyNewPassword.focusout(function () {
  let bool = true;
  bool = checkForInput(
    testForPassword,
    accountMyNewPassword,
    bool,
    NEW_PASSWORD_NOT_VALID_ERROR_MSG
  );
  if (accountMyNewPassword.val() == accountMyOldPassword.val()) {
    accountMyNewPassword.css("border", "3px solid #F90A0A");
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.show();
  } else {
    accountMyNewPassword.css("border", "2px solid #34F458");
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.hide();
  }
  checkIfAllPasswordChangeFieldsAreFilledIn();
});

accountReNewPassword.focusout(function () {
  let bool = true;
  bool = checkForInput(
    testForPassword,
    accountReNewPassword,
    bool,
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG
  );
  checkIfAllPasswordChangeFieldsAreFilledIn();
});

const checkIfAllPasswordChangeFieldsAreFilledIn = () => {
  if (
    accountMyOldPassword.val() != "" &&
    accountMyNewPassword.val() != "" &&
    accountReNewPassword.val() != "" &&
    accountMyOldPassword.val() !== accountMyNewPassword.val()
  ) {
    accountChangePasswordBtn.removeAttr("disabled");
  } else {
    accountChangePasswordBtn.attr("disabled", true);
  }
};

const updatePassword = (email, newPassword, oldPassword) => {
  console.log(email);
  let updatePassword = {
    email: email.trim(),
    newPassword: newPassword.trim(),
    oldPassword: oldPassword.trim(),
  };
  const config = getHeaderObjWithAuthorization();

  axios
    .post(updateUserPasswordUrl, updatePassword, config)
    .then((respone) => {
      if (respone.status == 200) {
        swal("Nytt lösenord sparat", "", "success");

        // setting the updated customer to sessionStorage
        sessionStorage.setItem("customer", JSON.stringify(respone.data));

        resetBorder(accountMyOldPassword);
        resetBorder(accountMyNewPassword);
        resetBorder(accountReNewPassword);
        accountMyOldPassword.val("");
        accountMyNewPassword.val("");
        accountReNewPassword.val("");
      }
    })
    .catch((err) => {
      swal("Något gick fel försök igen", err.response.data.message, "warning");
    });
};

fillInputFieldsWithLoggedIn();

// DELETE USER

const handleDeleteUser = () => {
  const email = getUserEmail();
  const password = $("#passwordForDelteUser").val();
  const config = getHeaderObjWithAuthorization();
  if (password) {
    axios
      .get(`${deleteUserUrl}?email=${email}&password=${password}`, config)
      .then((resp) => {
        console.log(resp.data);
        swal("Konto borttaget").then(() => {
          localStorage.clear();
          location.replace("../../index.html");
        });
      })
      .catch((err) => {
        swal("Error! Konto ej borttaget", err.response.data.message, "error");
      });
  } else {
    swal(
      "",
      "Du måste fylla i ditt lösenord för att kunna ta bort ditt konto",
      "info"
    );
  }
};

const getUserEmail = () => {
  const user = JSON.parse(sessionStorage.getItem("customer"));
  return user.email;
};

// adding eventlistener to delete user button
$("#deleteAccountBtn").click(handleDeleteUser);
