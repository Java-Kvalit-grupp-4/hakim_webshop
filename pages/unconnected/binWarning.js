$(document).ready(() => {
    $('#test').click(() => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("Poof! Your imaginary file has been deleted!", {
                icon: "success",
              });
            } else {
              swal("Your imaginary file is safe!");
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