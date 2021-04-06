let cart = [];

$(document).ready(load)

function load() {
    let cartTestUrl = '../../TestData/test_data_cart.JSON'
    fetch(cartTestUrl)
      .then((response) => response.json())
      .then((data) => makeArrayFromData(data))
      .catch((error) => console.error(error));

      renderCart()
}

function makeArrayFromData(data) {
  cart = data
  localStorage.setItem("cart", JSON.stringify(data))
}

function renderCart(){
    let cart = JSON.parse(localStorage.getItem("cart"))
    document.getElementById("productsInCart").innerHTML = ''
    
    cart.forEach(element => {
        document.getElementById("productsInCart").innerHTML +=
        `<tr id=""class="table-light center-table">
                <td id="trashcan"><button id="${element.productNummer}" type="button" class="trashcan-center"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg> </td>
                <td scope="row">${element.title}</td>
                <td scope="row"><img class="cart-thumbnail" src="${element.image} alt="Product picture"</td>
                <td scope="row">${element.price}</td>
                <div>
                <td><button type="button" class="shadow-button" onclick="removeProduct(${element.productNummer})">-</td>    
                <td id="quantityInCart"><div>${element.inCart}</div></td>
                    <td><button type="button" class="shadow-button" onclick=addProduct(${element.productNummer})">+</td>
                </div>
                <td id="${element.productNummer}">${(element.price * element.inCart).toFixed(2)}</td>
            </tr>`
    });

    $.each($('.trashcan-center'), function(index, e){
      e.addEventListener('click', e => {
        console.log(e.target)
        let removed = cart.filter(product => product.productNummer !== e.target.id)
        localStorage.setItem("cart", JSON.stringify(removed))
        renderCart()
      })
    })
}

function addProduct(product){
    //uppdatera antalet
    let cartTemp = JSON.parse(localStorage.getItem("cart"));
    //let adding = cart.find((element) => element.productNummer == product);
    console.log("funkar detta?")
    cartTemp.forEach(element => {
      if (element.productNummer == product.productNummer){
        console.log("inne i if")
        element.inCart += 1
      }})
   // adding.inCart += 1;
    localStorage.setItem("cart", JSON.stringify(cartTemp));
}

function removeProduct(product) {
    //uppdatera antalet
    let cartTemp = JSON.parse(localStorage.getItem("cart"));
    let removing = cart.find((element) => element.productNummer == product);
      
    if (removing.inCart !== 0) {
        removing.inCart += -1;
        localStorage.setItem("cart", JSON.stringify(removing));
      }
    }

    //Ta bort dessa? Följde med från getbootstrap.com. Hittar ingen funktionalitet för dessa, men när de är aktiva funkar inte clear cart

/*
  var modal = document.getElementById("myModal");
  var btn = document.getElementById("myBtn");
  var span = document.getElementsByClassName("close")[0];
  
  btn.onclick = function() {
    modal.style.display = "block"
  }
  
  span.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
  */

  $("#clear").click(function () {
    console.log("rensa")
    localStorage.clear()
    document.getElementById("productsInCart").innerHTML = ''
  });
  
