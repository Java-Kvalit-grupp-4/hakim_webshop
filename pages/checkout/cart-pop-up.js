let cart = []

function load() {
    let cartTestUrl = '../../TestData/test_data_cart.JSON'
    fetch(cartTestUrl)
      .then((response) => response.json())
      .then((data) => renderCart(data))
      .catch((error) => console.error(error));
  }

function renderCart(data){
    const getProducts = JSON.parse(localStorage.getItem("cart"))

    data.forEach(element => {
        console.log("funkar?")
        document.getElementById("productsInCart").innerHTML +=
        `<tr class="table-light center-table">
                <td><button type="button" class="btn btn-light"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg> </td>
                <td scope="row">${element.title}</td>
                <td scope="row"><img class="cart-thumbnail" src="${element.image} alt="Product picture"</td>
                <td scope="row">${element.price}</td>
                <td><button type="button" class="btn btn-dark" onclick="removeProduct(${element.id})">-
                    <div id="quantityInCart">
                        <p>0</p>
                    </div>
                    <button type="button" class="btn brn-dark" onclick=addProduct(${element.id})">+
                </td>
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
