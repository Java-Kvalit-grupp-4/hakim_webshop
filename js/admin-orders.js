let orders = [];
let activeOrder;

$(function () {
  fetch("../../TestData/test_data_orders.json")
    .then((response) => response.json())
    .then((response) => (orders = response))
    .then((response) => renderOrders(orders));
});

function renderOrders(orders) {
  orders.forEach((order) => {
    const paymentStatusString = order.isPaid
      ? "Mottagen"
      : "Väntar på betalning";
    $("#orders-container").append(`
      <tr>
          <th scope="row" class="ps-md-5"><a href="#" class="order-number-link">${
            order.id
          }</a> </th>
          <th scope="row" class="ps-md-5"><a href="#" class="customer-tab">${
            order.user.customerNumber
          }</a> </th>
          <td>${order.orderTimestamp}</td>
          <td>${order.totalCost.toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} </td>
          <td>${order.status.type}</td>
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

  // let order;
  let chosenId = Number(sessionStorage.getItem("chosenOrder"));
  let totalCost = 0;

  $("#product-container").html("");
  orders.forEach((order) => {
    if (order.id == chosenId) {
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
}

function renderUserData() {
  $("#customer-first-name").val(activeOrder.user.firstName);
  $("#customer-last-name").val(activeOrder.user.lastName);
  $("#customer-street-address").val(activeOrder.user.streetAddress);
  $("#customer-zipcode").val(activeOrder.user.zipcode);
  $("#customer-city").val(activeOrder.user.city.name);
  $("#customer-email").val(activeOrder.user.email);
  $("#customer-phone-number").val(activeOrder.user.phoneNumber);
}

/* $(function () {
  fetch("../../TestData/test_data_orders.json")
    .then((response) => response.json())
    .then((response) => renderOrders(response))
});

function renderOrders(response) {
  orders = response
  let output = ""; 
  orders.forEach((element) => {
    const paidString = element.isPaid ? "Mottagen" : "Väntar på betalning";
    output += `
      <tr>
          <th scope="row" class="ps-md-5"><a href="#">${element.orderId}</a> </th>
          <th scope="row" class="ps-md-5"><a href="#">${element.user.id}</a> </th>
          <td>${element.orderTimestamp}</td>
          <td>${element.totalCost} kr</td>
          <td>${element.status.type}</td>
          <td>${paidString}</td>
      </tr>
      `
  });
  $('#orders-container').append(output);
}  */

// $(document).ready(() => {

//   /**
//    * Cacha variabels
//    */
//   let orderContainer = $('#orders-container')
//   let urlToOrders = "../../TestData/test_data_orders.json"

//   /**
//    * Renders response from url
//    */
//  $.getJSON(urlToOrders, (response) => {
//   $.each(response, (index, element) => {
//     orderContainer.append(`
//         <tr>
//           <th scope="row" class="ps-md-5"><a href="#">${element.orderId}</a> </th>
//           <th scope="row" class="ps-md-5"><a href="#">${element.user.id}</a> </th>
//           <td>${element.orderTimestamp}</td>
//           <td>${element.totalCost} kr</td>
//           <td>${element.status.type}</td>
//           <td>Mottagen</td>
//         </tr>
//       `
//     )
//   })
// })
// })
