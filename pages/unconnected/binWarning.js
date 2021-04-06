$(document).ready(() => {
    $('#test').click(() => {
        swal({
            title: "Warning",
            text: "Vill du verklingen ta bort denna produkt från varukorgen?",
            icon: "warning",
            dangerMode: true,
            buttons: ["Ja", "Nej"],
          })
          .then((willDelete) => {
            if (!willDelete) {
              swal("Produkten är borttagen", {
                icon: "success",
              })
              // ta bort aktuell produkt från varukorgen
            } else {
              swal("Produkten ej borttagen från varukorgen");
            }
          });
        deleteCart()
    })
})




function deleteCart() {
    console.log('in delete cart');
   /*  localStorage.removeItem('cart')
    localStorage.removeItem('cartQuantity')
    localStorage.removeItem('cartTotalPrice') */
}