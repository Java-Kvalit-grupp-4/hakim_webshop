const pdfButton = document.getElementById("generate-pdf")

pdfButton.addEventListener('click', () => {
    let pdf = document.getElementById('pdf')
    html2pdf(pdf).save()
}); 

const dued = document.getElementById("dueDate")
dued.addEventListener('click', () => {
    dueDate()
});

function renderOrder (orders) {
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

/* Stoppa in ordernumret och vänd på det för att skapa fakturanummer */
const reverse = (s) => {
    return [...s].reverse().join("");
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

const invoiceDate = () =>{
    var today = new Date();
    today.toLocaleDateString()
    return today.toLocaleDateString()
}

const deliveryDate = () => {
    let date = new Date();
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString()
}

const dueDate = () => {
    let date = new Date();
    date.setDate(date.getDate() + 30)
    return date.toLocaleDateString()
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

const btn = document.querySelector("#generate-btn");

let add = document.getElementById('line-items')

btn.addEventListener('click', () => {

    let array = ['hej','ska','gda']

    document.getElementById('orderNumber').innerText = '3214-3213'
    document.getElementById('fullName').innerText = 'Kalle Anka'
    document.getElementById('address').innerText = 'Adress'
    document.getElementById('email').innerText = 'Adress'
    document.getElementById('invoiceDate').innerText = invoiceDate()
    document.getElementById('dueDate').innerText = dueDate()


    array.forEach(element => {
       add.innerHTML += `<tr>
       <td class="product">${element}</td>
       <td class="desc">PRODUKTNAMN</td>
       <td>PRIS / KR</td>
       <td>ANTAL</td>
       <td>TOTAL / KR</td>
   </tr>`
    });

    let element = document.getElementById('pdf');
    let opt = {
        margin:       1,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf(element).set(opt).save();

    add.innerHTML = ''

});

