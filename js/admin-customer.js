/**
 * Cache variables 
 * 
 */
let customers = [];
let orders = [];
let choosedCustomer = "";
let getAllCustomers = "http://localhost:8080/users";
let updateUser = "http://localhost:8080/users/adminUpdateUser";


let startDate = null;
let endDate = null;
let firstName = $('#customer-first-name'),
    lastName = $('#customer-last-name'),
    email = $('#customer-email'),
    phoneNumber = $('#customer-phone'),
    address = $('#customer-street'),
    city = $('#customer-city'),
    zipCode = $('#customer-zip')


 let FIRSTNAME_ERROR_MSG = $('#FIRSTNAME_ERROR_MSG'),
    LASTNAME_ERROR_MSG = $('#LASTNAME_ERROR_MSG'),
    EMAIL_ERROR_MSG = $('#EMAIL_ERROR_MSG'),
    PHONE_NUMBER_ERROR_MSG = $('#PHONE_NUMBER_ERROR_MSG'),
    ADDRESS_ERROR_MSG = $('#ADDRESS_ERROR_MSG'),
    ZIPCODE_ERROR_MSG = $('#ZIPCODE_ERROR_MSG'),
    CITY_ERROR_MSG = $('#CITY_ERROR_MSG'),
    WRONNG_PASSWORD_ERROR_MSG = $('#WRONG_PASSWORD_ERROR_MSG'),
    NEW_PASSWORD_NOT_MATCH_ERROR_MSG = $('#NEW_PASSWORD_NOT_MATCH_ERROR_MSG'),
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $('#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG')

$('form').submit(false)

$(document).ready(load)

$(document).on('click', '.customer-tab', openCustomerTab);

$(document).on('click', '#search-btn', filterSearch);

$(document).on('click', '#updateBtn', updateCustomer);

$(document).on('focus', '#search-select', function(){
    $("#input").val("");
})

$(document).on('click', '#nav-profile-tab', function(){
    $("#orderTable").empty();
    firstName.val("")
    lastName.val("")
    email.val("")
    phoneNumber.val("")
    address.val("")
    city.val("")
    zipCode.val("")
    load();
})

function load(){
    hideAllErrorMsgs()
    $("#reservation").daterangepicker(null, function (start, end, label) {
        startDate = new Date(start.toISOString())
        endDate = new Date(end.toISOString())
    })
    axios.get(getAllCustomers)
        .then((response) =>{
            console.log(response.data)
            if(response.status ===200){
                showCustomers(response.data) 
                customers = response.data   
            }
            else{
                swal("Något gick fel vid inläsning av kunder")
            }
        })
        .catch(err =>{
            alert("Server fel!" + err)
        })
}

function showCustomers(customerArr){
    $("#customerTable").empty();
    if(customerArr.length==0){
        swal("Hittade inga kunder på denna sökning")
    }
    customerArr.forEach(e => {
        let isVip = "";
        if(e.isVip=== true){
            console.log("ÄR VIP")
            isVip = "bi-check2"
        }
        else{
            isVip = "bi-x"
        }
        let personalNumber = e.socialSecurityNumber;
        let firstNr = personalNumber.substring(0,6);
        let lastNr = personalNumber.substring(6);
        let customerOrders = e.customerOrders;
        let totalPrice = getTotalPriceOfOrders(customerOrders);

        //<td>${e.customerOrders.length}</td>   Kod för antalet ordrar
        //<td>${getTotalPriceOfOrders(customerOrders).toFixed(2)} kr</td>   Kod för totala summan av alla ordrar
    
        $("#customerTable").append(`
            <tr>
                <th scope="row"><a href="#" class="customer-tab">${e.customerNumber}</a></th>
                <td>${e.firstName}</td>
                <td>${e.lastName}</td>
                <td>${firstNr}-${lastNr}</td>
                <td><a href="mailto:${e.email}">${e.email}</a></td>
                <td>${customerOrders.length}</td>
                <td>${totalPrice.toFixed(2)} kr</td>
                <td><i class="bi ${isVip}"></i></td>
            </tr>
            `
        )})
}

function openCustomerTab(){
    $("#orderTable").empty();
    saveCustomer($(this).text());
    $("#nav-contact-tab").tab('show');
    };

function saveCustomer(customerNumber){
    customers.forEach(customer => {
        console.log("Telefon " + customer.phoneNumber)
        console.log("postadress " + customer.zipCode)
        
        if(customer.customerNumber==customerNumber){
            
            let phoneNumber = `${customer.phoneNumber.substring(0,3)} ${customer.phoneNumber.substring(3,6)} ${customer.phoneNumber.substring(6,8)} ${customer.phoneNumber.substring(8)}`
            sessionStorage.setItem("choosedCustomer", JSON.stringify(customer));
            let zipCode = `${customer.zipCode.substring(0,3)} ${customer.zipCode.substring(3)}`
            
            $("#customer-first-name").val(customer.firstName)
            $("#customer-last-name").val(customer.lastName)
            $("#customer-email").val( customer.email)
            $("#customer-phone").val(phoneNumber)
            $("#customer-street").val(customer.streetAddress)
            $("#customer-city").val(customer.city.cityName)
            $("#customer-zip").val( zipCode)
            showOrders(customer.customerOrders);
        }
    })
}

/*function getNumberOfOrders(id, orderArr){
    let sum = 0;
    orderArr.forEach(e => {
        if(e.user.id==id){
            sum++;
        }
    })
    return sum;
}*/

function getTotalPriceOfOrders(orderArr){
    let sum = 0;
    orderArr.forEach(e => {
        sum += e.totalCost;
    })
    return sum;
}

function filterSearch(){
    let tempOrders = [];
    let filter = $("#search-select option:selected").text();
    let input = $("#input").val();
  
    console.log(startDate, endDate);

    if(startDate!=null && endDate!=null){
        orders.forEach(e => {
            let date = new Date(e.orderTimestamp);
            if(date>=startDate && date<=endDate){
                tempOrders.push(e);
            }
        });
    }
    else{
        tempOrders=orders
    };
        
    $("#customerTable").empty();
    switch (filter) {
        case 'Visa alla':
            showCustomers(customers);
            break;
        case 'Vip-kunder':
            showCustomers(customers.filter(customer => customer.isVip==true));   
            break;
        case 'Total ordersumma över:':
            if(input!=""){
                showCustomers(customers.filter(customer => getTotalPriceOfOrders(customer.customerOrders.filter(order => 
                    {let date = new Date(order.orderTimestamp)
                        date>=startDate && date<=endDate
                    })
                )>input));
            }
            else{
                showCustomers(customers.filter(customer => getTotalPriceOfOrders(customer.customerOrders)>input));
            }
            break;
        case 'Totalt antal ordrar över:':
            if(input!=""){
                showCustomers(customers.filter(customer =>customer.customerOrders.filter(order => 
                    {let date = new Date(order.orderTimestamp)
                        date>=startDate && date<=endDate
                    }).length>input));
            }
            else{
                showCustomers(customers.filter(customer => customer.customerOrders.length>input));
            }
            break;
    }
};

function showOrders(customerOrders){
    let sum = 0;
    customerOrders.forEach(orders => {
            sum += orders.totalCost;
            let dateFromOrder = new Date(orders.orderTimestamp);
            let orderDate = dateFromOrder.toISOString().substring(0,10);
            console.log(orderDate)
           
            let isPaid = "Obetalad";
            if(orders.isPaid){
                isPaid ="Betalad"
            }
            $("#orderTable").append(`
                <tr>
                    <th scope="row" class="col-3">
                    <a href="#">${orders.orderId}</a>
                    <td class="col-2">${orders.status.type}</td>
                    <td class="col-2">${isPaid}</td>
                    <td class="col-3">${orderDate}</td>
                    <td class="col-2">${orders.totalCost.toFixed(2)} kr</td>
                </tr>`
            )
    })
    $("#totalCost").text(sum.toFixed(2) + " kr");    
}

function updateCustomer(){
    let phoneNumber = phoneNumber.val()

    phoneNumber = phoneNumber.replaceAll(" ", "");
    let zipCode = zipCode.val();
    zipCode = zipCode.replaceAll(" ", "");

    console.log(phoneNumber)
    console.log(zipCode)

    const data = {
        "firstName" : $("#customer-first-name").val(),
        "lastName" : $("#customer-last-name").val(),
        "email" : $("#customer-email").val(),
        "phone" : phoneNumber,
        "street" : $("#customer-street").val(),
        "city": 
            {
            "cityName": $("#customer-city").val()
            },
        "zipCode" : zipCode,
        "comment" : $("#commentTextField").val()
    }

    updateUser += `firstName=${firstName.val()}&
    lastName=${lastName.val()}&
    phoneNumber=${phoneNumber.val()}&
    email=${email.val()}&
    streetAddress=${address.val()}&
    zipCode=${zipCode.val()}&
    cityName=${city.val()}`

    axios.post(updateUser, data)
        .then(() => {
            swal('Kunden är uppdaterad!')
        })
        .catch(() => {
            swal('Något gick fel!','Vänligen försök igen', 'warning')
        })
    }


function validateForm() {
    let bool = true

    bool = checkForInput(testForOnlyText, firstName, bool, FIRSTNAME_ERROR_MSG)
    bool = checkForInput(testForOnlyText, lastName, bool,LASTNAME_ERROR_MSG)
    bool = checkForInput(testForEmail, email, bool,EMAIL_ERROR_MSG)
    bool = checkForInput(testForNumbersOnly,phoneNumber, bool,PHONE_NUMBER_ERROR_MSG)
    bool = checkForInput(testForAddress, address, bool,ADDRESS_ERROR_MSG)
    bool = checkForInput(testForZipCode, zipCode, bool,ZIPCODE_ERROR_MSG)
    bool = checkForInput(testForOnlyText, city,bool,CITY_ERROR_MSG)
    
    return bool
  }

  function hideAllErrorMsgs() {
    FIRSTNAME_ERROR_MSG.hide()
    LASTNAME_ERROR_MSG.hide()
    EMAIL_ERROR_MSG.hide()
    PHONE_NUMBER_ERROR_MSG.hide()
    ADDRESS_ERROR_MSG.hide()
    ZIPCODE_ERROR_MSG.hide()
    CITY_ERROR_MSG.hide()
   
  }
  
  function resetsInputBorders() {
    resetBorder(firstName)
    resetBorder(lastName)
    resetBorder(email)
    resetBorder(phoneNumber)
    resetBorder(address)
    resetBorder(zipCode)
    resetBorder(city)
  }




        

    