let orders = [];
let activeOrder;
let startDate = null;
let endDate = null;
const server = "https://hakimlivs.herokuapp.com/";
// const server = "https://hakim-test.herokuapp.com/";
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
          <td><a id="generate-pdf" href="../admin/pdf/generatePDF.html">pdf</a></td>
      </tr>`);
  });
}

$(document).on("click", ".order-number-link", openOrderTab);

$(document).on("click", ".generate-pdf", openPdfGenerator);

function openPdfGenerator() {
  saveChosenOrder(Number($(this).text()));
  orders.forEach((order) => {
    if (order.orderNumber == saveChosenOrder){
      generatPdf(order)
    }

  })
}



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
        totalCost += Number(lineItem.itemPrice) * Number(lineItem.quantity);
        $("#product-container").append(`
        <tr>
          <th scope="row" class="ps-md-5">
            <a href="#" class="product-number-link">${lineItem.product.sku}</a>
          </th>
          <th scope="row" class="ps-md-5">
            <a href="#">${lineItem.product.title}</a>
          </th>
          <td>${lineItem.quantity}</td>
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

  console.log(activeOrder.orderChanges);
  const $orderChanges = $("#order-changes");
  $orderChanges.html("");
  activeOrder.orderChanges.forEach(change => {
    $orderChanges.prepend(`<li class="list-group-item">${change.changeDateTime.replace("T", " ").substring(2, 16)} 
    <p>${change.description}</p></li>`)
  });

  //Checks for nullish value
  const sentDateText = activeOrder.sentTimestamp ? `${activeOrder.sentTimestamp.replace("T", " ").substring(2, 16)}` : "Inte skickad";
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
