let navLoginBtn = $("#login-btn");
let loginbutton2 = $("#login-button");
let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));

$(function () {
    $("#total-items-in-cart").text(cartQuantity);

     $("#newCust-button").click(() => {
       $("#registerForm").modal("show");
     });

     $("#checkout-button").click(function () {
       let customer = JSON.parse(sessionStorage.getItem("customer"));
       if (customer == null || customer == undefined) {
         swal(
           "Du måste vara inloggad för att lägga beställning",
           "",
           "warning"
         );
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
});
