// const fetchUrl = "https://hakimlivs.herokuapp.com/products/";
const fetchUrl = "http://localhost:8080/products";
// const updateUrl = "https://hakimlivs.herokuapp.com/products/upsertProduct";
const updateUrl = "http://localhost:8080/products/upsertProduct";
const postUrl = "http://localhost:8080/products/add";
// const postUrl = "https://hakimlivs.herokuapp.com/products/add";
$(document).ready(loadProducts);

let products = [];
let categories = [];
let uniqueCategories = [];
let tags = [];

function loadProducts() {
  axios
    .get(fetchUrl)
    .then((response) => {
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
      products.forEach((element) => {
      for (let i = 0; i < element.categories.length; i++) {
        let obj = element.categories[i];
        categories.push(obj.name);
      }
      console.log(products)
      console.log("Utan moms:" + (element.price/element.vat));
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

      let categoryName = $(this).val();
      let list = [];
      products.forEach((element) => {
        for (let i = 0; i < element.categories.length; i++) {
          let obj = element.categories[i];
          if (obj.name === categoryName) {
            $("#products").empty();
            list.push(element);
            showProducts(list);
          }
          if (categoryName === "Kategori") {
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
      $("#tagColumn").append(`
          <div id="${input}" class="form-check">
                      <input checked class="form-check-input me-3 tag" type="checkbox" value="" id="${input}" onchange="removeIfUnchecked(${input})">
                      <label class="form-check-label" for="${input}">${input}</label>
                  </div>
          `);

      tags.push({ name: input});

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

      products.forEach((element) => {
        if (element.sku == productId) {
          $("#title").val(element.title);
          $("#brand").val(element.brand.name);
          $("#description").val(element.description);
          $("#img").val(element.image);
          imageStringForProduct=element.image;
          $('#img').attr('src', element.image)
          $('#unit').val(element.unit)
          $("#weight_volume").val(element.volume);
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
     
      let productCategories = createCategoriesForProduct();
      let isAvailable = checkIfProductIsAvalible();
     

      let productObject = {
        sku: sku,
        title: $("#title").val(),
        description: $("#description").val(),
        image: imageStringForProduct,
        isAvailable: isAvailable,
        price: $("#price").val(),
        unit: $("#unit").children(":selected").attr("id"),
        volume: $("#weight_volume").val(),
        quantity: $("#lager").val(),
        vat: Number($("#VAT").val()),
        brand: {
          name: $("#brand").val(),
        },
        tags: tags,
        categories: productCategories,
      };

      console.table(productObject);


      swal("Produkten har sparats");

        axios.post(updateUrl,  productObject  )
        .then(() => {
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

  tags.forEach(e => {

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
}




/* "https://hakimlivs.herokuapp.com/api/v1/upload/db" */

//--------------------- CREATE NEW PRODUCT ------------------------------\\

let imageStringForProduct;
let weightVolume;
let unit;

const productImageUpload = (fileInputField) => {
    let formData = new FormData();
    let fileName = fileInputField.prop('files')[0].name.replaceAll(' ','')
    let imagefile = fileInputField.prop('files')[0]

    if (imagefile != undefined) {
      formData.append("file", imagefile, fileName);
      axios
        .post("https://hakimlivs.herokuapp.com//api/v1/upload/db", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          swal("Ny bild uppladdad", "Uppladdningen lyckades", "success")
            .then(imageStringForProduct = `${resp.data.downloadUrl}/${resp.data.fileName}`)
        })
        .catch((err) => {
          if(err.response.status == 500){
            swal("Bildnamn finns redan!", "Ändra bildnamn eller ladda upp en annan bild", "warning");
          }else{
            swal("Något fick fel!", "Vänligen försök igen", "warning");
          }   
        });
    }
}

// eventlisteners

// create product
$('#new-product').click(() => {
  if(imageStringForProduct == undefined ||imageStringForProduct == "" ){
    swal('Varning', 'Du kan inte skapa en produkt utan att ladda upp produktbild', 'warning')
  }else{
    createProductInDataBase()
  }
  
})

// setting the unit on change 

  
 
// skapa productobject
const createProductObjekt = () => {
  unit =  $("#unit").val();
  weightVolume = $('#weight_volume').val();

  let productCategories = createCategoriesForProduct();
  let isAvailable = checkIfProductIsAvalible();

  return {
    title: $("#title").val(),
    description: $("#description").val(),
    image: imageStringForProduct,
    isAvailable: isAvailable,
    price: $("#price").val(),
    unit: unit,
    volume: weightVolume,
    quantity: $("#lager").val(),
    vat: Number($("#VAT").val()),
    brand: {
      name: $("#brand").val(),
    },
    tags: tags,
    categories: productCategories,
  };
}

const createCategoriesForProduct = () => {
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
  return productCategory;
}

const createTagsForProduct = () => {

}

const checkIfProductIsAvalible = () => {
      if ($("#isProductHidden").is(":checked")) {
        return false;
      }else {
        return true;
      }
  
}

const createProductInDataBase = () => {

  const newProduct = createProductObjekt()

  console.table(newProduct)

  axios.post(postUrl,  newProduct)
        .then(() => {
          swal("Ny produkt tillagd", '', "success")
          imageStringForProduct = ""
        })
        .catch(() => {
          swal('Något fick fel!','Vänligen försök igen', 'warning')
        })
      
}



// render the uploaded file to preview
$('#fileUpload').change(function() {
  let reader = new FileReader();
  console.log(this.files[0].size);
  if(this.files[0].size > 250000){
    swal('Bilden är för stor!', 'max gräns är 250,0 kb', 'warning')
  }else{
    reader.onload = (e) => $('#img').attr('src', e.target.result)
  reader.readAsDataURL(this.files[0]);
  }
})

$('#uploadButton').click(() => {
  productImageUpload($('#fileUpload'))
})
