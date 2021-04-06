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