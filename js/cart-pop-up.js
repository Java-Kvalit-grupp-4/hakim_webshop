let cart = [];

$(document).ready(load);

function load() {
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
                          element.sku
                        }"></i>
                      </div>
                      <div class="col-4 col-md-5 col-lg-4 text-start">
                        ${element.title}
                         </div>
                      <div class="col-lg-1 d-none d-lg-inline text-start">

                        <img class="cart-thumbnail "
                    src="${element.image}" alt="${element.title}-bild">
                      </div>
                      <div class="col-2">${element.price.toLocaleString(
                        "sv-SE",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}</div>
                      <div class="col-3 col-md-2 qty-label">
                        <i class="bi bi-dash-circle decrease-button" id="${
                          element.sku
                        }"></i>
                        <span class="border text-center px-lg-2 quantity" id="${
                          element.sku
                        }"
                          >${element.inCart}</span
                        >
                        <i
                          class="bi bi-plus-circle-fill increase-button"
                          id="${element.sku}"
                        ></i>
                      </div>
                      <div class="col-2 line-price " id="${element.sku}">${(
        element.price * element.inCart
      ).toLocaleString("sv-SE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</div>
                    </div>
                  </div>`;
    });

    $("#cartOutput").html(output);
    $(".decrease-button").on("click", function (e) {
      removeProduct(+e.target.id);
    });

    $(".increase-button").on("click", function (e) {
      addProduct(+e.target.id);
    });

    $("#priceOutput").text(
      JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString(
        "sv-SE",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
    );

    $.each($(".trash-button"), function (index, el) {
      el.addEventListener("click", (e) => {
        swal({
          title: "??r du s??ker?",
          text: "Vill du verklingen ta bort produkten fr??n varukorgen?",
          icon: "warning",
          dangerMode: true,
          buttons: ["Ja", "Nej"],
        }).then((willDelete) => {
          if (!willDelete) {
            swal("Produkten ??r borttagen", {
              icon: "success",
            });
            //Ta bort varan ur lokal storage
            cart.forEach((element, index) => {
              if (element.sku == el.id) {
                cartQuantity -= element.inCart;
                updateTotalPrice(element);

                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                localStorage.setItem(
                  "cartQuantity",
                  JSON.stringify(cartQuantity)
                );
                $("#total-items-in-cart").text(cartQuantity);
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

function updateTotalPrice(product) {
  let totalPrice = JSON.parse(localStorage.getItem("cartTotalPrice"));
  totalPrice -= product.price * product.inCart;

  localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
}

function addProduct(product) {
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
  let cartTemp = JSON.parse(localStorage.getItem("cart"));
  cartTemp.forEach((element) => {
    if (element.sku == product) {
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
    JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString(
      "sv-SE",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  );
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
}

function removeProduct(product) {
  let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
  let cartTemp = JSON.parse(localStorage.getItem("cart"));
  cartTemp.forEach((element) => {
    if (element.sku == product) {
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
    JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString(
      "sv-SE",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
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
  totalPrice -= product.price;
  localStorage.setItem("cartTotalPrice", JSON.stringify(totalPrice));
}

function updateCartQuantity() {
  let cartTemp = JSON.parse(localStorage.getItem("cart"));
  cartTemp.forEach((element) => {
    $(`#${element.sku}.quantity`).text(element.inCart);
    $(`#${element.sku}.line-price`).text(
      (element.price * element.inCart).toLocaleString("sv-SE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
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
    title: "??r du s??ker?",
    text: "Vill du verkligen t??mma varukorgen?",
    icon: "warning",
    dangerMode: true,
    buttons: ["Ja", "Nej"],
  }).then((willDelete) => {
    if (!willDelete) {
      swal({
        title: "Varukorgen ??r t??md!",
        icon: "success",
      });
      hideCart();
      localStorage.clear();
      $("#total-items-in-cart").hide();
      $("#priceOutput").text("");
      $("#cartOutput").text("");
      setCartAvailability();
    } else {
      swal("Borttagning avbruten");
    }
  });
});
