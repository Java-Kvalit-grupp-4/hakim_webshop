let orders = [];

  $(function () {
  fetch("../../TestData/test_data_orders.json")
    .then((response) => response.json())
    .then((response) => (orders = response))
    .then((response) => renderOrders(orders));
});

function renderOrders(orders) {
  orders.forEach((element) => {
    const paidString = element.isPaid ? "Mottagen" : "Väntar på betalning";
    $("#orders-container").append(`<tr>
          <th scope="row" class="ps-md-5"><a href="#">${element.orderId}</a> </th>
          <th scope="row" class="ps-md-5"><a href="#">${element.user.id}</a> </th>
          <td>${element.orderTimestamp}</td>
          <td>${element.totalCost} kr</td>
          <td>${element.status.type}</td>
          <td>${paidString}</td>
      </tr>`);
  });
}  

$(document).on('click', '.order-tab', openOrderTab);

function openOrderTab(){
    saveCustomer($(this).text());
    $("#nav-contact-tab").tab('show');
    };

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


