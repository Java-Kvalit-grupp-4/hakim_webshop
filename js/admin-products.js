function getProducts(list) {
    list.forEach(element => {
        let round = parseInt(element.price).toFixed(2);
        $("#products").append(
            `<tr>
              <td>${element.id}</td>
              <td ><h5 >${element.title}</h5></td>
              <td ><h5 >Hakim</h5></td>
              <td>${round} kr</td>
              <td> ${element.amount}</td>
              </tr>`
        )
    });
}
