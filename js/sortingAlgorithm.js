$(function () {

  const productsData = "./TestData/test_data_products_v1.2.JSON";

  axios
    .get(productsData)
    .then((response) => {
      if (response.status === 200) {
        products = response.data
      } else {
        swal("Något gick fel vid inläsning av produkter");
      }
    })
    .catch((err) => {
      alert("Serverfel!" + err);
    });
  
  const sortNamesAscending = (listOfProducts) => { return listOfProducts.sort((a,b) => a.title < b.title ? -1 : 1 )}

  const sortNamesDecending = (listOfProducts) => { return listOfProducts.sort((a,b) => a.title < b.title ? 1 : -1 )}

  const sortPriceAscending = (listOfProducts) => { return listOfProducts.sort((a,b) => parseFloat(a.price) - parseFloat(b.price))}
  
  const sortPriceDecending = (listOfProducts) => { return listOfProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))}

 

  $("#name-ascending").click(() => { renderProducts(sortNamesAscending(JSON.parse(localStorage.getItem('categoryList')))) })

  $("#name-descending").click(() => { renderProducts(sortNamesDecending(JSON.parse(localStorage.getItem('categoryList')))) })

  $("#price-ascending").click(() => { renderProducts(sortPriceAscending(JSON.parse(localStorage.getItem('categoryList')))) })
  
  $("#price-descending").click(() => { renderProducts(sortPriceDecending(JSON.parse(localStorage.getItem('categoryList')))) })  
})

