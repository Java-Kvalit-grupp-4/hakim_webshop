let orders = [];
let activeOrder;
let startDate = null;
let endDate = null;
const server = "https://hakimlivs.herokuapp.com/";
// const server = "http://localhost:8080/";
const updateOrderLink = server + "customerOrder/update";
const getAllOrders = server + "customerOrder/orders";

$(
  axios
    .get(getAllOrders)
    .then((response) => {
      if (response.status === 200) {
        orders = response.data;
        renderOrders();
      } else {
        swal("Något gick fel vid inläsning av order");
      }
    })
    .catch((err) => {
      alert("Serverfel!" + err);
    })
);

function renderOrders() {
  $("#reservation").daterangepicker(null, function (start, end, label) {
    startDate = new Date(start.toISOString());
    endDate = new Date(end.toISOString());
  });

  orders.forEach((order) => {
    const paymentStatusString = order.isPaid ? "Betald" : "Obetald";
    $("#orders-container").append(`
      <tr>
          <th scope="row" class="ps-md-5"><a href="#" class="order-number-link">${
            order.orderNumber
          }</a> </th>
          <th scope="row" class="ps-md-5"><a href="#" class="customer-tab">${
            order.appUser.customerNumber
          }</a> </th>
          <td>${order.timeStamp.substring(0, 10)}</td>
          <td>${order.totalCost.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} </td>
          <td>${order.orderStatus.type}</td>
          <td>${paymentStatusString}</td>
      </tr>`);
  });
}

$(document).on("click", ".order-number-link", openOrderTab);

function openOrderTab() {
  saveChosenOrder(Number($(this).text()));
  renderLineItems();
  renderUserData();
  $("#navbar-order-tab").tab("show");
}

function saveChosenOrder(id) {
  sessionStorage.setItem("chosenOrder", id);
}

function renderLineItems() {
  let chosenId = Number(sessionStorage.getItem("chosenOrder"));
  let totalCost = 0;
  $("#product-container").html("");
  orders.forEach((order) => {
    if (order.orderNumber == chosenId) {
      activeOrder = order;
      order.lineItems.forEach((lineItem) => {
        console.log(lineItem);
        totalCost += Number(lineItem.itemPrice) * Number(lineItem.quantity);
        $("#product-container").append(`
        <tr>
          <th scope="row" class="ps-md-5">
            <a href="#" class="product-number-link">${lineItem.product.sku}</a>
          </th>
          <th scope="row" class="ps-md-5">
            <a href="#">${lineItem.product.title}</a>
          </th>
          <td>
          <form>
           <input
              type="text"
              class="quantity-field hi"
              value="${lineItem.quantity}"
              id="${lineItem.product.sku}"
              maxlength="3"
            />
            </form>
          </td>
          <td>${lineItem.itemPrice.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
          <td>${(
            Number(lineItem.itemPrice) * Number(lineItem.quantity)
          ).toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
        </tr>`);
      });
    }
  });
  $("#order-total-cost").html(
    `Totalt: ${totalCost.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  );

  //Feel free to change this event set up - this was the only one I managed to get working
  const quantityFields = $(".quantity-field");
  for (var i = 0; i < quantityFields.length; i++) {
    quantityFields[i].addEventListener("blur", updateQuantity, false);
  }


  console.log(activeOrder.orderChanges);
  const $orderChanges = $("#order-changes");
  $orderChanges.html("");
  activeOrder.orderChanges.forEach((change) => {
    $orderChanges.prepend(`<li class="list-group-item">${change.changeDateTime
      .replace("T", " ")
      .substring(2, 16)} 
    <p>${change.description}</p></li>`);
  });

  //Checks for nullish value
  const sentDateText = activeOrder.sentTimestamp
    ? `${activeOrder.sentTimestamp.replace("T", " ").substring(2, 16)}`
    : "Inte skickad";
  $("#order-sent-date-field").text(sentDateText);
  $("#order-status").val(activeOrder.orderStatus.id);
  $("#payment-status").val(activeOrder.isPaid);
  $("#customer-comment").val(activeOrder.orderComment);
}

function renderUserData() {
  $("#customer-first-name").val(activeOrder.appUser.firstName);
  $("#customer-last-name").val(activeOrder.appUser.lastName);
  $("#customer-street-address").val(activeOrder.appUser.streetAddress);
  $("#customer-zipcode").val(activeOrder.appUser.zipcode);
  $("#customer-city").val(activeOrder.appUser.city.name);
  $("#customer-email").val(activeOrder.appUser.email);
  $("#customer-phone-number").val(activeOrder.appUser.phoneNumber);
}

$(document).on("click", "#save-order-btn", updateOrder);

function updateOrder() {
  activeOrder.isPaid = document.getElementById("payment-status").value;
  activeOrder.orderStatus.id = document.getElementById("order-status").value;
  let newCommentString = document.getElementById("add-comment-field").value;
  if (newCommentString != "") {
    activeOrder.orderChanges.push(newCommentString);
    document.getElementById("add-comment-field").value = "";
  }

  axios
    .post(updateOrderLink, activeOrder)
    .then(() => {
      swal("Ordern är uppdaterad!");
    })
    .catch(() => {
      swal("Något gick fel!", "Vänligen försök igen", "warning");
    });
  console.log(activeOrder);
}

function validateQuanityChange(value) {
  return /(\+|\-)?\d?\d/.test(value);
}

function updateQuantity(quantityField) {
  console.log(quantityField);
  let sku = quantityField.target.id;
  let quantityString = $("#" + sku).val(); //fill with field value
  console.log("updating");
  console.log(sku);
  // let newQuantity = quantityField.target.val;
  // console.log(newQuantity);
  // console.log(quantityField.innertext);
/*   let field = $("#" + sku)
  console.log(field);
  console.log(typeof field);
  console.log(field[0]);
  console.log(typeof field[0]);
  console.log("Method " + field.val());
  console.log(typeof field.val); */

  console.log(quantityString);
  if (!validateQuanityChange(quantityString)) {
    alert("Ogiltig antal produkter för vara " + sku);
    return;
  }

  activeOrder.lineItems.forEach(lineItem => {
    if (lineItem.product.sku == sku) {
      let newQuantity;
      if (quantityString.startsWith("+")) {
        newQuantity = lineItem.quantity + Number(quantityString.substring(1));
      } else if (quantityString.startsWith("-")) {
        newQuantity = lineItem.quantity - Number(quantityString.substring(1))
      } else {
        newQuantity = Number(quantityString)
      }
      if (newQuantity > 99) {
        newQuantity = 99;
      } else if (newQuantity < 0) {
        newQuantity = 0;
      }
      lineItem.quantity = newQuantity;
      renderLineItems();
    }
  });
}

/* function addProduct(product) {
  console.log(product);
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
    JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
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
    JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
} */

$(document).on("click", "#filter-button", filterSearch);

function filterSearch() {
  console.log("Printing dates");
  console.log(startDate);
  console.log(endDate);

  /*
  //let tempOrders = [];
  let filter = $("#search-select option:selected").text();
  let input = $("#input").val();

  $("#customerTable").empty();
  switch (filter) {
    case "Visa alla":
      showCustomers(customers);
      break;
    case "Vip-kunder":
      showCustomers(customers.filter((customer) => customer.isVip == true));
      break;
    case "Total ordersumma över:":
      if (input != "" && input != NaN) {
        resetsInputBorders();
        axios.get(getAllOrders).then((response) => {
          let filterCustomers = [];
          let filterOrders = response.data;
          let date;
          let filterOrders2 = [];
          if (startDate != null && endDate != null) {
            filterOrders.forEach((order) => {
              date = new Date(order.timeStamp);
              if (date >= startDate && date <= endDate) {
                filterOrders2.push(order);
              }
            });
          }
          customers.forEach((customer) => {
            if (
              getTotalPriceOfOrders(
                filterOrders2.filter(
                  (order) =>
                    order.appUser.customerNumber == customer.customerNumber
                )
              ) > input
            ) {
              filterCustomers.push(customer);
            }
          });
          showCustomers(filterCustomers);
        });
      } else {
        swal("Fel input!", "Du måste skriva in totalsumma", "warning");
      }
      break;
    case "Totalt antal ordrar över:":
      if (input != "" && input != NaN) {
        resetsInputBorders();
        axios.get(getAllOrders).then((response) => {
          let filterCustomers = [];
          let filterOrders = response.data;
          let date;
          let filterOrders2 = [];
          console.log("startdate: " + startDate + "endDate: " + endDate);
          if (startDate != null && endDate != null) {
            filterOrders.forEach((order) => {
              date = new Date(order.timeStamp);
              console.log(date);
              if (date >= startDate && date <= endDate) {
                filterOrders2.push(order);
              }
            });
          }
          customers.forEach((customer) => {
            if (
              customerOrderLength(
                filterOrders2.filter(
                  (order) =>
                    order.appUser.customerNumber == customer.customerNumber
                )
              ) > input
            ) {
              filterCustomers.push(customer);
            }
          });
          showCustomers(filterCustomers);
        });
      } else {
        swal("Fel input", "Du måste skriva in totalt antal ordrar", "warning");
      }
      break;
  }
  */
}
