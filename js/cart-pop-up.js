let cart = [];

$(document).ready(load);

function load() {
  /* let cartTestUrl = '../../TestData/test_data_cart.JSON'
    fetch(cartTestUrl)
      .then((response) => response.json())
      .then((data) => makeArrayFromData(data))
      .catch((error) => console.error(error)); */

  renderCart();
}

function makeArrayFromData(data) {
  cart = data;
  localStorage.setItem("cart", JSON.stringify(data));
}

function renderCart() {
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
  let cart = JSON.parse(localStorage.getItem("cart"));
  
  if (cart != null) {
    let output = "";

    cart.forEach((element) => {
      output += `<div class="container">
                    <div class="row border py-3 text-center smaller cart-row">
                      <div class="col-1">
                        <i class="bi bi-trash-fill trash-button" id="${
                          element.productNr
                        }"></i>
                      </div>
                      <div class="col-4 col-md-5 col-lg-4 text-start">
                        ${element.title}
                         </div>
                      <div class="col-lg-1 d-none d-lg-inline text-start">

                        <img class="cart-thumbnail "
                    src="${element.image} alt="${element.title}-bild">
                      </div>
                      <div class="col-2">${element.price}</div>
                      <div class="col-3 col-md-2 qty-label">
                        <i class="bi bi-dash-circle decrease-button" id="${
                          element.productNr
                        }"></i>
                        <span class="border text-center px-lg-2 quantity" id="${
                          element.productNr
                        }"
                          >${element.inCart}</span
                        >
                        <i
                          class="bi bi-plus-circle-fill increase-button"
                          id="${element.productNr}"
                        ></i>
                      </div>
                      <div class="col-2 line-price " id="${
                        element.productNr
                      }">${(element.price * element.inCart).toFixed(2)}</div>
                    </div>
                  </div>`;
    });

    $("#cartOutput").html(output);
    $(".decrease-button").on("click", function (e) {
      removeProduct(+e.target.id);
    });

    $(".increase-button").on("click", function (e) {
      console.log(+e.target.id);
      addProduct(+e.target.id);
    });

    $("#priceOutput").text(
      JSON.parse(localStorage.getItem("cartTotalPrice")).toFixed(2)
    );

    $.each($(".trash-button"), function (index, el) {
      el.addEventListener("click", (e) => {
        swal({
          title: "Är du säker?",
          text: "Vill du verklingen ta bort produkten från varukorgen?",
          icon: "warning",
          dangerMode: true,
          buttons: ["Ja", "Nej"],
        }).then((willDelete) => {
          if (!willDelete) {
            swal("Produkten är borttagen", {
              icon: "success",
            })
            //Ta bort varan ur lokal storage
            cart.forEach((element, index) => {
              if(element.productNr == el.id) {
                cartQuantity-=element.inCart;
                updateTotalPrice(element);

                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
                $("#total-items-in-cart").text(cartQuantity)
                updateCartQuantity();
                setCartAvailability();
              }
            });
            renderCart();
          } else {
            swal("Borttagning avbruten");
          }
        });
      });
    });
  }
}
function updateTotalPrice(product){
  let totalPrice = JSON.parse(localStorage.getItem("cartTotalPrice"));
  totalPrice -= product.price*product.inCart;

  localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
};

function addProduct(product) {
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
  let cartTemp = JSON.parse(localStorage.getItem("cart"));
  cartTemp.forEach((element) => {
    if (element.productNr == product) {
      if (element.inCart < 99) {
        element.inCart += 1;
        addToTotalPrice(element);
        cartQuantity += 1;
        document.getElementById("total-items-in-cart").innerHTML = cartQuantity;
      }
    }
  });
  localStorage.setItem("cart", JSON.stringify(cartTemp));
  updateCartQuantity();
  $("#priceOutput").text(
    JSON.parse(localStorage.getItem("cartTotalPrice")).toFixed(2)
  );
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
}

function removeProduct(product) {
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
  let cartTemp = JSON.parse(localStorage.getItem("cart"));
  cartTemp.forEach((element) => {
    if (element.productNr == product) {
      if (element.inCart !== 1) {
        element.inCart -= 1;
        removeFromTotalPrice(element);
        cartQuantity -= 1;
        document.getElementById("total-items-in-cart").innerHTML = cartQuantity;
      }
    }
  });
  localStorage.setItem("cart", JSON.stringify(cartTemp));
  updateCartQuantity();
  $("#priceOutput").text(
    JSON.parse(localStorage.getItem("cartTotalPrice")).toFixed(2)
  );
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
}

/**
 * Take an object and add price to totalprice
 * @param {object} product
 */
function addToTotalPrice(product) {
  let totalPrice = JSON.parse(localStorage.getItem("cartTotalPrice"));
  totalPrice += product.price;
  localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
}

/**
 * Take an object and remove price to totalprice
 * @param {object} product
 */
function removeFromTotalPrice(product) {
  let totalPrice = JSON.parse(localStorage.getItem("cartTotalPrice"));
  console.log(product.inCart);
  totalPrice -= product.price;
  localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
}

function updateCartQuantity() {
  let cartTemp = JSON.parse(localStorage.getItem("cart"));
  cartTemp.forEach((element) => {
    $(`#${element.productNr}.quantity`).text(element.inCart);
    $(`#${element.productNr}.line-price`).text(
      (element.price * element.inCart).toFixed(2)
    );
  });
}

function hideCart() {
  $("#cart-pop-up").modal("hide");
}

function setCartAvailability() {
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
  if (cartQuantity <= 0 || cartQuantity == null) {
    $("#cartDropdown").attr("disabled", true);
    $("#checkout-button").attr("disabled", true);
    hideCart();
  } else {
    $("#cartDropdown").attr("disabled", false);
    $("#checkout-button").attr("disabled", false);
  }
}

$("#clear").click(function () {
  swal({
    title: "Är du säker?",
    text: "Vill du verkligen tömma varukorgen?",
    icon: "warning",
    dangerMode: true,
    buttons: ["Ja", "Nej"],
  }).then((willDelete) => {
    if (!willDelete) {
      swal({
        title: "Varukorgen är tömd!",
        icon: "success",
      });
      hideCart();
      localStorage.clear();
      $("#total-items-in-cart").text("0");
      $("#priceOutput").text("");
      $("#cartOutput").text("");
      setCartAvailability();
    } else {
      swal("Borttagning avbruten");
    }
  });
});
