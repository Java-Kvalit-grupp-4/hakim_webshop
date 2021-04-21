/**
 * Cache variables 
 * 
 */
let customers = [];
let orders = [];
let choosedCustomer = "";
let getAllCustomers = "https://hakimlivs.herokuapp.com/users";
let updateUser = "https://hakimlivs.herokuapp.com/users/adminUpdateUser";

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
    NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG = $('#NEW_PASSWORD_EQUALS_OLD_PASSWORD_ERROR_MSG'),
    INPUT_ERROR_MSG = ("#INPUT_ERROR_MSG")

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
        let customerOrders;
        let totalPrice; 
        
        if(e.customerOrders!=null){
            customerOrders = e.customerOrders.length
            totalPrice = getTotalPriceOfOrders(customerOrders);
        }
        else{
            customerOrders = 0;
            totalPrice =0;
        }   
    
        $("#customerTable").append(`
            <tr>
                <th scope="row"><a href="#" class="customer-tab">${e.customerNumber}</a></th>
                <td>${e.firstName}</td>
                <td>${e.lastName}</td>
                <td><a href="mailto:${e.email}">${e.email}</a></td>
                <td>${customerOrders}</td>
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
            let newZipCode = "";
            let newPhoneNumber = `${customer.phoneNumber.substring(0,3)} ${customer.phoneNumber.substring(3,6)} ${customer.phoneNumber.substring(6,8)} ${customer.phoneNumber.substring(8)}`
            sessionStorage.setItem("choosedCustomer", JSON.stringify(customer));

            if(customer.zipCode!=null){
                newZipCode = `${customer.zipCode.substring(0,3)} ${customer.zipCode.substring(3)}`
            }
            
            firstName.val(customer.firstName)
            lastName.val(customer.lastName)
            email.val( customer.email)
            phoneNumber.val(newPhoneNumber)
            address.val(customer.streetAddress)
            city.val(customer.city.name)
            zipCode.val( newZipCode)
            if(isCustomerOrdersNull(customer.customerOrders)>0){
                showOrders(customer.customerOrders);
            } 
        }
    })
}

function isCustomerOrdersNull(orderArr){
    if(orderArr!=null){
        return orderArr.length;
    }
    else{
        return 0;
    }
}


function getTotalPriceOfOrders(orderArr){
    if(orderArr!=null){
        let sum = 0;
        orderArr.forEach(e => {
            sum += e.totalCost;
        })
        return sum;
    }
    else{
        return 0;
    }
}

function filterSearch(){
    //let tempOrders = [];
    let filter = $("#search-select option:selected").text();
    let input = $("#input").val();
  
    console.log(startDate, endDate);
        
    $("#customerTable").empty();
    switch (filter) {
        case 'Visa alla':
            showCustomers(customers);
            break;
        case 'Vip-kunder':
            showCustomers(customers.filter(customer => customer.isVip==true));   
            break;
        case 'Total ordersumma över:':
            if(validateInput()){
                resetsInputBorders()
                if(startDate!=null && endDate!=null){
                    showCustomers(customers.filter(customer => getTotalPriceOfOrders(customer.customerOrders.filter(order => 
                        {let date = new Date(order.orderTimestamp)
                            date>=startDate && date<=endDate
                        })
                    )>input));
                }
            
                else{
                    showCustomers(customers.filter(customer => getTotalPriceOfOrders(customer.customerOrders)>input));
                }
            }
            break;
            case 'Totalt antal ordrar över:':
                if(validateInput()){
                    if(startDate!=null && endDate!=null){
                        showCustomers(customers.filter(customer =>customer.customerOrders.filter(order => 
                            {let date = new Date(order.orderTimestamp)
                                date>=startDate && date<=endDate
                            }).length>input));
                    }
                    else{
                        showCustomers(customers.filter(customer => isCustomerOrdersNull(customer.customerOrders)>input));
                    }
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
    if(validateForm()){
        resetsInputBorders()
        let newPhoneNumber = phoneNumber.val().replaceAll(" ", "");
        console.log("Telefon " + newPhoneNumber)
        let newZipCode = zipCode.val().replaceAll(" ", "");
        console.log("Zip " + newZipCode)

        let data = {
            "firstName" : $(firstName).val(),
            "lastName" : $(lastName).val(),
            "email" : $(email).val(),
            "phoneNumber" : newPhoneNumber,
            "streetAddress" : $(address).val(),
            "city": 
                {
                "name": $(city).val()
                },
            "zipCode" : newZipCode,
            "comment" : $("#commentTextField").val()
        }


        axios.post(updateUser, data)
            .then(() => {
                swal('Kunden är uppdaterad!')
            })
            .catch(() => {
                
                swal('Något gick fel!','Vänligen försök igen', 'warning')
            })
        }
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

  function validateInput(){
      let bool = true;
      bool = checkForInput(testForDecimalNumbers, $$("#input"),bool,INPUT_ERROR_MSG)
      return bool;
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
    resetBorder($("#input"))
  }




        

    