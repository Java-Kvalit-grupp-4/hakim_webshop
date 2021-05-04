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
let orderObject =
/* {
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
*/

// $("#preview-pdf").click(()=> {
//     $('#save-pdf').show()
//     // here you send in the selected order to generate a pdf preview
//     generatPdf(orderObject)
//     $("#pdf-modal").modal("show");
// }) 

$("#preview-pdf").click(() => {
  $("#save-pdf").show();
  // here you send in the selected order to generate a pdf preview
  generatPdf(orderObject);
  $("#pdf-modal").modal("show");
}); 


function printPdf() {
    let element = document.getElementById("pdf");
    let options = {
      margin: 0,
      filename: "order.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };


    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then(function (pdfObj) {
        // pdfObj has your jsPDF object in it, use it as you please!
        // For instance (untested):
        pdfObj.autoPrint();
        window.open(pdfObj.output("bloburl"), "_blank");
      });
}

$('#save-pdf').click(() => {
    $('#save-pdf').hide()
    let element = document.getElementById('pdf')
    let options = {
        margin:         0,
        filename:       'order.pdf',
        image:          {type: 'jpeg', quality: 0.98},
        html2canvas:    {scale: 2},
        jsPDF:          {unit: 'in', format: 'letter', orientation: 'portrait'}
    }

    /* let worker = html2pdf(element).set(opt);

    worker.toPdf().get('pdf').then(function (pdfObj) {
        // pdfObj has your jsPDF object in it, use it as you please!
        // For instance (untested):
        pdfObj.autoPrint();
        window.open(pdfObj.output('bloburl'), '_blank');
    }); */

    html2pdf()
      .from(element)
      .set(options)
      .toPdf()
      .get("pdf")
      .then(function (pdfObj) {
        // pdfObj has your jsPDF object in it, use it as you please!
        // For instance (untested):
        pdfObj.autoPrint();
        window.open(pdfObj.output("bloburl"), "_blank");
      });

    // html2pdf(element).set(opt).save()
})

const generatPdf = (order) => {

    $('#invoiceNumber').text(reverse(String(order.orderNumber)))
    $('#orderNumber').text(order.orderNumber)
    $('#fullName').text(order.appUser.firstName + ' ' + order.appUser.lastName)
    $('#address').html(`${order.appUser.streetAddress} </br> ${order.appUser.zipCode} ${order.appUser.city.name}`)
    $('#email').text(order.appUser.email)
    $('#invoiceDate').text(invoiceDate())
    $('#dueDate').text(dueDate())
    $('#deliveryDate').text(deliveryDate())

    renderLineItemsPdf(order.lineItems)
}

const renderLineItemsPdf = (order) => {
    let totalPrice = 0

    $('#line-items').html('')
    $('#table-footer').html('')
    $('.modal-footer').html('')

    let pricePlusShipping = 0
    
    
  
    order.forEach(element => {
     
        totalPrice += element.price
        $('#line-items').append(`
        <tr>
            <td class="sku">${element.product.sku}</td>
            <td class="product">${element.product.title}</td>
            <td class="price">${element.product.price.toLocaleString("sv-SE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
            <td class="quantity">${element.quantity}</td>
            <td class="total">${(element.itemPrice * element.quantity).toLocaleString("sv-SE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
        </tr>
        `)
            pricePlusShipping += element.itemPrice
    });


    $('#table-footer').append(`
    <tr>
        <th scope="row"></th>
            <td>Frakt</td>
            <td></td>
            <td> </td>
            <td>49,00</td>
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
            <td>${(pricePlusShipping + 49).toLocaleString("sv-SE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</td>
    </tr>
    `)

    let VAT25 = 0;
    let VAT12 = 0;
    let VAT6 = 0;  

    console.log(order);
    
    $.each(order, (index, e) => {
        console.log(e);
      let linePrice = e.itemPrice * e.quantity;

      switch (e.product.vat) {
        case 1.25:
          VAT25 += linePrice - linePrice / e.product.vat;
          break;
        case 1.12:
          VAT12 += linePrice - linePrice / e.product.vat;
          break;
        case 1.06:
          VAT6 += linePrice - linePrice / e.product.vat;
          break;
        default:
          break;
      }
    })


    $('.vat-container').html('')
    
      $('.vat-container').append(`
      <div class="row">
    <div class="col-8"></div>
    <div class="col">
      <h6 class="cart-line-item my-3">Varav moms:</h6>
    </div>
  </div>
      `)

    
      if(VAT25>0) {

        $(".vat-container").append(`
        <div class="row" id="vat-25">
    <div
      class="col-8 cart-line-item"
    ></div>
    <div
      class="col-1 cart-line-item text-end text-sm-start"
    >
      <h6 class="cart-line-item">25%:</h6>
    </div>
    <div
      id="checkout-cart-VAT-25"
      class="col-2 cart-line-item "
    >
      <p id="VAT-25" class="pe-2" >${VAT25.toLocaleString("sv-SE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
    </div>
  </div>
        `
        );
      }
      if (VAT12 > 0) {
        $(".vat-container").append(`
        <div class="row" id="vat-12">
            <div class="col-8 cart-line-item"></div>
    <div
      class="col-1 cart-line-item text-end text-sm-start mt-0"
    >
      <h6 class="cart-line-item">12%:</h6>
    </div>
    <div
      id="checkout-cart-VAT-12"
      class="col-2 cart-line-item "
    >
      <p id="VAT-12" class="pe-2" >${VAT12.toLocaleString("sv-SE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</p>
    </div>
  </div>
        `)
        
        
      }
      if (VAT6 > 0) {

        $('.vat-container').append(`
        <div class="row" id="vat-6">
                <div class="col-8 cart-line-item"></div>

            <div class="col-1 cart-line-item text-end text-sm-start">
                <h6 class="cart-line-item">6%:</h6>
            </div>

            <div id="checkout-cart-VAT-6" class="col-2 cart-line-item ">
                <p id="VAT-6" class="pe-2" >${VAT6.toLocaleString("sv-SE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</p>
            </div>
        </div>
        
        `)
        
        
      }
    

    $('.modal-footer').append(`
    <div id="company" class="clearfix">
                            
                                <span>Hakim Livs</span>
                            
                                <span>Kungsgatan 65</span>
                            
                                <span>116 42 Stockholm</span>
                            
                                <span>+46 70 861 31 89</span>
                            
                                <span>hakimlivs@gmail.com</span>
                            
                            <br>
                        </div>
                        <div id="company-bank">
                            <span>Bankgiro:</span>
                            <span>1234-5678</span>
                            <span>Godkänd för F-skatt</span>
                        </div>
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

let fullName = $('#fullName'),
    email = $('#email'),
    address = $('#address'),
    zip = $('#zip'),
    city = $('#city')



