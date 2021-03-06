let products = [];
let password = $("#login-password");
let email = $("#login-email");
let navLoginBtn = $("#login-btn");
let loginbutton2 = $("#login-button");
let wrongEmail = $("#wrong-email");
let wrongPassword = $("#wrong-password");
let whichPage = $("#login-page");
const totalItemsInCart = $("#total-items-in-cart");

let emailToCheck = $("#login-email"),
    passwordToCheck = $("#login-password"),
    loginModal = $("#login-modal"),
    myAccountMenu = $("#myAccountDropdown");

let adminview = $("#admin-view-link");

let getCustomerUrl = 'https://hakimlivs.herokuapp.com/users/getUser/'
// let getCustomerUrl = 'https://hakim-test.herokuapp.com/users/getUser/'

//const addUserUrl = "http://localhost:8080/users/add"
const addUserUrl = "https://hakimlivs.herokuapp.com/users/add";
// const addUserUrl = "https://hakim-test.herokuapp.com/users/add";

/**
 * Eventlistener

 */ 
$("#newCust-button").click(() => {
  $("#registerForm").modal("show");
});

$("#checkout-button").click(function () {
  let customer = JSON.parse(sessionStorage.getItem("customer"));
  if (customer == null || customer == undefined) {
    swal("Du måste vara inloggad för att lägga beställning", "", "warning");
  } else {
    fetchCustomerInfo(customer, "./pages/checkout/")
  }
});

function fetchCustomerInfo(customer, openPage){
  axios
    .get(getCustomerUrl+customer.email)
    .then((response) => {
      console.log(response.data)
      setCustomer(response.data)
      location.replace(openPage)
    })
//     .catch((err) => {
//       alert(err);
//     });
}

function setCustomer(customer){
  sessionStorage.setItem("customer", JSON.stringify(customer))
}


$("#show-password-button").click(function () {
    if ($(this).text() == "Visa") {
        $(this).text("Dölj");
        password.attr("type", "text");
    } else {
        $(this).text("Visa");
        password.attr("type", "password");
    }
});

$("#login-btn").click(function () {
    if ($(this).text() == "Logga in") {
        $("#login-modal").modal("show");
        $("#checkOutLink").attr("href", "./pages/checkout/");
    } else {
        sessionStorage.removeItem("customer");
        $("#myAccountDropdown").hide();
        $(this).text("Logga in");
        $("#checkOutLink").attr("href", "#");
        adminview.hide();

    }
});

$("#myAccountDropdown").click(function(){
  let customer = JSON.parse(sessionStorage.getItem("customer"));
  fetchCustomerInfo(customer, "pages/my-account/my-account.html")
})

$("form").submit(false);

$(document).ready(() => {
  totalItemsInCart.hide();
  hideOrShowAdminView();
  load();

})

function load() {
    //const productsUrl = './TestData/test_data_products_v1.2.JSON'
    // const productsUrl = 'http://localhost:8080/products'
    const productsUrl = "https://hakimlivs.herokuapp.com/products";
    // const productsUrl = "https://hakim-test.herokuapp.com/products";
    //const productsUrl = "https://hakimlogintest.herokuapp.com/products";


    axios
        .get(productsUrl)
        .then((response) => {
            renderCategories(response.data);
            addShippingProductToLocalStorage(response.data);
        })
        .catch((err) => {
            alert(err);
        });
}

const addShippingProductToLocalStorage = (array) => {
    array.forEach((product)=> {
        if(product.sku == 1){
            localStorage.setItem('shipping', JSON.stringify(product))
        } 
    })
}

// removes products that are not available
const removeHiddenProductsFromArray = (array) => array.filter(product => product.isAvailable == true)


function renderCategories(data) {

    let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
    if(cartQuantity != null || cartQuantity>0) {
        totalItemsInCart.show();
      }
    let customer = sessionStorage.getItem("customer") || "";
    if (customer.length > 0) {
        navLoginBtn.text("Logga ut");
        $("#myAccountDropdown").show();
    } else {
        $("#myAccountDropdown").hide();
    }

    products = removeHiddenProductsFromArray(data)
    
  let categories = [];
  
  let availableProducts = [];
    products.forEach(element => {
        if (element.isAvailable == true) {
            availableProducts.push(element)
        }
    });


    localStorage.setItem('categoryList', JSON.stringify(availableProducts));
    renderProducts(availableProducts);

    availableProducts.forEach(product => {
        product.categories.forEach(category => {
            categories.push(category.name)
        })
    })
   
    let uniqueCategories = [...new Set(categories)];
     $("#categories-dropdown-button-list").html("");
     $("#categories-dropdown-button-list").append(`<li>
                <button
              id="all"
              type="button"
              class="dropdown-item"
            >
              Alla produkter
          </button>
              </li>`);

     
    uniqueCategories.forEach((element) => {
        $("#categories-dropdown-button-list").append(`
        <li>
                <button class="dropdown-item" type="button" id="${element}">
                  ${element}
                </button>
              </li>
        `);
        $("#sidomeny").append(`
                  <button id= "${element}" type="button" class="list-group-item list-group-item-action fs-4 categories-dropdown-list" >${element}</button>`);
    });

    $("#total-items-in-cart").text(cartQuantity);
    setCartAvailability();

    $("#sidomeny button").on("click", function () {
        let categoryName = $(this).attr("id");
        let headingText = categoryName == 'all' ? "Produkter" : categoryName;
        $("#heading").text(headingText);
        let selectedCategoryList = [];
        availableProducts.forEach((product) => {
            if (categoryName === "all") {
                $("#products").empty();
                renderProducts(availableProducts);
                localStorage.setItem("categoryList", JSON.stringify(products));
            } else {
                let currentProduct = product;
                product.categories.forEach((category) => {
                    if (category.name == categoryName) {
                        selectedCategoryList.push(currentProduct);
                        $("#products").empty();
                        renderProducts(selectedCategoryList);
                        localStorage.setItem(
                            "categoryList",
                            JSON.stringify(selectedCategoryList)
                        );
                    }
                });
            }
        });
    });

    $("#categories-dropdown-button-list button").on("click", function () {
      let categoryName = $(this).attr("id");
      let headingText = categoryName == "all" ? "Produkter" : categoryName;
      $("#heading").text(headingText);
      let selectedCategoryList = [];
      availableProducts.forEach((product) => {
        if (categoryName === "all") {
          $("#products").empty();
          renderProducts(availableProducts);
          localStorage.setItem("categoryList", JSON.stringify(products));
        } else {
          let currentProduct = product;
          product.categories.forEach((category) => {
            if (category.name == categoryName) {
              selectedCategoryList.push(currentProduct);
              $("#products").empty();
              renderProducts(selectedCategoryList);
              localStorage.setItem(
                "categoryList",
                JSON.stringify(selectedCategoryList)
              );
            }
          });
        }
      });
    });
}
/**
 * Render products to UI and adds functions to add-to-cart button
 * @param {Array} list of product
 */
function renderProducts(products) {
    $("#products").empty();

  // add product to website  
  products.forEach((element) => {
      let unitCheck = '';


      // lägg till element framför för att jämföra med databasen

        if(element.unit == 'ml' || element.unit == 'cl' || element.unit == 'l'){
            unitCheck = 'l'
        }
        if(element.unit == 'gr' || element.unit == 'hg' || element.unit == 'kg'){
          unitCheck = 'kg'
        } 
        if(element.unit == 'st'){
            unitCheck = 'st'
          } 

    $("#products").append(`
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3">
        <div class="product-card">
            <div id="${element.sku}">
                    <div class="img-container">
                    <img src="${element.image}" alt="img" class="product-card-img">
                    </div>
                    <div id="${element.unit}" class="product-card-text">
                    <h3 id="${element.brand.name}" class="card-title">${element.title}</h3>
                    <h5 class="card-price">${element.price.toLocaleString(
                        "sv-SE",
                        {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }
                    )} kr</h5>
                    <p id="${element.volume}" class="card-comp-price">Jfr-pris ${Number(element.comparablePrice).toLocaleString(
                        "sv-SE",
                        {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        }
                    )} kr/${unitCheck}</p>
                    <p id="${element.description}"class="card-text">Mer info om produkten</p>
                    <div class="add-subtract-container">
                        <div class="subtract-btn">
                            <div class="reduce1btn">-</div>
                        </div>
                        <div  class="quantity">
                            <input type="text" maxlength="2" value="1" class="amount${element.sku} amount">
                        </div>
                        <div class="add-btn">
                            <div class="add1btn">+</div>
                        </div>
                    </div>
                    <div class="add-product-to-cart-container">
                        <button class="add-product-to-cart" style="margin-top: 5%" id=${element.sku}>Köp</button>
                    </div>
                    </div>
            </div>
        </div>  
        </div>            
    `);
  });

  // add function to cartbtn
  $("#cartDropdown").on("click", function () {
    renderCart();
  });

  // add function to "köp" btn
  $.each($(".add-product-to-cart"), function (index, value) {
        value.addEventListener("click", (e) => {
            products.forEach((product) => {

                if (product.sku == e.target.parentElement.parentElement.parentElement.id) {
                        product.inCart = Number(e.target.parentElement.parentElement.children[4].children[1].children[0].value);

                if (product.inCart < 1) {
                        swal("Minsta tillåtet antal är 1", "", "warning");

                } else if (product.inCart.toString().includes(".")) {
                        swal("Du måste ange heltal", "", "warning");

                } else {
                        e.target.parentElement.parentElement.children[4].children[1].children[0].value = 1;
                        let isToMany = false;
                        isToMany = saveProductToCart(product);

                        if (isToMany == false) {
                        saveTotalPrice(product);
                        updateTotalCartUI();
                        setCartAvailability();
                        }
                }
                }
            });
        });
  });

    $.each($(".amount"), function (index, value) {
        value.addEventListener("focusout", (e) => {
            if (e.target.value == 0 || isNaN(e.target.value)) {
                e.target.value = 1;
            }
        });
    });

    $.each($(".add1btn"), function (index, value) {
        value.addEventListener("click", (e) => {
            products.forEach((product) => {

                if (product.sku == e.target.parentElement.parentElement.parentElement.parentElement.id) {
                    let currentValue = Number(e.target.parentElement.parentElement.children[1].children[0].value) + 1;

                    if (currentValue < 100) {
                        e.target.parentElement.parentElement.children[1].children[0].value = currentValue;
                    }
                }
            });
        });
    });

    $.each($(".reduce1btn"), function (index, value) {
        value.addEventListener("click", (e) => {
            products.forEach((product) => {

                if (product.sku == e.target.parentElement.parentElement.parentElement.parentElement.id) {
                    let currentValue = Number(e.target.parentElement.parentElement.children[1].children[0].value) - 1;

                    if (currentValue >= 1) {
                        e.target.parentElement.parentElement.children[1].children[0].value = currentValue;
                    }
                }
            });
        });
    });

    const renderProductPopUpModal = (element) => {
        
        let imgSrc = element.children[0].children[0].src
        let title = element.children[1].children[0].innerText
        let brand = element.children[1].children[0].id
        let desc = element.children[1].children[3].id
        let volym = element.children[1].children[2].id + element.children[1].id
        let price = element.children[1].children[1].innerText
        let compPrice = element.children[1].children[2].innerText.substring(9)

        $('#product-pop-up-img').attr("src", imgSrc)
        $('#product-pop-up-title').text(title)
        $('#product-pop-up-brand').text(brand)
        $('#product-pop-up-unit').text(volym)
        $('#product-pop-up-desc').text(desc)
        $('#product-pop-up-price').text(price)
        $('#product-pop-up-comp-price').text(compPrice)
    }

    $.each($(".card-text"), function (index, value) {
        value.addEventListener("click", () => {
        renderProductPopUpModal(value.parentElement.parentElement)
        $("#product-card-modal").modal("show");
        });
    });

    $.each($(".product-card-img"), function (index, value) {
        value.addEventListener("click", () => {
        renderProductPopUpModal(value.parentElement.parentElement)
        $("#product-card-modal").modal("show");
        });
    });
}
    

    /**
     * Checks if product is in cart and increment quantity by 1,
     * else adds it to cart and update quantity
     * @param {Object} product
     */
    function saveProductToCart(product) {

        let cart = JSON.parse(localStorage.getItem("cart"));
        let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
        let tempQuantityToAdd = Number(product.inCart);

        if (cart != null) {
            let productToFind = cart.find((e) => e.sku == product.sku);
            let index = cart.findIndex((e) => e.sku == product.sku);
            if (productToFind == undefined) {
                product.inCart = product.inCart;
                cartQuantity += tempQuantityToAdd;
                cart.push(product);
            } else {
                if (cart[index].inCart + product.inCart >= 100) {
                    swal("Maxantalet för en vara är 99", "", "warning");
                    return true;
                } else {
                    cart[index].inCart += product.inCart;
                    cartQuantity += tempQuantityToAdd;
                }

            }
        } else {
            cart = [];
            product.inCart = product.inCart;
            cartQuantity = tempQuantityToAdd;
            cart.push(product);
        }


        localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
        localStorage.setItem("cart", JSON.stringify(cart));
        $("#cart-counter").text(cartQuantity);
        return false;

    }

    /**
     * Saves the price of the product to localStorage and
     * adds the value if there are a value in localStorage allready
     * @param {object} product
     */
    function saveTotalPrice(product) {
        let totalPrice = JSON.parse(localStorage.getItem("cartTotalPrice"));
        totalPrice != null
            ? localStorage.setItem(
            "cartTotalPrice",
            totalPrice + product.price * product.inCart
            )
            : localStorage.setItem("cartTotalPrice", product.price * product.inCart);
    }


function updateTotalCartUI(){
  $("#total-items-in-cart").show();
  $('#total-items-in-cart').text(JSON.parse(localStorage.getItem("cartQuantity")))
}


function hideOrShowAdminView() {
  adminview.hide();
  let loggedIn = JSON.parse(sessionStorage.getItem("customer"));
    if (loggedIn == undefined) {
    adminview.hide();
  } else {
    if (loggedIn.isAdmin) {
      $("#checkOutLink").attr("href", "./pages/checkout/");
      adminview.show();
    }
  }
}

//------------------------------------- login ----------------------------------\\

    $("#login-button").click(() => {
        let url = `https://hakimlivs.herokuapp.com/users/checkCredentials?email=${emailToCheck.val()}&password=${passwordToCheck.val()}`;
        // let url = `https://hakim-test.herokuapp.com/users/checkCredentials?email=${emailToCheck.val()}&password=${passwordToCheck.val()}`;

        axios.get(url)
            .then((response) => {
                if (response.status !== 200) {
                    swal("Fel email eller lösenord", "", "warning");
                    emailToCheck.val("");
                    passwordToCheck.val("");
                } else {
                    sessionStorage.setItem("customer", JSON.stringify(response.data));

                    if (response.data.isAdmin == true) {
                        location.replace("admin/index.html");
                    } else {

                        loginModal.modal("hide");
                        navLoginBtn.text("Logga ut");
                        myAccountMenu.show();
                    }
                }
            })
            .catch((err) => {
                alert("Serverfel!");
            });
    });

//---------------------------------- Regristration ---------------------------------\\

    let firstName = $("#register-first-name"),
        lastName = $("#register-last-name"),
        regristrationEmail = $("#register-email"),
        phoneNumber = $("#register-phone-number"),
        address = $("#register-street"),
        city = $("#register-city"),
        zipCode = $("#register-zip"),
        newPassword = $("#register-password"),
        confirmPassword = $("#register-confirm-password"),
        year = $("#register-year"),
        month = $("#register-month"),
        day = $("#register-day");

    let FIRSTNAME_ERROR_MSG = $("#FIRSTNAME_ERROR_MSG"),
        LASTNAME_ERROR_MSG = $("#LASTNAME_ERROR_MSG"),
        EMAIL_ERROR_MSG = $("#EMAIL_ERROR_MSG"),
        PHONE_NUMBER_ERROR_MSG = $("#PHONE_NUMBER_ERROR_MSG"),
        ADDRESS_ERROR_MSG = $("#ADDRESS_ERROR_MSG"),
        ZIPCODE_ERROR_MSG = $("#ZIPCODE_ERROR_MSG"),
        CITY_ERROR_MSG = $("#CITY_ERROR_MSG"),
        WRONNG_PASSWORD_ERROR_MSG = $("#WRONG_PASSWORD_ERROR_MSG"),
        NEW_PASSWORD_NOT_MATCH_ERROR_MSG = $("#NEW_PASSWORD_NOT_MATCH_ERROR_MSG"),
        NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $("#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG");

    /**
     * Eventlistener
     */

    firstName.focusout(()=>{
    let bool = true
    bool = checkForInput(testForName, firstName, bool, FIRSTNAME_ERROR_MSG)
    });

    lastName.focusout(()=>{
    let bool = true
    bool = checkForInput(testForName, lastName, bool, LASTNAME_ERROR_MSG)
    });

    regristrationEmail.focusout(()=>{
        let bool = true
        bool = checkForInput(testForEmail, regristrationEmail, bool,EMAIL_ERROR_MSG)
    });

    phoneNumber.focusout(()=>{
        let bool = true
        bool = checkForInput(testForPhoneNumber,phoneNumber, bool,PHONE_NUMBER_ERROR_MSG)
    });

    address.focusout(()=>{
        let bool = true
        bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
    });

    zipCode.focusout(()=>{
        let bool = true
        bool = checkForInput(testForZipCode, zipCode, bool,ZIPCODE_ERROR_MSG)
    });

    city.focusout(()=>{
        let bool = true
        bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
    });

    newPassword.focusout(()=>{
        let bool = true
        bool = checkForInput(testForPassword, newPassword, bool, WRONNG_PASSWORD_ERROR_MSG)
    });


    $("#confirm-account").click(() => {
        if (validateForm()) {
            resetsInputBorders();
            let data = {
                firstName: firstName.val(),
                lastName: lastName.val(),
                phoneNumber: phoneNumber.val().replaceAll(' ','').replaceAll('-',''),
                email: regristrationEmail.val(),
                streetAddress: address.val(),
                password: newPassword.val(),
                socialSecurityNumber: year.val() + month.val() + day.val(),
                isAdmin: false,
                isVip: false,
                zipCode: zipCode.val(),
                city: {
                    name: city.val(),
                },
            };

            axios
                .post(addUserUrl, data)
                .then(() => {
                    swal("Användare skapad!", "Vänligen logga in", "success")
                        .then($("#registerForm").modal("hide"))
                        .then(clearRegristrationForm);
                })
                .catch((err) => {
                    if(err.response.status == 400){
                        swal("E-post registrerad", "Det finns redan ett konto registrerat med denna e-post,\n vänligen logga in eller använd en annan e-post", "warning");
                    }else{
                        swal("Något fick fel!", "Vänligen försök igen", "warning");
                    }
                });
        }

    });


    /**
     * Functions
     */

    function hideAllErrorMsgs() {
        FIRSTNAME_ERROR_MSG.hide();
        LASTNAME_ERROR_MSG.hide();
        EMAIL_ERROR_MSG.hide();
        PHONE_NUMBER_ERROR_MSG.hide();
        ADDRESS_ERROR_MSG.hide();
        ZIPCODE_ERROR_MSG.hide();
        CITY_ERROR_MSG.hide();
        NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide();
        NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG.hide();
        WRONNG_PASSWORD_ERROR_MSG.hide();
    }

    function resetsInputBorders() {
        resetBorder(firstName);
        resetBorder(lastName);
        resetBorder(regristrationEmail);
        resetBorder(newPassword);
        resetBorder(phoneNumber);
        resetBorder(address);
        resetBorder(zipCode);
        resetBorder(city);
    }


function validateForm() {
  let bool = true;

  bool = checkForInput(testForName, firstName, bool, FIRSTNAME_ERROR_MSG);
  bool = checkForInput(testForName, lastName, bool, LASTNAME_ERROR_MSG);
  bool = checkForInput(testForEmail, regristrationEmail, bool, EMAIL_ERROR_MSG);
  bool = checkForInput(testForPhoneNumber,phoneNumber,bool,PHONE_NUMBER_ERROR_MSG);
  bool = checkForInput(testForAddress, address, bool, ADDRESS_ERROR_MSG);
  bool = checkForInput(testForZipCode, zipCode, bool, ZIPCODE_ERROR_MSG);
  bool = checkForInput(testForOnlyText, city, bool, CITY_ERROR_MSG);
  bool = checkForInput(testForPassword,newPassword, bool,WRONNG_PASSWORD_ERROR_MSG);

  bool = checkPassword(bool);
  return bool;
}



    function checkPassword(bool) {
        if (newPassword.val() !== confirmPassword.val()) {
            NEW_PASSWORD_NOT_MATCH_ERROR_MSG.show();
            return false;
        } else {
            NEW_PASSWORD_NOT_MATCH_ERROR_MSG.hide();
            return bool;
        }
    }

    function clearRegristrationForm() {
        firstName.val("");
        lastName.val("");
        regristrationEmail.val("");
        phoneNumber.val("");
        address.val("");
        city.val("");
        zipCode.val("");
        newPassword.val("");
        confirmPassword.val("");
        year.val("");
        month.val("");
        day.val("");
    }

    hideAllErrorMsgs();
