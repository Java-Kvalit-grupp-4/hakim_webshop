
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
        <td></td>
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



