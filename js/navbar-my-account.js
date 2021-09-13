let cartButton = $("#cartDropdown");
let cartNumber = $("#total-items-in-cart");
let adminview = $("#admin-view-link");
let loggedIn = JSON.parse(sessionStorage.getItem("customer"));
let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));

$(function () {
  adminview.hide();
  setCartButtonAvailability();
  cartNumber.text(cartQuantity);

  if (loggedIn == undefined) {
    window.location.href = "../../index.html";
  } else {
    if (loggedIn.roleList.some(role => role.name=="ADMIN")) {
      adminview.show();
    }
    $("#checkOutLink").attr("href", "../../pages/checkout/");
  }

  $("#login-btn").click(function () {
    if ($(this).text() == "Logga ut") {
      sessionStorage.removeItem("customer");
      window.location.href = "../../index.html";
    }
  });

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
});
