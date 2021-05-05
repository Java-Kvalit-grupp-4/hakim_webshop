/**
 * Cache variables
 */
(firstName = $("#firstName")),
  (lastName = $("#lastName")),
  (email = $("#email")),
  (phone = $("#phone")),
  (address = $("#address")),
  (zip = $("#zip")),
  (city = $("#city")),
  (orderComment = $("#order-comment"));

$(document).ready(() => {
  /**
   *  Eventlistiners
   */
  $("#send-order-btn").click(function () {
    sendOrderToServer(makeOrderObject());
  });

  let customer = JSON.parse(sessionStorage.getItem("customer"));
  if (customer == null || customer == undefined) {
    window.location.href = "../../";
  }
  renderCart();
  renderCustomerInfo();

  /**
   * Render data from array to the UI
   * @param {Array} data array of products
   */
  function renderCart() {
    


    let $VAT25 = $("#vat-25");
    $VAT25.hide();
    let $VAT12 = $("#vat-12");
    $VAT12.hide();
    let $VAT6 = $("#vat-6");
    $VAT6.hide();
    let VAT25 = 0;
    let VAT12 = 0;
    let VAT6 = 0;
    let cartData = JSON.parse(localStorage.getItem("cart"));
    let cart = $("#cart-container");

    // add shipping to order
    let shippingObject = JSON.parse(localStorage.getItem('shipping'));
    shippingObject = {
      ...shippingObject,
        inCart: 1 
    }

    cartData.push(shippingObject)
    

    cart.html("");
    $.each(cartData, (index, e) => {
      let linePrice = e.price * e.inCart;

      switch (e.vat) {
        case 1.25:
          VAT25 += linePrice - linePrice / e.vat;
          break;
        case 1.12:
          VAT12 += linePrice - linePrice / e.vat;
          break;
        case 1.06:
          VAT6 += linePrice - linePrice / e.vat;
          break;
        default:
          break;
      }

      if(VAT25>0) {
        $VAT25.show();
        $("#VAT-25").text(
          `${VAT25.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        );
      }
      if (VAT12 > 0) {
        $VAT12.show();
        $("#VAT-12").text(
          `${VAT12.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        );
      }
      if (VAT6 > 0) {
        $VAT6.show();
        $("#VAT-6").text(
          `${VAT6.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`
        );
      }

      cart.append(`
        <div class="row pt-2 line-item-border">
            <div class="col col-xs-3 col-lg-3 cart-line-item"><p>${
              e.sku
            }</p></div>
            <div class="col col-xs-2 col-lg-4 cart-line-item"><p>${
              e.title
            }</p></div>
            <div class="col col-xs-1 col-lg-1 cart-line-item"><p class="line-item-total-quantity">${
              e.inCart
            }</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p>${e.price.toLocaleString(
              "sv-SE",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${linePrice.toLocaleString("sv-SE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}</p></div>
        </div>
        `);
    });

    $("#cart-total-price").text(
      Number(JSON.parse(localStorage.getItem("cartTotalPrice")) + shippingObject.price).toLocaleString(
        "sv-SE",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
    );

    let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
    $("#cart-total-quantity").text(cartQuantity);
  }
});

/**
 * Checks witch customer that is logged in
 * and render that data to the UI
 * @param {Array} data customers from the databas
 */
function renderCustomerInfo() {
  let loggedInCustomer = JSON.parse(sessionStorage.getItem("customer"));

  firstName.val(formatFirstLetterToUpperCase(loggedInCustomer.firstName));
  lastName.val(formatFirstLetterToUpperCase(loggedInCustomer.lastName));
  email.val(loggedInCustomer.email);
  phone.val(formatPhoneNumber(loggedInCustomer.phoneNumber));
  address.val(formatFirstLetterToUpperCase(loggedInCustomer.streetAddress));
  zip.val(formatZipCode(loggedInCustomer.zipCode));
  city.val(formatFirstLetterToUpperCase(loggedInCustomer.city.name));
}
renderCustomerInfo();

/**
 * Resets all inputfields and checkbox
 */
function clearAllInputFields() {
  firstName.val("");
  lastName.val("");
  email.val("");
  phone.val("");
  address.val("");
  zip.val("");
  city.val("");

  resetBorder(firstName);
  resetBorder(lastName);
  resetBorder(email);
  resetBorder(phone);
  resetBorder(address);
  resetBorder(zip);
  resetBorder(city);
}

function makeOrderObject() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  let orderCommentInput = $('#order-comment').val();
  let lineItems = [];

  // adds shipping to order
  let shipping = JSON.parse(localStorage.getItem('shipping'))
  shipping = {
    ...shipping,
      inCart: 1 
  }
  cart.push(shipping);

  // create lineItems for database
  $.each(cart, (index, productElement) => {
    let lineItem = {
      product: {
        sku: productElement.sku,
      },
      quantity: productElement.inCart,
      itemPrice: productElement.price.toFixed(2),
    };
    lineItems.push(lineItem);
  });

  let orderObject = {
    appUser: {
      email: email.val(),
    },
    orderComment: orderCommentInput,
    totalCost: parseFloat($("#cart-total-price").text()),
    isPaid: false,
    orderStatus: {
      type: "Ohanterad",
      id: 1,
    },
    lineItems: lineItems,
  };

  return orderObject;
}

function sendOrderToServer(orderObject) {
  const url = "https://hakimlivs.herokuapp.com/customerOrder/add";
  // const url = "https://hakim-test.herokuapp.com/customerOrder/add";
  // const url = "https://hakimlogintest.herokuapp.com/customerOrder/add";
  //const url = 'http://localhost:8080/customerOrder/add'

  console.log(orderObject);

  axios
    .post(url, orderObject)
    .then((response) => {
      if (response.status == 200) {
        swal({
          title: "Tack för din order!",
          text: `
               \nLeveransadress
               \n${address.val()}
               \n${city.val()}
               \n${zip.val()}`,
          icon: "success",
          button: "Ok",
        }).then(() => {
          clearAllInputFields();
          localStorage.clear();
          renderCart();
          window.location.href = "../../index.html";
        });
      }
    })
    .catch((err) => console.log(">> error from server: " + err));
}
