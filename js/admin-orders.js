let allOrders = [];
let activeOrder;
const server = "https://hakimlivs.herokuapp.com/";
// const server = "https://hakim-livs.herokuapp.com/";
// const server = "http://localhost:8080/";
const updateOrderLink = server + "customerOrder/update";
const getAllOrders = server + "customerOrder/orders";

$(function () {
  load();
  reset();
});

function load() {
  axios
    .get(getAllOrders)
    .then((response) => {
      if (response.status === 200) {
        allOrders = response.data;
        renderOrders(allOrders);
      } else {
        swal("Något gick fel vid inläsning av order");
      }
    })
    .catch((err) => {
      alert("Serverfel!" + err);
    });
}

let startDate;
let endDate;

function renderOrders(orders) {
  $("#reservation").daterangepicker(null, function (start, end, label) {
    startDate = moment(start);
    endDate = moment(end);
  });
  $("#orders-container").empty();
  orders.forEach((order) => {
    const paymentStatusString = order.isPaid ? "Betald" : "Obetald";
    $("#orders-container").append(`
      <tr>
          <th scope="row" class="ps-md-5"><a href="#" class="order-number-link">${
            order.orderNumber
          }</a> </th>
          <th scope="row" class="ps-md-5" style="word-break:break-all;"><a href="#" class="customer-tab">${
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
  renderChosenOrder();
  renderUserData();
  addOrderToPdfBtn()
  $("#navbar-order-tab").tab("show");
  // sessionStorage.removeItem("chosenOrder");
}

function saveChosenOrder(id) {
  sessionStorage.setItem("chosenOrder", id);
}

function addOrderToPdfBtn(){
  let chosenId = Number(sessionStorage.getItem("chosenOrder"));

  allOrders.forEach((order) => {
    if (order.orderNumber == chosenId) {
      $("#generate-pdf").click(()=>{  
        generatPdf(order)
        printPdf();
      }
    )}
  })
}

function renderChosenOrder() {
  let chosenId = Number(sessionStorage.getItem("chosenOrder"));
  let totalCost = 0;
  
  $("#product-container").html("");
  allOrders.forEach((order) => {
    if (order.orderNumber == chosenId) {
      $("#order-heading").html(`Order ${order.orderNumber}`)
      activeOrder = order;
      
      // sorting shipping to show last 
      order.lineItems.sort(function(a, b){return b.product.sku - a.product.sku});

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
          
          <td class="text-end">${lineItem.itemPrice.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
          <td class="text-center">
          <form>
           <input
              type="text"
              class="quantity-field"
              value="${lineItem.quantity}"
              id="${lineItem.product.sku}"
              maxlength="3"
            />
            </form>
          </td>
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
    `${totalCost.toLocaleString("sv-SE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  );

  //Feel free to change this event set up - this was the only one I managed to get working
  const quantityFields = $(".quantity-field");
  for (var i = 0; i < quantityFields.length; i++) {
    quantityFields[i].addEventListener("blur", updateQuantity, false);
  }

  let $orderChanges = $("#order-changes");
  $orderChanges.html("");
  console.log(activeOrder);
  if(activeOrder.orderChanges.length>0){
    activeOrder.orderChanges.forEach((change) => {
    $orderChanges.prepend(`<li class="list-group-item">${
      change.changeDateTime.replace("T", " ")
      .substring(2, 16)} 
    <p>${change.description}</p></li>`);
  });
  }
  

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
  $("#customer-zipcode").val(activeOrder.appUser.zipCode);
  $("#customer-city").val(activeOrder.appUser.city.name);
  $("#customer-email").val(activeOrder.appUser.email);
  $("#customer-phone-number").val(activeOrder.appUser.phoneNumber);
}

$(document).on("click", "#save-order-btn", updateOrder);

function updateOrder() {
  activeOrder.isPaid = document.getElementById("payment-status").value;
  activeOrder.orderStatus.id = document.getElementById("order-status").value;
  let newCommentString = document.getElementById("add-comment-field").value;
  if (newCommentString != "" && testForWords(newCommentString)) {
    activeOrder.orderChanges.push(
      {
        description: newCommentString,
      changeDateTime: moment().toISOString(true)}
      );
      console.log(activeOrder.orderChanges);
    document.getElementById("add-comment-field").value = "";
  }

  axios
    .post(updateOrderLink, activeOrder)
    .then(() => {
      swal("Ordern är uppdaterad!")
      .then(()=> renderChosenOrder());
    })
    .catch(() => {
      swal("Något gick fel!", "Vänligen försök igen", "warning");
    });
}

function validateQuanityChange(value) {
  return /(\+|\-)?\d?\d/.test(value);
}

function updateQuantity(quantityField) {
  let sku = quantityField.target.id;
  let quantityString = $("#" + sku).val();
  if (!validateQuanityChange(quantityString)) {
    alert("Ogiltig antal produkter för vara " + sku);
    return;
  }

  activeOrder.lineItems.forEach((lineItem) => {
    if (lineItem.product.sku == sku) {
      let newQuantity;
      if (quantityString.startsWith("+")) {
        newQuantity = lineItem.quantity + Number(quantityString.substring(1));
      } else if (quantityString.startsWith("-")) {
        newQuantity = lineItem.quantity - Number(quantityString.substring(1));
      } else {
        newQuantity = Number(quantityString);
      }
      if (newQuantity > 99) {
        newQuantity = 99;
      } else if (newQuantity < 0) {
        newQuantity = 0;
      }
      lineItem.quantity = newQuantity;
      renderChosenOrder();
    }
  });
}

$("#search-btn").on("click", search);
$("#reset-btn").on("click", reset);

let orderStatusFilter;
let paymentStatusFilter;

function search() {
  let searchMode = $("#search-options-selector option:selected").val();
  let searchString = $("#order-search-text").val();
  orderStatusFilter = $("#filter-order-status-selector").val();
  paymentStatusFilter = $("#filter-payment-status-selector").val();

  let ordersMatchingStatuses = allOrders.filter((order) =>
    hasSearchedForStatuses(order)
  );
  let ordersMatchingDate = ordersMatchingStatuses.filter((order) =>
    filterByDate(order)
  );

  switch (searchMode) {
    case "NA":
      renderOrders(ordersMatchingDate);
      break;
    case "order-number":
      renderOrders(
        ordersMatchingDate.filter((order) =>
          order.orderNumber.toString().includes(searchString)
        )
      );
      break;
    case "total-price":
      if (searchString != "" && searchString != NaN) {
        let searchPrice = Number(searchString);
        renderOrders(
          ordersMatchingDate.filter(
            (order) => Number(order.totalCost) >= searchPrice
          )
        );
      } else {
        swal("Fel input!", "Du måste skriva in totalsumma", "warning");
      }
      break;
  }
}

function filterByDate(order) {
  let orderDate = moment(order.timeStamp);
  return (
    (orderDate.isSame(startDate, "day") || orderDate.isAfter(startDate)) &&
    (orderDate.isSame(endDate, "day") || orderDate.isBefore(endDate))
  );
}

function hasSearchedForStatuses(order) {
  let orderMatch =
    orderStatusFilter == "NA" ||
    order.orderStatus.id == Number(orderStatusFilter);
  let paymentMatch =
    paymentStatusFilter == "NA" || order.isPaid == Number(paymentStatusFilter);
  return orderMatch && paymentMatch;
}

function reset() {
  startDate = moment().subtract(1, "month");
  endDate = moment();

  $("#reservation").val(
    startDate.format("YYYY-MM-DD") + " - " + endDate.format("YYYY-MM-DD")
  );

  $("#filter-order-status-selector").val("NA");
  $("#filter-payment-status-selector").val("NA");
  $("#filter-payment-status-selector").val("NA");
  $("#order-search-text-form").val("");
  renderOrders(allOrders);
}
