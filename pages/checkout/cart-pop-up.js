let cart = []

function load() {
    let cartTestUrl = '../../TestData/test_data_cart.JSON'
    fetch(cartTestUrl)
      .then((response) => response.json())
      .then((data) => renderCart(data))
      .catch((error) => console.error(error));
  }

function renderCart(data){
    var getProducts = JSON.parse(localStorage.getItem("cart"))

    data.forEach(element => {
        document.getElementById("productsInCart").innerHTML +=
        `<tr class="table-light center-table">
                <td><button type="button" class="btn btn-light"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg> </td>
                <td scope="row">${element.title}</td>
                <td scope="row"><img class="cart-thumbnail" src="${element.image} alt="Product picture"</td>
                <td scope="row">${element.price}</td>
                <div>
                <td><button type="button" class="shadow-button" onclick="removeProduct(${element.id})">-</td>    
                <td><div id="quantityInCart"> 1 </div></td>
                    <td><button type="button" class="shadow-button" onclick=addProduct(${element.id})">+</td>
                </div>
                <td id="${element.id}">${(element.price * element.quantity).toFixed(2)}</td>
            </tr>`
    });
}

function addProduct(product){
    //uppdatera antalet
    let add = JSON.parse(localStorage.getItem("cart"));
    let adding = add.find((element) => element.id == product);
    
    adding.quantity += 1;
    localStorage.setItem("cart", JSON.stringify(add));
}

function removeProduct(product) {
    //uppdatera antalet
    let cart = JSON.parse(localStorage.getItem("cart"));
    let removing = cart.find((element) => element.id == product);
      
    if (removing.quantity !== 0) {
        removing.quantity += -1;
        localStorage.setItem("cart", JSON.stringify(removing));
      }
    }

      // Get the modal
  var modal = document.getElementById("myModal");
  
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks the button, open the modal 
  btn.onclick = function() {
    modal.style.display = "block";
  }
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

 
    
