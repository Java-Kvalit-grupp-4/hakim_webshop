$(document).ready(() => {
    $('#bin-warning-yes-btn').click(() => {
        console.log('yes')
        deleteCart()
    })
})




function deleteCart() {
    console.log('in delete cart');
   /*  localStorage.removeItem('cart')
    localStorage.removeItem('cartQuantity')
    localStorage.removeItem('cartTotalPrice') */
}