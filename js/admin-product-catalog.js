$(document).ready(load);

let products = [];
let categories = [];

function load() {
  fetch("../../TestData/test_data_v.1.0.JSON")
    .then((response) => response.json())
    .then((data) => render(data))
    .catch((error) => console.error(error));

  function render(data) {
    products = data;

    products.forEach(obj => {
      Object.assign(obj, { amount: 15 });
    })

    products.forEach(element => {
      categories.push(element.category)
    });

    let uniqueCategories = [...new Set(categories)];

    uniqueCategories.forEach(element => {
      $("#select").append(`
        <option id="${element}" value="${element}">${element}</option>`
      );
    });

    $("#select option").on("click", function () {
      let optionId = $(this).attr("id");
      let list = [];
      products.forEach(element => {
        if (element.category == optionId) {
          list.push(element);
          $("#products").empty();
          showProducts(list);
        }
        if (optionId === "all") {
          $("#products").empty();
          showProducts(products);
        }
      })
    });

  }

}

/**
 * Generates a table with products
 * @param {Array} list - Webshop products to be displayed on the page  
 */
function showProducts(list) {
    list.forEach(element => {
        let round = parseInt(element.price).toFixed(2);
        $("#products").append(
            `<tr id="${element.id}">
              <td>${element.id}</td>
              <td ><h5 >${element.title}</h5></td>
              <td ><h5 >Hakim</h5></td>
              <td>${round} kr</td>
              <td> ${element.amount}</td>
              </tr>`
        )
    });
}
