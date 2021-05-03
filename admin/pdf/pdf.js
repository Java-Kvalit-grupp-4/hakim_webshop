/*const pdfButton = document.getElementById("generate-pdf")

pdfButton.addEventListener('click', () => {
    renderOrder()
    let pdf = document.getElementById('pdf')
    html2pdf(pdf).save()
}); 

const dued = document.getElementById("dueDate")
dued.addEventListener('click', () => {
    dueDate()
});
*/
let orderObject =     {
    "orderNumber": 20215386,
    "timeStamp": "2021-05-03T10:02:51",
    "sentTimestamp": null,
    "orderComment": "",
    "totalCost": 257.0,
    "isPaid": false,
    "appUser": {
        "id": null,
        "customerNumber": 2105031154,
        "firstName": "Patrik",
        "lastName": "Melander",
        "phoneNumber": "0704011119",
        "email": "patrikjmelander@gmail.com",
        "password": null,
        "comment": null,
        "socialSecurityNumber": null,
        "isAdmin": null,
        "isVip": null,
        "streetAddress": "Norlindsvägen 24",
        "zipCode": "123 45",
        "city": {
            "id": 6,
            "name": "Stockholm"
        },
        "customerOrders": []
    },
    "orderStatus": {
        "id": 93,
        "type": "Ohanterad",
        "timestamp": "2021-05-03T10:02:51.216301"
    },
    "lineItems": [
        {
            "id": 94,
            "quantity": 2,
            "itemPrice": 30.0,
            "product": {
                "id": 58,
                "title": "Daimroll",
                "description": "Mjölkchoklad",
                "brand": {
                    "id": 59,
                    "name": "Marabou"
                },
                "image": "https://hakimlivs.herokuapp.com/api/v1/download/daimroll2.jpg",
                "price": 15.0,
                "quantity": 6,
                "isAvailable": true,
                "volume": 134.0,
                "comparablePrice": "111.94",
                "unit": {
                    "id": 9,
                    "name": "gr"
                },
                "outOfStocks": [],
                "categories": [
                    {
                        "id": 35,
                        "name": "Snacks"
                    }
                ],
                "tags": [
                    {
                        "id": 57,
                        "name": "choklad"
                    }
                ],
                "sku": 20211310,
                "vat": 1.12
            }
        },
        {
            "id": 95,
            "quantity": 4,
            "itemPrice": 48.0,
            "product": {
                "id": 43,
                "title": "Havregryn",
                "description": "Gott till gröt, på frukostfilen eller varför inte i chokladbollarna",
                "brand": {
                    "id": 44,
                    "name": "AXA"
                },
                "image": "https://hakimlivs.herokuapp.com/api/v1/download/axa_havregryn_750g_ny.jpg",
                "price": 12.0,
                "quantity": 23,
                "isAvailable": true,
                "volume": 750.0,
                "comparablePrice": "16.00",
                "unit": {
                    "id": 9,
                    "name": "gr"
                },
                "outOfStocks": [],
                "categories": [
                    {
                        "id": 41,
                        "name": "Skafferi"
                    }
                ],
                "tags": [
                    {
                        "id": 42,
                        "name": "cocosbollar"
                    }
                ],
                "sku": 20211705,
                "vat": 1.12
            }
        },
        {
            "id": 96,
            "quantity": 1,
            "itemPrice": 35.0,
            "product": {
                "id": 7,
                "title": "Soltorkade tomater",
                "description": "Med genuin smak av Medelhavet!",
                "brand": {
                    "id": 8,
                    "name": "Santa Maria"
                },
                "image": "https://hakimlivs.herokuapp.com/api/v1/download/soltorkade_tomater.jpg",
                "price": 35.0,
                "quantity": 3,
                "isAvailable": true,
                "volume": 280.0,
                "comparablePrice": "125.00",
                "unit": {
                    "id": 9,
                    "name": "gr"
                },
                "outOfStocks": [
                    {
                        "id": "eea10939-e622-47a9-8953-4b0e2a2c2cab",
                        "outOfStockDate": "2021-05-03"
                    }
                ],
                "categories": [
                    {
                        "id": 10,
                        "name": "Konserver"
                    }
                ],
                "tags": [
                    {
                        "id": 11,
                        "name": "Olja"
                    },
                    {
                        "id": 12,
                        "name": "Tomat"
                    }
                ],
                "sku": 20212734,
                "vat": 1.12
            }
        },
        {
            "id": 97,
            "quantity": 6,
            "itemPrice": 144.0,
            "product": {
                "id": 37,
                "title": "Grillchips",
                "description": "Ett måste på fredagsmyset",
                "brand": {
                    "id": 38,
                    "name": "OLW"
                },
                "image": "https://hakimlivs.herokuapp.com/api/v1/download/olw_grill_40g_ny.jpg",
                "price": 24.0,
                "quantity": 6,
                "isAvailable": true,
                "volume": 350.0,
                "comparablePrice": "68.57",
                "unit": {
                    "id": 9,
                    "name": "gr"
                },
                "outOfStocks": [],
                "categories": [
                    {
                        "id": 35,
                        "name": "Snacks"
                    }
                ],
                "tags": [
                    {
                        "id": 36,
                        "name": "fredagsmys"
                    }
                ],
                "sku": 20218797,
                "vat": 1.12
            }
        }
    ],
    "orderChanges": []
}

$("#preview-pdf").click(() => {
    $('#save-pdf').show()
    generatPdf(orderObject)
    
    console.log(orderObject)
})

$('#save-pdf').click(() => {
    $('#save-pdf').hide()
    let element = document.getElementById('pdf')
    let opt = {
        margin:         1,
        filename:       'order.pdf',
        image:          {type: 'jpeg', quality: 0.98},
        html2canvas:    {scale: 2},
        jsPDF:          {unit: 'in', format: 'letter', orientation: 'portrait'}
    }

    html2pdf(element).set(opt).save()
})

const generatPdf = (order) => {

    $('#orderNumber').text(order.orderNumber)
    $('#fullName').text(order.appUser.firstName + ' ' + order.appUser.lastName)
    $('#address').text(order.appUser.streetAddress + ' ' + order.appUser.zipCode + ' ' + order.appUser.city.name)
    $('#email').text(order.appUser.email)
    $('#invoiceDate').text(invoiceDate())
    $('#dueDate').text(dueDate())
    $('#deliveryDate').text(deliveryDate())

    renderLineItems(order.lineItems)
}

const renderLineItems = (order) => {
    let totalPrice = 0

    $('#line-items').html('')
    $('#table-footer').html('')

    console.log(order)
    console.log(order.lineItems)
    order.forEach(element => {
        totalPrice += element.price
        $('#line-items').append(`
        <tr>
            <td class="desc">${element.product.sku}</td>
            <td class="desc">${element.product.title}</td>
            <td>${element.product.price.toLocaleString("sv-SE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td>${element.quantity}</td>
            <td>${element.itemPrice.toLocaleString("sv-SE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} kr</td>
        </tr>
        `)
    });

    $('#table-footer').append(`
    <tr>
        <th scope="row"></th>
            <td></td>
            <td></td>
            <td>Frakt </td>
            <td>49,00 kr </td>
    </tr>
    <tr>
        <th scope="row></th>
            <td></td>
            <td></td>
            <td>Moms</td>
            <td>Massa moms</td>
    </tr>
    <tr>
        <th scope="row"></th>
            <td></td>
            <td></td>
            <td>Totalpris </td>
            <td>${pricePlusShipping}</td>
    </tr>
    `)
}

/* Stoppa in ordernumret och vänd på det för att skapa fakturanummer */
const reverse = (s) => {
    return [...s].reverse().join("");
}

let totalPrice = 0;
    $.each($('.line-item-total-price'),(index, e) => totalPrice += parseFloat(e.innerText))
    $('#order-total-price').text(totalPrice.toLocaleString("sv-SE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }));
/*
function totalVat () {
    let vat = $('vat')
    vat.html('')
    vat.forEach(element => {
        vat.append(`
        <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(element.price * element.inCart).toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) * 0.1071}</p></div>
        `)
    });
}
*/

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
        <div class="col col-xs-2 col-lg-2 cart-line-item"><p class="line-item-total-price">${(element.price * element.inCart).toLocaleString("sv-SE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) + 49}</p></div>
        `)
    });
}

let fullName = $('#fullName'),
    email = $('#email'),
    address = $('#address'),
    zip = $('#zip'),
    city = $('#city')

    /*
function renderCustomerInfo() {
        
    fullName.val(appUser.firstName + appUser.lastName);
    email.val(loggedInCustomer.email);
    address.val(loggedInCustomer.streetAddress);
    zip.val(zipCode);
    city.val(loggedInCustomer.city.name);
}
*/


