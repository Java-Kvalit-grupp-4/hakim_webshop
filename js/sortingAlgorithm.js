$(function() {
    console.log("Här ska det sorteras!!!");
    let products = [];

    const productsData =
      "../TestData/test_data_products_v1.2.JSON";
    axios
      .get(productsData)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          loadProducts(response.data);
          
        } else {
          swal("Något gick fel vid inläsning av produkter");
        }
      })
      .catch((err) => {
        alert("Serverfel!" + err);
      });


      function loadProducts(data) {
          console.log(data);
          products = data;
      }

      function sortNamesAscending(products) {

      }

      function sortPriceAscending(products) {
          console.log("Pris lågt till högt");
          products.sort()


      }



})