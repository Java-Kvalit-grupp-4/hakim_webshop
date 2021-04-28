const pdfButton = document.getElementById("#generate-pdf")

pdfButton.addEventListener('click', () => {
    let pdf = document.getElementById('pdf')
    html2pdf(pdf).save()
});

$(function () {
    fetch("../../TestData/test_data_orders.json")
      .then((response) => response.json())
      .then((response) => (orders = response))
      .then((response) => renderOrder(order));
  });

function renderOrder (order) {
    let order = $('order-container')
    order.html('')
    order.array.forEach(element => {
        order.append(`
        <div class="row pt-2 line-item-border">
            <div class="col col-xs-3 col-lg-3 cart-line-item"><p>${element.sku}</p></div>
            <div class="col col-xs-2 col-lg-4 cart-line-item"><p>${element.title}</p></div>
            <div class="col col-xs-1 col-lg-1 cart-line-item"><p>${element.price.toFixed(2)}</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p line-item-total-quantity>${element.inCart}</p></div>
            <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(element.price * element.inCart).toFixed(2)} kr</p></div>
        </div>
        `)
    });
}

let totalPrice = 0;
    $.each($('.line-item-total-price'),(index, e) => totalPrice += parseFloat(e.innerText))
    $('#order-total-price').text(totalPrice.toFixed(2));

function totalVat () {
    let vat = $('vat')
    vat.html('')
    vat.forEach(element => {
        vat.append(`
        <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(element.price * element.inCart).toFixed(2) * 0.1071}</p></div>
        `)
    });
}

function invoiceDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    
    today = mm + '/' + dd + '/' + yyyy;
    document.write(today);
    today = $("#invoiceDate")
}

function dueDate(){
    var date = new Date();
    var dd = String(today.getDate() + 30).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    
    date = mm + '/' + dd + '/' + yyyy;
    document.write(today);
    today = $("#dueDate")
}

function pricePlusShipping(){
    let total = $('#price-plus-shipping')
    total.html('')
    total.forEach(element => {
        total.append(`
        <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(element.price * element.inCart).toFixed(2) + 49}</p></div>
        `)
    });
}

let fullName = $('#fullName'),
    email = $('#email'),
    address = $('#address'),
    zip = $('#zip'),
    city = $('#city')

function renderCustomerInfo() {
    
    let loggedInCustomer =  JSON.parse(sessionStorage.getItem('customer'))
    let zipCode = `${loggedInCustomer.zipCode.substring(0,3)} ${loggedInCustomer.zipCode.substring(3)}`
    
    fullName.val(loggedInCustomer.firstName + loggedInCustomer.lastName);
    email.val(loggedInCustomer.email);
    address.val(loggedInCustomer.streetAddress);
    zip.val(zipCode);
    city.val(loggedInCustomer.city.name);
}
