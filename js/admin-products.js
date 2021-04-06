$(document).ready(load);
$(document).ready(loadCategories);
$(document).ready(select);


let products = [];
let categories = [];
let list = [];

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
      //let list = [];
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

function loadCategories() {
    fetch("../../TestData/test_data_v.1.0.JSON")
    .then((response) => response.json())
    .then((data) => render(data))
    .catch((error) => console.error(error));

  function render(data) {
    products = data;

    products.forEach(element => {
      categories.push(element.category)
    });

    let uniqueCategories = [...new Set(categories)];

    uniqueCategories.forEach(element =>{
        $("#column").append(`
        <div class="form-check">
                    <input class="form-check-input me-3" type="checkbox" value="" id="${element}">
                    <label class="form-check-label" for="cat1">${element}</label>
                </div>
        `)

    });

    $("#inputSave").click(function(){
       let input = $("#categoryInput").val();
       $("#column").append(`
        <div class="form-check">
                    <input class="form-check-input me-3" type="checkbox" value="" id="${input}">
                    <label class="form-check-label" for="cat1">${input}</label>
                </div>
        `);
        uniqueCategories.push(input);
        $("#categoryInput").val("");
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

function select() {
  $("#products").on("click", "tr", function () {
    $(this).addClass("highlight").siblings().removeClass("highlight");
    let productId = "";
    list.forEach(element => {
      if (element.id == $(this).find("tr").attr("id")) {
        productId = id;
        console.log(productId);
      }
    })
    
  })
}
