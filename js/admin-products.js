$(document).ready(loadProducts);

let products = [];
let categories = [];
let uniqueCategories = [];
let tags = [];

function loadProducts() {
  axios
    .get("https://hakimlivs.herokuapp.com/products/")
    .then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        products = response.data;
        render(products);
      } else {
        alert("Något gick fel vid inläsning av produkter");
      }
    })
    .catch((err) => {
      alert("Serverfel! " + err);
    });
  
  
  function render(products) {
    //console.log($("#isProductHidden").attr("checked"));
      products.forEach((element) => {
      for (let i = 0; i < element.categories.length; i++) {
        let obj = element.categories[i];
        categories.push(obj.name);
      }
    });

    /**
     * Delete duplicates from the array of categories
     */
    uniqueCategories = [...new Set(categories)];

    /**
     * Dynamically add categories to choose into form-select
     */
    uniqueCategories.forEach((element) => {
      $("#select").append(`
        <option id="${element}" value="${element}">${element}</option>`);
    });

    showCategories();
    showProducts(products);

    /**
     * Add products that belong to the celected category
     */
    $("#select").on("change", function () {
      let optionId = $(this).val();
      console.log(optionId)
      let list = [];
      products.forEach((element) => {
        for (let i = 0; i < element.categories.length; i++) {
          let obj = element.categories[i];
          if (obj.name === optionId) {
            $("#products").empty();
            list.push(element);
            showProducts(list);
          }
          if (optionId === "Kategori") {
            $("#products").empty();
            showProducts(products);
          }
        }
      });
    });

    $("#tab-product-catalog").click(function () {
      location.reload();
      showProducts(products);
    });

    /**
     * Add new tags to the list of tags on selected product
     */
    $("#tagSave").click(function () {
      let input = $("#tagInput").val();
      //console.log(input);
      $("#tagColumn").append(`
          <div id="${input}" class="form-check">
                      <input checked class="form-check-input me-3 tag" type="checkbox" value="" id="${input}" onchange="removeIfUnchecked(${input})">
                      <label class="form-check-label" for="${input}">${input}</label>
                  </div>
          `);

      tags.push(input);

      $("#tagSave").val("");
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

    let sku = "";

    /**
     * Select product's info and add it to the form on product site
     * Make check-boxes of the available categories and add property "checked" to the one corresponding the product's category
     */
    $("#choose").click(function () {
      $("#column").empty();
      $("#tagColumn").empty();
      $("#tagInput").val("");
      $("#isProductHidden").prop("checked", false);
      console.log($("#isProductHidden").val());

      products.forEach((element) => {
        if (element.sku == productId) {
          $("#title").val(element.title);
          $("#brand").val(element.brand.name);
          $("#description").val(element.description);
          $("#imge").val(element.image);
          $("#price").val(element.price);
          $("#lager").val(element.quantity);
          showCategories();
          showTags(element);
          sku = element.sku;
          if (element.isAvailable === false) {
          $("#isProductHidden").prop("checked", true);
        }
        }
      
        $("#column div").filter(function () {
          for (let i = 0; i < element.categories.length; i++) {
            let obj = element.categories[i];

            if (element.sku == productId && obj.name == $(this).attr("id")) {
              $(this).replaceWith(function () {
                return `<div class="form-check ">
               <input class="form-check-input tag" type="checkbox" value="" id="${obj.name}" checked>
               <label class="form-check-label" for="cat1">${obj.name}</label>
           </div>`;
              });
            }
          }
        });
      });

      $("#tab-product-site").tab("show");
    });

    /**
     * Make object of selected product and post it
     */
    $("#saveChanges").click(function () {
      let cat = [];
      $("#column div")
        .children()
        .each(function () {
          if ($(this).is(":checked")) {
            let element = $(this).attr("id");
            cat.push(element);
          }
        });
      let productCategory = [];
      cat.forEach((element) => {
        productCategory.push({ name: element });
      });
      //console.log(productCategory);

      let isAvailable = true;

      if ($("#isProductHidden").is(":checked")) {
        isAvailable = false;
      }
     

      let productObject = {
        sku: sku,
        description: $("#description").val(),
        image: $("#img").val(),
        isAvailable: isAvailable,
        price: $("#price").val(),
        quantity: $("#lager").val(),
        title: $("#title").val(),
        brand: {
          name: $("#brand").val(),
        },
        tags: tags,

        categories: productCategory,
      };

      console.log(productObject);
      alert("Produkten har sparats");

        axios.post("https://hakimlivs.herokuapp.com/products/upsertProduct",  productObject  )
        .then(() => {
          console.log("Done!")
        })
        .catch(() => {
          alert('Något fick fel!','Vänligen försök igen', 'warning')
        })
    });

    $("#saveNewProduct").click(function () {
      let cat = [];
      $("#column div")
        .children()
        .each(function () {
          if ($(this).is(":checked")) {
            let element = $(this).attr("id");
            cat.push(element);
          }
        });
      let productCategory = [];
      cat.forEach((element) => {
        productCategory.push({ name: element });
      });
      //console.log(productCategory);

      let isAvailable = true;

      if ($("#isProductHidden").is(":checked")) {
        isAvailable = false;
      }
     

      let productObject = {
        sku: sku,
        description: $("#description").val(),
        image: $("#img").val(),
        isAvailable: isAvailable,
        price: $("#price").val(),
        quantity: $("#lager").val(),
        title: $("#title").val(),
        brand: {
          name: $("#brand").val(),
        },
        tags: tags,

        categories: productCategory,
      };

      console.log(productObject);
      alert("Produkten har sparats");

        axios.post("https://hakimlivs.herokuapp.com/products/add",  productObject  )
        .then(() => {
          console.log("Done!")
        })
        .catch(() => {
          alert('Något fick fel!','Vänligen försök igen', 'warning')
        })
    });

      /**
     * Empty form to add new product
     */
    $("#new").click(function () {
      $("#title").val("");
      $("#brand").val("");
      $("#description").val("");
      $("#imge").val("");
      $("#sku").val("");
      $("#price").val("");
      $("#lager").val("");
      $("input").prop("checked", false);

      $("#tab-product-site").tab("show");
    });
    
  }
}

/**
 * Generates a table with products
 * @param {Array} l - Webshop products to be displayed on the page
 */
function showProducts(l) {
  l.forEach((element) => {
    $("#products").append(
      `<tr id="${element.sku}">
            <td>${element.sku}</td>
            <td >${element.title}</td>
            <td >${element.brand.name}</td>
            <td>${element.price.toLocaleString("sv-SE", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} kr</td>
            <td> ${element.quantity}</td>
            </tr>`
    );
  });
}

function showCategories() {
  uniqueCategories.forEach((element) => {
    $("#column").append(`
        <div id="${element}" class="form-check">
                    <input class="form-check-input me-3" type="checkbox" value="" id="${element}">
                    <label class="form-check-label" for="cat1">${element}</label>
                </div>
        `);
  });
}

function showTags(element) {
  let tags = element.tags;
 // console.log(tags);
  tags.forEach(e => {
  //  console.log(e.name);
  $("#tagColumn").append(`
          <div id="${e.name}" class="form-check">
                      <input checked class="form-check-input me-3 tag" type="checkbox" value="" id="${e.name}" onchange="removeIfUnchecked(${e.name})">
                      <label class="form-check-label" for="${e.name}">${e.name}</label>
                  </div>
          `);
        })
}

function removeIfUnchecked(value) {
  let v = $(this).children;
//  console.log(v);
//  console.log(value);
}
