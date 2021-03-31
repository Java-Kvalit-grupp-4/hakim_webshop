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

    data.array.forEach(element => {
        console.log("funkar?")
        document.getElementById("productsInCart").innerHTML +=
        `<tr class="table-primary">
                <td scope="row"> X </td>                            <!-- lägg in papperskorg här -->
                <td scope="row">${element.title}</td>
                <td scope="row"><img class="img-thumbnail" src="${element.image} alt="Product picture"</td>
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
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    }
