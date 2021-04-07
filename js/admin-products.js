$(document).ready(loadProducts);

let products = [];
let categories = [];

function loadProducts() {
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
        if (element.category === optionId) {
          $("#products").empty();
          list.push(element);
          showProducts(list);
        }
        if (optionId === "all") {
          $("#products").empty();
          showProducts(products);
        }
      })
    });

    uniqueCategories.forEach(element => {
      $("#column").append(`
          <div id="${element}" class="form-check">
                      <input class="form-check-input me-3" type="checkbox" value="" id="${element}">
                      <label class="form-check-label" for="cat1">${element}</label>
                  </div>
          `)
    });

    $("#inputSave").click(function () {
      let input = $("#categoryInput").val();
      $("#column").append(`
          <div id="${input}" class="form-check">
                      <input class="form-check-input me-3" type="checkbox" value="" id="${input}">
                      <label class="form-check-label" for="cat1">${input}</label>
                  </div>
          `);

      uniqueCategories.push(input);
      $("#categoryInput").val("");
    });

    let productId = "";
    let cat = "";
    $("#products").on("click", "tr", function () {
      $(this).addClass("highlight").siblings().removeClass("highlight");
      productId = $(this).attr("id");
    });

    $("#choose").click(function () {
      $("#column div input").replaceWith(function () {
        return `
        <input class="form-check-input me-3" type="checkbox" value="">`
      })
      products.forEach(element => {
        if (element.id == productId) {
          $("#title").val(element.title);
          $("#description").val(element.description);
          $("#imge").val(element.image);
          $("#price").val(element.price);
          $("#lager").val(element.amount);
        }
        $("#column div").filter(function () {
          if (element.id == productId && element.category == $(this).attr("id")) {
            $(this).replaceWith(function () {
              return `<div class="form-check">
               <input class="form-check-input me-3" type="checkbox" value="" id="${element.category}" checked>
               <label class="form-check-label" for="cat1">${element.category}</label>
           </div>`
            })
          }
        });
      });
      alert("Produkten är vald. Gå till Produktsida.")
    });
  }
}

/**
* Generates a table with products
* @param {Array} l - Webshop products to be displayed on the page  
*/
function showProducts(l) {
  l.forEach(element => {
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






