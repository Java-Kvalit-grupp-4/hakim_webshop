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
  let cart = JSON.parse(localStorage.getItem("cart"));
  // document.getElementById("productsInCart").innerHTML = ''

  // cart.forEach(element => {
  //     document.getElementById("productsInCart").innerHTML +=
  //     `<tr id=""class="table-light center-table">
  //             <td id="trashcan"><button id="${element.productNr}" type="button" class="trashcan-center"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  //             <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
  //           </svg> </td>
  //             <td scope="row">${element.title}</td>
  //             <td scope="row"><img class="cart-thumbnail" src="${element.image} alt="Product picture"</td>
  //             <td scope="row">${element.price}</td>
  //             <div>
  //             <td><button type="button" class="shadow-button" onclick="removeProduct(${element.productNr})">-</td>
  //             <td id="quantityInCart"><div class="quantity${element.productNr}">${element.inCart}</div></td>
  //                 <td><button type="button" class="shadow-button" onclick="addProduct(${element.productNr})">+</td>
  //             </div>
  //             <td id="${element.productNr}" class="price${element.productNr}">${(element.price * element.inCart).toFixed(2)}</td>
  //         </tr>`
  // });

  //  let cart = JSON.parse(localStorage.getItem("cart"));
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
                        <i class="bi bi-dash-circle remove-button" id="${
                          element.productNr
                        }"></i>
                        <span class="border text-center px-lg-2 quantity" id="${element.productNr}"
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
  $(".remove-button").on("click", function (e) {
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
          });
          renderCart();
        } else {
          swal("Borttagning avbruten");
        }
      });
    });
  });
}

// function addProduct(product) {
//   let cartTemp = JSON.parse(localStorage.getItem("cart"));
//   cartTemp.forEach((element) => {
//     if (element.productNr == product) {
//       element.inCart += 1;
//       addToTotalPrice(element);
//     }
//   });
//   localStorage.setItem("cart", JSON.stringify(cartTemp));
//   updateCartQuantity();
//   $("#priceOutput").text(
//     JSON.parse(localStorage.getItem("cartTotalPrice")).toFixed(2)
//   );
// }

// function removeProduct(product) {
//   let cartTemp = JSON.parse(localStorage.getItem("cart"));
//   cartTemp.forEach((element) => {
//     if (element.productNr == product) {
//       if (element.inCart !== 1) {
//         element.inCart -= 1;
//         removeFromTotalPrice(element);
//       }
//       localStorage.setItem("cart", JSON.stringify(cartTemp));
//       updateCartQuantity();
//       $("#priceOutput").text(
//         JSON.parse(localStorage.getItem("cartTotalPrice")).toFixed(2)
//       );
//     }
//   })
// }

function addProduct(product){
  let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))
    let cartTemp = JSON.parse(localStorage.getItem("cart"));
    cartTemp.forEach(element => {
      if (element.productNr == product){
        if(element.inCart<99){
          element.inCart += 1
          addToTotalPrice(element)
          cartQuantity += 1
          document.getElementById("total-items-in-cart").innerHTML=cartQuantity
        }
      }})
    localStorage.setItem("cart", JSON.stringify(cartTemp));
    updateCartQuantity()
    $("#priceOutput").text(
      JSON.parse(localStorage.getItem("cartTotalPrice")).toFixed(2)
    );
    localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity))
}

function removeProduct(product) {
    let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))
    let cartTemp = JSON.parse(localStorage.getItem("cart"));
    cartTemp.forEach(element => {
      if (element.productNr == product){
        if (element.inCart !== 1){
        element.inCart -= 1
        removeFromTotalPrice(element)
        cartQuantity -= 1
        document.getElementById("total-items-in-cart").innerHTML = cartQuantity
        }
      }})
    localStorage.setItem("cart", JSON.stringify(cartTemp));
    updateCartQuantity()
    $('#priceOutput').text(JSON.parse(localStorage.getItem('cartTotalPrice')).toFixed(2))
    localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity))
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
    $(`#${element.productNr}.line-price`).text((element.price * element.inCart).toFixed(2));
  });
}

//Ta bort dessa? Följde med från getbootstrap.com. Hittar ingen funktionalitet för dessa, men när de är aktiva funkar inte clear cart

/*
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  
  btn.onclick = function() {
    modal.style.display = "block"
  }
  
  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  */

  $("#clear").click(function () {
    localStorage.clear()
    document.getElementById("total-items-in-cart").innerHTML = '0'
    document.getElementById("priceOutput").innerHTML = ''
    document.getElementById("cartOutput").innerHTML = "";
    let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))
    if(cartQuantity <=0 || cartQuantity==null){
      document.getElementById("cartDropdown").disabled = true
      document.getElementById("checkout-btn").disabled = true
      document.getElementById("to-checkout-link").href = '#';
      
    }else{
      document.getElementById("cartDropdown").disabled = false
      document.getElementById("checkout-btn").disabled = false
      document.getElementById("to-checkout-link").href = './pages/checkout/';
  
    }
  });


