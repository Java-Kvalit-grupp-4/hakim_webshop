$(document).ready(loadProducts);

let products = [];
let categories = [];

function loadProducts() {
  fetch("../../TestData/test_data_products_v1.2.JSON")
    .then((response) => response.json())
    .then((data) => render(data))
    .catch((error) => console.error(error));

  function render(data) {
    products = data;

    /**
     * Add "lager status" to every product
     */
    products.forEach(obj => {
      Object.assign(obj, { amount: 15 });
    })

    
    products.forEach(element => {
      categories.push(element.category)
    });

    /**
     * Delete duplicates from the array of categories
     */
    let uniqueCategories = [...new Set(categories)];

    /**
     * Dynamically add categories to choose into form-select 
     */
    uniqueCategories.forEach(element => {
      $("#select").append(`
        <option id="${element}" value="${element}">${element}</option>`
      );
    });

/**
 * Add products that belong to the celected category
 */
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

/**
 * Add new category to the list of existed categories on product site 
 */
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


/**
 * Highlight chosen product in the table and select its id
 */
    let productId = "";
    $("#products").on("click", "tr", function () {
      $(this).addClass("highlight").siblings().removeClass("highlight");
      productId = $(this).attr("id");
    });

/**
 * Select product's info and add it to the form on product site
 * Make check-boxes of the available categories and add property "checked" to the one corresponding the product's category
 */
    $("#choose").click(function () {

      $("#column").empty();

      products.forEach(element => {
        if (element.id == productId) {
          $("#title").val(element.title);
          $("#brand").val(element.brand);
          $("#description").val(element.description);
          $("#imge").val(element.image);
          $("#weight").val($(element).attr("weight/volume"));
          $("#price").val(element.price);
          $("#lager").val(element.amount);
          uniqueCategories.forEach(element => {
            $("#column").append(`
                <div id="${element}" class="form-check">
                            <input class="form-check-input me-3" type="checkbox" value="" id="${element}">
                            <label class="form-check-label" for="cat1">${element}</label>
                        </div>
                `)
          });
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

      $("#tab-product-site").tab("show");

    });

    /**
     * Empty form to add new product
     */
    $("#new").click(function () {
      $("#title").val("");
      $("#brand").val("");
      $("#description").val("");
      $("#imge").val("");
      $("#weight").val("");
      $("#price").val("");
      $("#lager").val("");
      $("input").prop("checked", false);
      $("#tab-product-site").tab("show");
    });

    /**
     * Make object of selected product 
     */
    $("#saveChanges").click(function () {
      let cat = []
      $("#column div").children().each(function () {
        if ($(this).is(":checked")) {
          let element = $(this).attr("id");
          cat.push(element)
        }
      })

      let productObject = {
        sku: productId,
        description: $("#description").val(),
        image: $("#img").val(),
        is_available: true,
        price: $("#price").val(),
        quantity: $("#lager").val(),
        title: $("#title").val(),
        brand: $("#brand").val(),
        tags: $("#tags").val(),
        categories: cat
      };
      console.log(productObject)
      alert("Produkten har sparats")
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
            <td>${element.productNr}</td>
            <td ><h5 >${element.title}</h5></td>
            <td ><h5 >${element.brand}</h5></td>
            <td>${element.price} kr</td>
            <td> ${element.amount}</td>
            </tr>`
    )
  });
}






