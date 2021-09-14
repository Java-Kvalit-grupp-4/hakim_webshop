$(document).ready(load());

$(document).on("click", ".productNumber", saveAndOpenProduct);

function load() {
  const config = getHeaderObjWithAuthorization();
  axios.get(getAllOrders, config).then((response) => {
    getOrderStatus(response.data);
    //console.log(response.data)
  });

  axios.get(getAllProducts, config).then((response) => {
    getOutOfStockProducts(response.data);
  });
}

function getOutOfStockProducts(data) {
  console.log(data);

  data.forEach((product) => {
    if (product.quantity < 1) {
      $("#products").append(`
                <tr>
                <th><a href="#" class="productNumber">${product.sku}</a></th>
                <td>${product.title}</td>
                <td>${product.brand.name}</td>
                <td>${product.price.toLocaleString("sv-SE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}</td>
              </tr>`);
    }
  });
}

function getOrderStatus(data) {
  let waiting = 0;
  let picking = 0;
  let ready = 0;
  let sent = 0;
  let canceled = 0;
  data.forEach((element) => {
    console.log(element.orderStatus.type);
    switch (element.orderStatus.type) {
      case "Ohanterad":
        waiting += 1;
        break;
      case "Plockas":
        picking += 1;
        break;
      case "Skickad":
        sent += 1;
        break;
      case "Avbeställd":
        canceled += 1;
        break;
    }
  });
  $("#waitingForHandling").text(waiting);
  $("#pickingInProgress").text(picking);
  $("#readyForSending").text(ready);
  $("#sent").text(sent);
  $("#canceled").text(canceled);
}

function saveAndOpenProduct() {
  sessionStorage.setItem("productNumber", Number($(this).text()));
  location.replace("Products/index.html");
}
