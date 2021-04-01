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
