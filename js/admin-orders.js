let orders = [];

$(function () {
  fetch("../../TestData/test_data_orders.json")
    .then((response) => response.json())
    .then((response) => (orders = response))
    .then((response) => renderOrders(orders));
});

function renderOrders(orders) {
  let output = ""; 
  orders.forEach((element) => {
    const paidString = element.isPaid ? "Mottagen" : "Väntar på betalning";
    output += `<tr>
          <th scope="row" class="ps-md-5"><a href="#">${element.orderId}</a> </th>
          <th scope="row" class="ps-md-5"><a href="#">${element.user.id}</a> </th>
          <td>${element.orderTimestamp}</td>
          <td>${element.totalCost} kr</td>
          <td>${element.status.type}</td>
          <td>${paidString}</td>
      </tr>`;
  });
  console.log(output);
  $("#order-output").append(output);
}
